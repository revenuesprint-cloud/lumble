import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export type RelationshipType = "crush" | "situationship" | "relationship" | "ex";

export interface UserProfile {
  name: string;
  birthDate: string; // ISO date string
  birthTime?: string; // "HH:MM" optional
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
  completeOnboarding: (user: UserProfile, partner: PartnerProfile) => Promise<void>;
  addGuidanceMessage: (msg: GuidanceMessage) => void;
  upgradeToPremium: () => void;
  resetApp: () => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEY = "@afterglow_data";

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [partner, setPartner] = useState<PartnerProfile | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [guidanceMessages, setGuidanceMessages] = useState<GuidanceMessage[]>([]);

  useEffect(() => {
    loadData();
  }, []);

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
    } catch (e) {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  const saveData = useCallback(
    async (
      u: UserProfile | null,
      p: PartnerProfile | null,
      premium: boolean,
      msgs: GuidanceMessage[]
    ) => {
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ user: u, partner: p, isPremium: premium, guidanceMessages: msgs })
      );
    },
    []
  );

  const completeOnboarding = useCallback(
    async (u: UserProfile, p: PartnerProfile) => {
      setUser(u);
      setPartner(p);
      setHasCompletedOnboarding(true);
      await saveData(u, p, isPremium, guidanceMessages);
    },
    [isPremium, guidanceMessages, saveData]
  );

  const addGuidanceMessage = useCallback(
    (msg: GuidanceMessage) => {
      setGuidanceMessages((prev) => {
        const updated = [...prev, msg];
        saveData(user, partner, isPremium, updated);
        return updated;
      });
    },
    [user, partner, isPremium, saveData]
  );

  const upgradeToPremium = useCallback(() => {
    setIsPremium(true);
    saveData(user, partner, true, guidanceMessages);
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
    <AppContext.Provider
      value={{
        isLoading,
        hasCompletedOnboarding,
        user,
        partner,
        isPremium,
        guidanceMessages,
        completeOnboarding,
        addGuidanceMessage,
        upgradeToPremium,
        resetApp,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
