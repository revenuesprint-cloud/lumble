import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useColorScheme } from "react-native";

export type ThemeMode = "system" | "light" | "dark";

interface ThemeContextValue {
  mode:    ThemeMode;
  isDark:  boolean;
  setMode: (mode: ThemeMode) => void;
}

const STORAGE_KEY = "@lumble_theme";

const ThemeContext = createContext<ThemeContextValue>({
  mode:    "system",
  isDark:  false,
  setMode: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme          = useColorScheme();
  const [mode, setModeState]  = useState<ThemeMode>("system");
  const [ready, setReady]     = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((v) => {
      if (v === "light" || v === "dark" || v === "system") setModeState(v);
      setReady(true);
    }).catch(() => setReady(true));
  }, []);

  const setMode = (m: ThemeMode) => {
    setModeState(m);
    AsyncStorage.setItem(STORAGE_KEY, m).catch(() => {});
  };

  const isDark = mode === "dark" || (mode === "system" && systemScheme === "dark");

  const value = useMemo<ThemeContextValue>(
    () => ({ mode, isDark, setMode }),
    [mode, isDark]
  );

  // Don't render until persisted preference is loaded — prevents flash
  if (!ready) return null;

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
