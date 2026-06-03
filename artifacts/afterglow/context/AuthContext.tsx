import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const AUTH_CREDS_KEY = "@afterglow_creds";
const AUTH_SESSION_KEY = "@afterglow_session";

interface Credentials {
  email: string;
  passwordHash: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  currentEmail: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  register: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  hasCredentials: () => Promise<boolean>;
  setSessionDirect: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

function simpleHash(str: string): string {
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) + h + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h).toString(36) + str.length.toString(36);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [currentEmail, setCurrentEmail] = useState<string | null>(null);

  useEffect(() => {
    loadSession();
  }, []);

  const loadSession = async () => {
    try {
      const raw = await AsyncStorage.getItem(AUTH_SESSION_KEY);
      if (raw) {
        const session = JSON.parse(raw);
        if (session.isLoggedIn) {
          setIsAuthenticated(true);
          setCurrentEmail(session.email || null);
        }
      }
    } catch {}
    setIsAuthLoading(false);
  };

  const login = useCallback(async (email: string, password: string) => {
    try {
      const raw = await AsyncStorage.getItem(AUTH_CREDS_KEY);
      if (!raw) return { success: false, error: "No account found. Complete setup first." };
      const creds: Credentials = JSON.parse(raw);
      if (creds.email.toLowerCase() !== email.toLowerCase().trim()) {
        return { success: false, error: "Email not found." };
      }
      if (creds.passwordHash !== simpleHash(password)) {
        return { success: false, error: "Incorrect password." };
      }
      await AsyncStorage.setItem(AUTH_SESSION_KEY, JSON.stringify({ isLoggedIn: true, email: creds.email }));
      setIsAuthenticated(true);
      setCurrentEmail(creds.email);
      return { success: true };
    } catch {
      return { success: false, error: "Something went wrong. Please try again." };
    }
  }, []);

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem(AUTH_SESSION_KEY);
    setIsAuthenticated(false);
    setCurrentEmail(null);
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    try {
      if (!email.includes("@") || email.length < 5) {
        return { success: false, error: "Please enter a valid email." };
      }
      if (password.length < 6) {
        return { success: false, error: "Password must be at least 6 characters." };
      }
      const creds: Credentials = { email: email.toLowerCase().trim(), passwordHash: simpleHash(password) };
      await AsyncStorage.setItem(AUTH_CREDS_KEY, JSON.stringify(creds));
      await AsyncStorage.setItem(AUTH_SESSION_KEY, JSON.stringify({ isLoggedIn: true, email: creds.email }));
      setIsAuthenticated(true);
      setCurrentEmail(creds.email);
      return { success: true };
    } catch {
      return { success: false, error: "Something went wrong. Please try again." };
    }
  }, []);

  const hasCredentials = useCallback(async () => {
    const raw = await AsyncStorage.getItem(AUTH_CREDS_KEY);
    return !!raw;
  }, []);

  // Used when bypassing normal auth (demo / onboarding without account creation)
  const setSessionDirect = useCallback(async () => {
    await AsyncStorage.setItem(AUTH_SESSION_KEY, JSON.stringify({ isLoggedIn: true, email: null }));
    setIsAuthenticated(true);
  }, []);

  return (
    <AuthContext.Provider value={{
      isAuthenticated, isAuthLoading, currentEmail,
      login, logout, register, hasCredentials, setSessionDirect,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
