import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const TOKEN_KEY   = "@lumble_token";
const SESSION_KEY = "@lumble_session";

// ─── Environment ──────────────────────────────────────────────────────────────
// Set EXPO_PUBLIC_API_URL in your .env to point at your Render backend.
// Falls back to local-only mode (same behaviour as before) when unset.
const API_URL = (process.env.EXPO_PUBLIC_API_URL ?? "").replace(/\/+$/, "");

async function apiPost<T>(path: string, body: Record<string, unknown>, token?: string): Promise<T> {
  const res = await fetch(`${API_URL}/api${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error ?? "Request failed");
  return data as T;
}

// ─── Context type ─────────────────────────────────────────────────────────────

interface AuthContextType {
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  currentEmail: string | null;
  jwtToken: string | null;
  login:            (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout:           () => Promise<void>;
  register:         (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  hasCredentials:   () => Promise<boolean>;
  setSessionDirect: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// ─── Local-only password hash (fallback when backend is unavailable) ──────────

function localHash(str: string): string {
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) + h + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h).toString(36) + str.length.toString(36);
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading,   setIsAuthLoading]   = useState(true);
  const [currentEmail,    setCurrentEmail]    = useState<string | null>(null);
  const [jwtToken,        setJwtToken]        = useState<string | null>(null);

  useEffect(() => { loadSession(); }, []);

  const loadSession = async () => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      if (token) {
        // JWT session (backend auth)
        const raw = await AsyncStorage.getItem(SESSION_KEY);
        const session = raw ? JSON.parse(raw) : {};
        setJwtToken(token);
        setIsAuthenticated(true);
        setCurrentEmail(session.email ?? null);
      } else {
        // Legacy local session
        const raw = await AsyncStorage.getItem(SESSION_KEY);
        if (raw) {
          const session = JSON.parse(raw);
          if (session.isLoggedIn) {
            setIsAuthenticated(true);
            setCurrentEmail(session.email ?? null);
          }
        }
      }
    } catch {}
    setIsAuthLoading(false);
  };

  const register = useCallback(async (email: string, password: string) => {
    const trimEmail = email.toLowerCase().trim();
    if (!trimEmail.includes("@") || trimEmail.length < 5) {
      return { success: false, error: "Please enter a valid email." };
    }
    if (password.length < 6) {
      return { success: false, error: "Password must be at least 6 characters." };
    }

    if (API_URL) {
      try {
        const data = await apiPost<{ token: string; email: string }>("/auth/register", { email: trimEmail, password });
        await AsyncStorage.setItem(TOKEN_KEY, data.token);
        await AsyncStorage.setItem(SESSION_KEY, JSON.stringify({ email: data.email }));
        setJwtToken(data.token);
        setIsAuthenticated(true);
        setCurrentEmail(data.email);
        return { success: true };
      } catch (e: any) {
        return { success: false, error: e.message ?? "Something went wrong." };
      }
    }

    // Local-only fallback
    const creds = { email: trimEmail, passwordHash: localHash(password) };
    await AsyncStorage.setItem("@lumble_creds", JSON.stringify(creds));
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify({ isLoggedIn: true, email: trimEmail }));
    setIsAuthenticated(true);
    setCurrentEmail(trimEmail);
    return { success: true };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const trimEmail = email.toLowerCase().trim();

    if (API_URL) {
      try {
        const data = await apiPost<{ token: string; email: string }>("/auth/login", { email: trimEmail, password });
        await AsyncStorage.setItem(TOKEN_KEY, data.token);
        await AsyncStorage.setItem(SESSION_KEY, JSON.stringify({ email: data.email }));
        setJwtToken(data.token);
        setIsAuthenticated(true);
        setCurrentEmail(data.email);
        return { success: true };
      } catch (e: any) {
        return { success: false, error: e.message ?? "Something went wrong." };
      }
    }

    // Local-only fallback
    try {
      const raw = await AsyncStorage.getItem("@lumble_creds");
      if (!raw) return { success: false, error: "No account found. Complete setup first." };
      const creds = JSON.parse(raw);
      if (creds.email !== trimEmail) return { success: false, error: "Email not found." };
      if (creds.passwordHash !== localHash(password)) return { success: false, error: "Incorrect password." };
      await AsyncStorage.setItem(SESSION_KEY, JSON.stringify({ isLoggedIn: true, email: trimEmail }));
      setIsAuthenticated(true);
      setCurrentEmail(trimEmail);
      return { success: true };
    } catch {
      return { success: false, error: "Something went wrong. Please try again." };
    }
  }, []);

  const logout = useCallback(async () => {
    await AsyncStorage.multiRemove([TOKEN_KEY, SESSION_KEY]);
    setIsAuthenticated(false);
    setCurrentEmail(null);
    setJwtToken(null);
  }, []);

  const hasCredentials = useCallback(async () => {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    if (token) return true;
    const raw = await AsyncStorage.getItem("@lumble_creds");
    return !!raw;
  }, []);

  const setSessionDirect = useCallback(async () => {
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify({ isLoggedIn: true, email: null }));
    setIsAuthenticated(true);
  }, []);

  return (
    <AuthContext.Provider value={{
      isAuthenticated, isAuthLoading, currentEmail, jwtToken,
      login, logout, register, hasCredentials, setSessionDirect,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
