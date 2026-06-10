import colors, { type ColorTokens } from "@/constants/colors";
import { useTheme } from "@/context/ThemeContext";
import { useMemo } from "react";

export type Colors = ColorTokens & { radius: number };

export function useColors(): Colors {
  const { isDark } = useTheme();
  return useMemo(
    () => ({ ...(isDark ? colors.dark : colors.light), radius: colors.radius }),
    [isDark]
  );
}
