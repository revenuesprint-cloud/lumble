const colors = {
  light: {
    // Backgrounds
    background:     "#F7F5F0",
    card:           "#FFFFFF",
    cardElevated:   "#FAFAF8",
    foreground:     "#0F172A",

    // Text
    text:           "#0F172A",
    textBody:       "#374151",
    textMuted:      "#64748B",
    textFaint:      "#94A3B8",
    cardForeground: "#0F172A",

    // Primary — indigo
    primary:           "#4A3DE8",
    primaryLight:      "#EEF2FF",
    primaryBorder:     "#C7D2FE",
    primaryDark:       "#3730A3",
    primaryForeground: "#FFFFFF",
    tint:              "#4A3DE8",

    // Accent — warm amber
    accent:           "#E8832A",
    accentLight:      "#FEF3C7",
    accentForeground: "#FFFFFF",

    // Semantic
    emerald:      "#10B981",
    emeraldLight: "#ECFDF5",
    emeraldBorder: "#A7F3D0",
    gold:         "#F59E0B",
    goldLight:    "#FFFBEB",
    goldBorder:   "#FDE68A",
    goldMuted:    "#D97706",
    rose:         "#F43F5E",
    roseLight:    "#FFF1F2",
    roseBorder:   "#FECDD3",
    roseDeep:     "#BE123C",
    violet:       "#8B5CF6",
    violetLight:  "#F5F3FF",
    violetBorder: "#DDD6FE",
    violetDeep:   "#6D28D9",

    // Compat aliases
    secondary:           "#F7F5F0",
    secondaryForeground: "#374151",
    muted:               "#F1F5F9",
    mutedForeground:     "#64748B",

    // Borders & inputs
    border:      "#E2E8F0",
    borderLight: "#F1F5F9",
    input:       "#F8FAFC",

    // Dark button (CTA)
    cta:           "#0F172A",
    ctaForeground: "#FFFFFF",

    // Destructive
    destructive:           "#EF4444",
    destructiveForeground: "#FFFFFF",

    // Effects
    overlay:    "rgba(0, 0, 0, 0.5)",
    glow:       "rgba(74, 61, 232, 0.08)",
    glowStrong: "rgba(74, 61, 232, 0.15)",
    glowGold:   "rgba(245, 158, 11, 0.10)",
    glowViolet: "rgba(139, 92, 246, 0.10)",
    shadow:     "rgba(0, 0, 0, 0.06)",
    shadowMd:   "rgba(0, 0, 0, 0.10)",
  },

  dark: {
    // Backgrounds — deep cosmic indigo-black
    background:     "#0E0E16",
    card:           "#1A1A2E",
    cardElevated:   "#222238",
    foreground:     "#F1F5F9",

    // Text
    text:           "#F1F5F9",
    textBody:       "#CBD5E1",
    textMuted:      "#94A3B8",
    textFaint:      "#64748B",
    cardForeground: "#F1F5F9",

    // Primary — slightly brighter indigo for dark bg
    primary:           "#6366F1",
    primaryLight:      "#1E1B4B",
    primaryBorder:     "#3730A3",
    primaryDark:       "#4338CA",
    primaryForeground: "#FFFFFF",
    tint:              "#6366F1",

    // Accent — warm amber (pops on dark)
    accent:           "#F59E0B",
    accentLight:      "#1C1200",
    accentForeground: "#FFFFFF",

    // Semantic
    emerald:      "#10B981",
    emeraldLight: "#052E16",
    emeraldBorder: "#065F46",
    gold:         "#F59E0B",
    goldLight:    "#1C1200",
    goldBorder:   "#713F12",
    goldMuted:    "#D97706",
    rose:         "#F43F5E",
    roseLight:    "#1F0A12",
    roseBorder:   "#9F1239",
    roseDeep:     "#BE123C",
    violet:       "#8B5CF6",
    violetLight:  "#1E0A3C",
    violetBorder: "#4C1D95",
    violetDeep:   "#6D28D9",

    // Compat aliases
    secondary:           "#1A1A2E",
    secondaryForeground: "#CBD5E1",
    muted:               "#222238",
    mutedForeground:     "#94A3B8",

    // Borders & inputs
    border:      "#2D2D4A",
    borderLight: "#1F1F38",
    input:       "#222238",

    // CTA inverts in dark
    cta:           "#F1F5F9",
    ctaForeground: "#0F172A",

    // Destructive
    destructive:           "#EF4444",
    destructiveForeground: "#FFFFFF",

    // Effects
    overlay:    "rgba(0, 0, 0, 0.75)",
    glow:       "rgba(99, 102, 241, 0.15)",
    glowStrong: "rgba(99, 102, 241, 0.28)",
    glowGold:   "rgba(245, 158, 11, 0.15)",
    glowViolet: "rgba(139, 92, 246, 0.18)",
    shadow:     "rgba(0, 0, 0, 0.4)",
    shadowMd:   "rgba(0, 0, 0, 0.55)",
  },

  radius: 16,
};

export type ColorTokens = typeof colors.light;
export default colors;
