import { Dimensions, Platform } from "react-native";

const { width: W } = Dimensions.get("window");

/** Design base width (iPhone 14 Pro — 390 logical pixels). */
const BASE = 390;

/**
 * Scale a layout dimension proportionally to the current screen width.
 * Capped at 125% to avoid over-scaling on tablets / landscape.
 */
export const rs = (px: number): number =>
  Math.round(px * Math.min(W / BASE, 1.25));

/**
 * Scale a font size — more conservative than rs(), always ≥ 82% of original.
 * This keeps text readable even on tiny screens while preventing huge text on large ones.
 */
export const rf = (px: number): number =>
  Math.max(Math.round(px * Math.min(W / BASE, 1.12)), Math.round(px * 0.82));

/** Horizontal screen padding: 14 on small (< 360), 24 on large (> 430), 20 standard. */
export const HP: number = W < 360 ? 14 : W > 430 ? 24 : 20;

/** True when running in a web browser. */
export const IS_WEB: boolean = Platform.OS === "web";

/** True for phones narrower than 360px (iPhone SE, some Android budget phones). */
export const IS_SMALL: boolean = W < 360;

/** True for wide screens (tablets, web, large phones in landscape). */
export const IS_WIDE: boolean = W >= 640;

/** Current logical screen width. */
export const SCREEN_W: number = W;

/**
 * Standard web/wide-screen scroll container style.
 * Apply to the `style` prop of a ScrollView to center + cap content width on web/tablet.
 */
export const webScrollStyle =
  Platform.OS === "web"
    ? ({ maxWidth: 640, alignSelf: "center" as const, width: "100%" as const })
    : undefined;
