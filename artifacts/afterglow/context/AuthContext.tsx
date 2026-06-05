import AsyncStorage from "@react-native-async-storage/async-storage";
// ── Vulnerability 8 (MEDIUM): AsyncStorage is unencrypted plaintext on Android.
// SecureStore uses iOS Keychain and Android Keystore for the JWT token.
// Non-sensitive session metadata (email) can stay in AsyncStorage.
import * as SecureStore from "expo-secure-store";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const TOKEN_KEY   = "lumble_token";   // SecureStore key (no @ prefix needed)
const SESSION_KEY = "@lumble_session"; // AsyncStorage — email only, not sensitive

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

// ─── JWT expiry check (no library needed — just decode the payload) ───────────

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    // ── Vulnerability 7 (MEDIUM): missing exp must be treated as expired, not
    // valid. A crafted or malformed token without an expiry would otherwise
    // appear permanently valid on the client side.
    if (!payload.exp) return true;
    // 60-second buffer so we re-authenticate slightly before true expiry
    return payload.exp * 1000 < Date.now() + 60_000;
  } catch {
    return true; // malformed token → treat as expired
  }
}

// ─── Context type ─────────────────────────────────────────────────────────────

export interface ServerProfile {
  userName: string;
  userBirthDate: string;
  userBirthTime?: string | null;
  partnerName: string;
  partnerBirthDate: string;
  relationshipType: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isAuthLoading:   boolean;
  currentEmail:    string | null;
  jwtToken:        string | null;
  // profile is null for brand-new users who haven't completed onboarding
  login:    (email: string, password: string) => Promise<{ success: boolean; error?: string; profile?: ServerProfile | null }>;
  logout:   () => Promise<void>;
  register: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// ─── Local-only fallback hash ─────────────────────────────────────────────────

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
      const token = await SecureStore.getItemAsync(TOKEN_KEY);

      if (token) {
        if (isTokenExpired(token)) {
          // Expired — wipe everything so the user is prompted to log in again
          await SecureStore.deleteItemAsync(TOKEN_KEY);
          await AsyncStorage.removeItem(SESSION_KEY);
        } else {
          const raw = await AsyncStorage.getItem(SESSION_KEY);
          const session = raw ? JSON.parse(raw) : {};
          setJwtToken(token);
          setIsAuthenticated(true);
          setCurrentEmail(session.email ?? null);
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
        await SecureStore.setItemAsync(TOKEN_KEY, data.token);
        await AsyncStorage.setItem(SESSION_KEY, JSON.stringify({ email: data.email }));
        setJwtToken(data.token);
        setIsAuthenticated(true);
        setCurrentEmail(data.email);
        return { success: true };
      } catch (e: any) {
        return { success: false, error: e.message ?? "Something went wrong." };
      }
    }

    // Local-only fallback (dev mode — no API server)
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
        const data = await apiPost<{ token: string; email: string; profile: ServerProfile | null }>(
          "/auth/login", { email: trimEmail, password }
        );
        await SecureStore.setItemAsync(TOKEN_KEY, data.token);
        await AsyncStorage.setItem(SESSION_KEY, JSON.stringify({ email: data.email }));
        setJwtToken(data.token);
        setIsAuthenticated(true);
        setCurrentEmail(data.email);
        return { success: true, profile: data.profile ?? null };
      } catch (e: any) {
        return { success: false, error: e.message ?? "Something went wrong." };
      }
    }

    // Local-only fallback (dev mode — no API server)
    try {
      const raw = await AsyncStorage.getItem("@lumble_creds");
      if (!raw) return { success: false, error: "No account found. Please create one first." };
      const creds = JSON.parse(raw);
      if (creds.email !== trimEmail) return { success: false, error: "Email not found." };
      if (creds.passwordHash !== localHash(password)) return { success: false, error: "Incorrect password." };
      await AsyncStorage.setItem(SESSION_KEY, JSON.stringify({ isLoggedIn: true, email: trimEmail }));
      setIsAuthenticated(true);
      setCurrentEmail(trimEmail);
      return { success: true, profile: null };
    } catch {
      return { success: false, error: "Something went wrong. Please try again." };
    }
  }, []);

  const logout = useCallback(async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await AsyncStorage.multiRemove([SESSION_KEY, "@lumble_creds"]);
    setIsAuthenticated(false);
    setCurrentEmail(null);
    setJwtToken(null);
  }, []);

  return (
    <AuthContext.Provider value={{
      isAuthenticated, isAuthLoading,
      currentEmail, jwtToken,
      login, logout, register,
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
