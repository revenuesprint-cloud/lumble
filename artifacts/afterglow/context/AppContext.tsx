import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

export type RelationshipType = "crush" | "situationship" | "relationship" | "ex";

export interface UserProfile {
  name: string;
  birthDate: string;
  birthTime?: string;
}

export interface PartnerProfile {
  name: string;
  birthDate: string;
  relationshipType: RelationshipType;
}

export interface GuidanceMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: number;
}

interface AppContextType {
  isLoading: boolean;
  hasCompletedOnboarding: boolean;
  user: UserProfile | null;
  partner: PartnerProfile | null;
  isPremium: boolean;
  guidanceMessages: GuidanceMessage[];
  completeOnboarding:    (user: UserProfile, partner: PartnerProfile) => Promise<void>;
  addGuidanceMessage:    (msg: GuidanceMessage) => void;
  clearGuidanceMessages: () => void;
  upgradeToPremium:      (token?: string) => Promise<void>;
  resetApp:              () => Promise<void>;
  syncProfileToServer:   (token: string, overrideUser?: UserProfile, overridePartner?: PartnerProfile) => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEY = "@lumble_data";
const API_URL     = (process.env.EXPO_PUBLIC_API_URL ?? "").replace(/\/+$/, "");

// ─── Minimal API helper ───────────────────────────────────────────────────────

async function apiRequest(method: string, path: string, body: unknown, token: string): Promise<unknown> {
  const hasBody = body !== undefined && body !== null && method !== "GET" && method !== "HEAD";
  const res = await fetch(`${API_URL}/api${path}`, {
    method,
    headers: {
      ...(hasBody ? { "Content-Type": "application/json" } : {}),
      Authorization: `Bearer ${token}`,
    },
    ...(hasBody ? { body: JSON.stringify(body) } : {}),
  });
  return res.ok ? res.json() : null;
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isLoading,               setIsLoading]               = useState(true);
  const [hasCompletedOnboarding,  setHasCompletedOnboarding]  = useState(false);
  const [user,                    setUser]                     = useState<UserProfile | null>(null);
  const [partner,                 setPartner]                  = useState<PartnerProfile | null>(null);
  const [isPremium,               setIsPremium]               = useState(false);
  const [guidanceMessages,        setGuidanceMessages]        = useState<GuidanceMessage[]>([]);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        setUser(data.user || null);
        setPartner(data.partner || null);
        setIsPremium(data.isPremium || false);
        setGuidanceMessages(data.guidanceMessages || []);
        setHasCompletedOnboarding(!!data.user && !!data.partner);
      }

      // Sync premium status from server (fire-and-forget, don't block boot)
      if (API_URL) {
        const token = await AsyncStorage.getItem("@lumble_token");
        if (token) {
          const me = await apiRequest("GET", "/me", undefined, token).catch(() => null) as any;
          if (me?.profile?.isPremium) {
            setIsPremium(true);
            // Persist updated premium flag locally
            if (raw) {
              const data = JSON.parse(raw);
              if (!data.isPremium) {
                data.isPremium = true;
                await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
              }
            }
          }
        }
      }
    } catch {}
    finally { setIsLoading(false); }
  };

  const saveData = useCallback(async (
    u: UserProfile | null, p: PartnerProfile | null,
    premium: boolean, msgs: GuidanceMessage[]
  ) => {
    await AsyncStorage.setItem(STORAGE_KEY,
      JSON.stringify({ user: u, partner: p, isPremium: premium, guidanceMessages: msgs }));
  }, []);

  const completeOnboarding = useCallback(async (u: UserProfile, p: PartnerProfile) => {
    setUser(u);
    setPartner(p);
    setHasCompletedOnboarding(true);
    await saveData(u, p, isPremium, guidanceMessages);
  }, [isPremium, guidanceMessages, saveData]);

  // ── Backend sync: push profile after onboarding or premium upgrade ──
  const syncProfileToServer = useCallback(async (token: string, overrideUser?: UserProfile, overridePartner?: PartnerProfile) => {
    const u = overrideUser ?? user;
    const p = overridePartner ?? partner;
    if (!API_URL || !u || !p) return;
    try {
      await apiRequest("PUT", "/profile", {
        userName:         u.name,
        userBirthDate:    u.birthDate,
        userBirthTime:    u.birthTime,
        partnerName:      p.name,
        partnerBirthDate: p.birthDate,
        relationshipType: p.relationshipType,
      }, token);
    } catch {}
  }, [user, partner]);

  const addGuidanceMessage = useCallback((msg: GuidanceMessage) => {
    setGuidanceMessages((prev) => [...prev, msg]);
  }, []);

  const clearGuidanceMessages = useCallback(() => {
    setGuidanceMessages([]);
  }, []);

  // Persist messages whenever they change (skip initial mount)
  const isMounted = useRef(false);
  useEffect(() => {
    if (!isMounted.current) { isMounted.current = true; return; }
    saveData(user, partner, isPremium, guidanceMessages);
  }, [guidanceMessages]);

  const upgradeToPremium = useCallback(async (token?: string) => {
    setIsPremium(true);
    await saveData(user, partner, true, guidanceMessages);
    if (token && API_URL) {
      try { await apiRequest("POST", "/profile/premium", {}, token); } catch {}
    }
  }, [user, partner, guidanceMessages, saveData]);

  const resetApp = useCallback(async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setUser(null);
    setPartner(null);
    setHasCompletedOnboarding(false);
    setIsPremium(false);
    setGuidanceMessages([]);
  }, []);

  return (
    <AppContext.Provider value={{
      isLoading, hasCompletedOnboarding,
      user, partner, isPremium, guidanceMessages,
      completeOnboarding, addGuidanceMessage, clearGuidanceMessages,
      upgradeToPremium, resetApp, syncProfileToServer,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
