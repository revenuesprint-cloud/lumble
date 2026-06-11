import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Platform } from "react-native";
import type { Challenge } from "@/utils/challenges";
import { fetchJourney, fetchContentBundle, setContentBundle } from "@/utils/dbContent";

const secureGet = (key: string) =>
  Platform.OS === "web"
    ? AsyncStorage.getItem(key)
    : SecureStore.getItemAsync(key);

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
  challenges: Challenge[];
  challengesLoading: boolean;
  completeOnboarding:    (user: UserProfile, partner: PartnerProfile) => Promise<void>;
  addGuidanceMessage:    (msg: GuidanceMessage) => void;
  clearGuidanceMessages: () => void;
  upgradeToPremium:      (token?: string) => Promise<void>;
  resetApp:              () => Promise<void>;
  syncProfileToServer:   (token: string, overrideUser?: UserProfile, overridePartner?: PartnerProfile) => Promise<void>;
  loadChallenges:        () => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEY            = "@lumble_data";
const CHALLENGES_STORAGE_KEY = "@lumble_challenges";
const API_URL                = (process.env.EXPO_PUBLIC_API_URL ?? "").replace(/\/+$/, "");

// Compute kundli-based tags for content matching (mirrors extractKundliAttributes logic)
async function buildKundliTags(user: UserProfile, partner: PartnerProfile): Promise<string[]> {
  try {
    const { getAstrologyReading, RASHIS, NAKSHATRAS } = await import("@/utils/astrology");
    const reading = getAstrologyReading(user.name, user.birthDate, partner.name, partner.birthDate, user.birthTime);
    const uMoon   = RASHIS[reading.user.moonRashi];
    const pMoon   = RASHIS[reading.partner.moonRashi];
    const uNak    = NAKSHATRAS[reading.user.nakshatra];
    const pNak    = NAKSHATRAS[reading.partner.nakshatra];
    const elemCombo = `${uMoon.element}_${pMoon.element}`;
    return [
      "universal",
      `rel_type:${partner.relationshipType}`,
      `moon:${uMoon.en}`,
      `partner_moon:${pMoon.en}`,
      `element:${uMoon.element}`,
      `partner_element:${pMoon.element}`,
      `element_combo:${elemCombo}`,
      `nakshatra:${uNak.name}`,
      `partner_nakshatra:${pNak.name}`,
      `dasha:${reading.user.dasha.current}`,
      ...(reading.guna.nadiDosha   ? ["dosha:nadi"]   : []),
      ...(reading.guna.mangalDosha ? ["dosha:mangal"] : []),
    ];
  } catch { return ["universal"]; }
}

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
  const [challenges,              setChallenges]              = useState<Challenge[]>([]);
  const [challengesLoading,       setChallengesLoading]       = useState(false);

  useEffect(() => { loadData(); loadCachedChallenges(); }, []);

  const loadCachedChallenges = async () => {
    try {
      const raw = await AsyncStorage.getItem(CHALLENGES_STORAGE_KEY);
      if (raw) setChallenges(JSON.parse(raw));
    } catch {}
  };

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

      // Sync server state (premium + journey) — fire-and-forget, don't block boot
      if (API_URL) {
        // Token is in SecureStore (moved from AsyncStorage for security)
        const token = await secureGet("lumble_token").catch(() => null);
        if (token) {
          // 0. Fetch content bundle with auth — server uses stored kundliTags from profile
          const parsedData = raw ? JSON.parse(raw) : null;
          if (parsedData?.user && parsedData?.partner) {
            buildKundliTags(parsedData.user, parsedData.partner).then((tags) =>
              fetchContentBundle(tags, token).then((b) => { if (b) setContentBundle(b); })
            );
          }

          // 1. Premium status
          const me = await apiRequest("GET", "/me", undefined, token).catch(() => null) as any;
          if (me?.profile?.isPremium) {
            setIsPremium(true);
            if (raw) {
              const data = JSON.parse(raw);
              if (!data.isPremium) {
                data.isPremium = true;
                await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
              }
            }
          }

          // 2. Journey states — sync from server so challenge progress
          //    is consistent across devices and after re-installs
          const journey = await fetchJourney(token);
          if (journey.length > 0) {
            const states: Record<string, string> = {};
            for (const entry of journey) {
              if (entry.problem?.id) states[entry.problem.id] = entry.state;
            }
            await AsyncStorage.setItem("@lumble_challenge_states", JSON.stringify(states));
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
    // Prefetch content bundle for new user (no token yet — server uses body tags)
    buildKundliTags(u, p).then(async (tags) => {
      const token = await secureGet("lumble_token").catch(() => null);
      fetchContentBundle(tags, token).then((b) => { if (b) setContentBundle(b); });
    });

    // Fire-and-forget: load challenges immediately after onboarding
    setTimeout(async () => {
      try {
        const { fetchChallenges } = await import("@/utils/challenges");
        const { getAstrologyReading } = await import("@/utils/astrology");
        const reading = getAstrologyReading(u.name, u.birthDate, p.name, p.birthDate, u.birthTime);
        const { challenges: result } = await fetchChallenges(reading, p.relationshipType);
        if (result.length > 0) {
          setChallenges(result);
          await AsyncStorage.setItem(CHALLENGES_STORAGE_KEY, JSON.stringify(result));
        }
      } catch {}
    }, 800);
  }, [isPremium, guidanceMessages, saveData]);

  // ── Backend sync: push profile after onboarding or premium upgrade ──
  const syncProfileToServer = useCallback(async (token: string, overrideUser?: UserProfile, overridePartner?: PartnerProfile) => {
    const u = overrideUser ?? user;
    const p = overridePartner ?? partner;
    if (!API_URL || !u || !p) return;
    try {
      const kundliTags = await buildKundliTags(u, p);
      await apiRequest("PUT", "/profile", {
        userName:         u.name,
        userBirthDate:    u.birthDate,
        userBirthTime:    u.birthTime,
        partnerName:      p.name,
        partnerBirthDate: p.birthDate,
        relationshipType: p.relationshipType,
        kundliTags,
      }, token);
    } catch {}
  }, [user, partner]);

  const addGuidanceMessage = useCallback((msg: GuidanceMessage) => {
    setGuidanceMessages((prev) => [...prev, msg]);
  }, []);

  const clearGuidanceMessages = useCallback(() => {
    setGuidanceMessages([]);
  }, []);

  // Persist messages whenever they change (skip initial mount).
  // All deps included so the closure always captures current profile state.
  const isMounted = useRef(false);
  useEffect(() => {
    if (!isMounted.current) { isMounted.current = true; return; }
    saveData(user, partner, isPremium, guidanceMessages);
  }, [guidanceMessages, user, partner, isPremium, saveData]);

  const loadChallenges = useCallback(async () => {
    if (!user || !partner) return;
    setChallengesLoading(true);
    try {
      const { fetchChallenges } = await import("@/utils/challenges");
      const { getAstrologyReading } = await import("@/utils/astrology");
      const reading = getAstrologyReading(user.name, user.birthDate, partner.name, partner.birthDate, user.birthTime);
      const { challenges: result } = await fetchChallenges(reading, partner.relationshipType);
      if (result.length > 0) {
        setChallenges(result);
        await AsyncStorage.setItem(CHALLENGES_STORAGE_KEY, JSON.stringify(result));
      }
    } catch {}
    finally { setChallengesLoading(false); }
  }, [user, partner]);

  const upgradeToPremium = useCallback(async (token?: string) => {
    setIsPremium(true);
    await saveData(user, partner, true, guidanceMessages);
    if (token && API_URL) {
      try { await apiRequest("POST", "/profile/premium", {}, token); } catch {}
    }
  }, [user, partner, guidanceMessages, saveData]);

  const resetApp = useCallback(async () => {
    await AsyncStorage.multiRemove([
      STORAGE_KEY,
      CHALLENGES_STORAGE_KEY,
      "@lumble_challenge_states",
      "@lumble_journey",
      "@lumble_content_daily",
      "@lumble_questions",
      "@lumble_content_bundle",
      "@lumble_streak",
      "@lumble_together_since",
    ]);
    setContentBundle(null);
    setUser(null);
    setPartner(null);
    setHasCompletedOnboarding(false);
    setIsPremium(false);
    setGuidanceMessages([]);
    setChallenges([]);
  }, []);

  return (
    <AppContext.Provider value={{
      isLoading, hasCompletedOnboarding,
      user, partner, isPremium, guidanceMessages,
      challenges, challengesLoading,
      completeOnboarding, addGuidanceMessage, clearGuidanceMessages,
      upgradeToPremium, resetApp, syncProfileToServer, loadChallenges,
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
