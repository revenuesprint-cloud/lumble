import { useColors } from "@/hooks/useColors";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo } from "react";
import {
  Modal,
  Platform,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SIGN_EMOJI: Record<string, string> = {
  Aries: "♈", Taurus: "♉", Gemini: "♊", Cancer: "♋",
  Leo: "♌", Virgo: "♍", Libra: "♎", Scorpio: "♏",
  Sagittarius: "♐", Capricorn: "♑", Aquarius: "♒", Pisces: "♓",
};

const ELEMENT_COLOR: Record<string, string> = {
  Fire: "#F43F5E",
  Earth: "#10B981",
  Air: "#4A3DE8",
  Water: "#8B5CF6",
};

function getTagline(pct: number): string {
  if (pct >= 88) return "dangerously compatible";
  if (pct >= 75) return "cosmically written";
  if (pct >= 62) return "unexplainably drawn";
  if (pct >= 50) return "complicated but worth it";
  return "opposites that attract";
}

// Hardcoded star positions so the card looks consistent every time
const STARS: { x: string; y: number; o: number; size: number }[] = [
  { x: "8%",  y: 18,  o: 0.55, size: 2 },
  { x: "22%", y: 44,  o: 0.35, size: 1.5 },
  { x: "88%", y: 22,  o: 0.65, size: 2.5 },
  { x: "76%", y: 58,  o: 0.45, size: 1.5 },
  { x: "14%", y: 128, o: 0.45, size: 2 },
  { x: "91%", y: 138, o: 0.55, size: 1.5 },
  { x: "50%", y: 18,  o: 0.25, size: 1 },
  { x: "65%", y: 88,  o: 0.40, size: 2 },
  { x: "35%", y: 168, o: 0.45, size: 1.5 },
  { x: "80%", y: 198, o: 0.28, size: 1 },
  { x: "42%", y: 240, o: 0.35, size: 2 },
  { x: "6%",  y: 220, o: 0.30, size: 1 },
];

const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.lumble.app";

interface Props {
  visible: boolean;
  onClose: () => void;
  userName: string;
  partnerName: string;
  compatibilityScore: number; // out of 36
  userMoonSign: string;
  partnerMoonSign: string;
  userElement: string;
  partnerElement: string;
}

export function ShareCardModal({
  visible, onClose,
  userName, partnerName,
  compatibilityScore,
  userMoonSign, partnerMoonSign,
  userElement, partnerElement,
}: Props) {
  const insets = useSafeAreaInsets();
  const c = useColors();
  const styles = useMemo(() => createStyles(c), [c]);
  const pct     = Math.round((compatibilityScore / 36) * 100);
  const tagline = getTagline(pct);

  const uColor = ELEMENT_COLOR[userElement]    ?? "#8B5CF6";
  const pColor = ELEMENT_COLOR[partnerElement] ?? "#8B5CF6";

  const handleShareScore = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await Share.share({
        message: `me & ${partnerName}: ${pct}% cosmically compatible 🌙\n\n"${tagline}"\n\nget Lumble — download on the Play Store:\n${PLAY_STORE_URL}`,
        title:   `${userName} & ${partnerName} — ${pct}% compatible`,
      });
    } catch {}
  };

  const handleInvitePartner = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const shareContent = {
      message: `i checked if we're cosmically compatible 👀\n\nthe stars had thoughts about us… lmk if you wanna know\n\nget Lumble on the Play Store:\n${PLAY_STORE_URL}`,
    };
    try {
      await Share.share(shareContent);
    } catch {}
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={[styles.sheet, { paddingBottom: insets.bottom + 20 }]}>
          {/* Handle */}
          <View style={styles.handle} />

          {/* Close */}
          <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7} hitSlop={8}>
            <Feather name="x" size={18} color={c.textMuted} />
          </TouchableOpacity>

          {/* ── THE SHAREABLE CARD — dark gradient stays as-is ─── */}
          <LinearGradient
            colors={["#0f0a2e", "#1e1b4b", "#2d1f6e"]}
            start={{ x: 0.2, y: 0 }}
            end={{ x: 0.8, y: 1 }}
            style={styles.card}
          >
            {/* Decorative stars */}
            {STARS.map((s, i) => (
              <View
                key={i}
                style={[
                  styles.star,
                  { top: s.y, left: s.x as any, opacity: s.o, width: s.size, height: s.size },
                ]}
              />
            ))}

            {/* Moon top */}
            <Text style={styles.moonTop}>🌙</Text>

            {/* Names row */}
            <View style={styles.namesRow}>
              <View style={styles.personBlock}>
                <Text style={styles.signEmoji}>{SIGN_EMOJI[userMoonSign] ?? "✦"}</Text>
                <Text style={styles.personName}>{userName}</Text>
                <View style={[styles.elementBadge, { backgroundColor: uColor + "28" }]}>
                  <Text style={[styles.elementText, { color: uColor }]}>{userElement}</Text>
                </View>
              </View>

              <Text style={styles.cross}>×</Text>

              <View style={styles.personBlock}>
                <Text style={styles.signEmoji}>{SIGN_EMOJI[partnerMoonSign] ?? "✦"}</Text>
                <Text style={styles.personName}>{partnerName}</Text>
                <View style={[styles.elementBadge, { backgroundColor: pColor + "28" }]}>
                  <Text style={[styles.elementText, { color: pColor }]}>{partnerElement}</Text>
                </View>
              </View>
            </View>

            {/* Score */}
            <Text style={styles.score}>
              {pct}<Text style={styles.scorePct}>%</Text>
            </Text>
            <Text style={styles.scoreLabel}>cosmically compatible</Text>

            {/* Tagline */}
            <View style={styles.taglinePill}>
              <Text style={styles.taglineText}>"{tagline}"</Text>
            </View>

            {/* Moon signs */}
            <Text style={styles.signsLine}>
              {userMoonSign} moon × {partnerMoonSign} moon
            </Text>

            {/* Branding */}
            <View style={styles.brand}>
              <View style={styles.brandDot} />
              <Text style={styles.brandName}>afterglow</Text>
            </View>
          </LinearGradient>

          {/* Screenshot hint */}
          <Text style={styles.hint}>Screenshot to share on Stories ✦</Text>

          {/* CTA: share score */}
          <TouchableOpacity onPress={handleShareScore} style={styles.primaryBtn} activeOpacity={0.85}>
            <Feather name="share-2" size={16} color={c.ctaForeground} />
            <Text style={styles.primaryBtnText}>Share your score</Text>
          </TouchableOpacity>

          {/* CTA: invite partner */}
          <TouchableOpacity onPress={handleInvitePartner} style={styles.secondaryBtn} activeOpacity={0.85}>
            <Feather name="send" size={16} color="#4A3DE8" />
            <Text style={styles.secondaryBtnText}>Send to {partnerName}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

function createStyles(c: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.72)",
      justifyContent: "flex-end",
    },
    sheet: {
      backgroundColor: c.card,
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
      paddingHorizontal: 20,
      paddingTop: 12,
      alignItems: "center",
      gap: 13,
    },
    handle: {
      width: 36,
      height: 4,
      borderRadius: 2,
      backgroundColor: c.borderLight,
      marginBottom: 2,
    },
    closeBtn: {
      position: "absolute",
      top: 16,
      right: 20,
      width: 36,
      height: 36,
      borderRadius: 10,
      backgroundColor: c.input,
      borderWidth: 1,
      borderColor: c.border,
      alignItems: "center",
      justifyContent: "center",
      zIndex: 10,
    },

    // ── Card (dark gradient — stays as-is) ───────────────────────────────────
    card: {
      width: "100%",
      borderRadius: 20,
      paddingVertical: 28,
      paddingHorizontal: 24,
      alignItems: "center",
      gap: 11,
      overflow: "hidden",
    },
    star: {
      position: "absolute",
      borderRadius: 99,
      backgroundColor: "#FFFFFF",
    },
    moonTop:  { fontSize: 28, marginBottom: 2 },

    namesRow: { flexDirection: "row", alignItems: "center", gap: 14, width: "100%", justifyContent: "center" },
    personBlock: { alignItems: "center", gap: 5, flex: 1 },
    signEmoji:   { fontSize: 22 },
    personName:  { fontSize: 15, fontFamily: "PlusJakartaSans_700Bold", color: "#FFFFFF" },
    elementBadge:{ borderRadius: 20, paddingHorizontal: 9, paddingVertical: 3 },
    elementText: { fontSize: 10, fontFamily: "PlusJakartaSans_600SemiBold" },
    cross:       { fontSize: 22, color: "rgba(255,255,255,0.35)", fontFamily: "PlusJakartaSans_400Regular" },

    score:      { fontSize: 72, fontFamily: "PlusJakartaSans_800ExtraBold", color: "#FFFFFF", lineHeight: 80, marginTop: 6 },
    scorePct:   { fontSize: 32, fontFamily: "PlusJakartaSans_400Regular", color: "rgba(255,255,255,0.55)" },
    scoreLabel: { fontSize: 11, fontFamily: "PlusJakartaSans_500Medium", color: "rgba(255,255,255,0.55)", textTransform: "uppercase", letterSpacing: 1.6, marginTop: -6 },

    taglinePill: {
      backgroundColor: "rgba(255,255,255,0.1)",
      borderRadius: 20,
      paddingHorizontal: 18,
      paddingVertical: 9,
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.18)",
      marginTop: 2,
    },
    taglineText: { fontSize: 13, fontFamily: "PlusJakartaSans_500Medium", color: "rgba(255,255,255,0.88)", textAlign: "center" },

    signsLine: { fontSize: 11, fontFamily: "PlusJakartaSans_400Regular", color: "rgba(255,255,255,0.45)", textAlign: "center", marginTop: 2 },

    brand:     { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 6 },
    brandDot:  { width: 6, height: 6, borderRadius: 3, backgroundColor: "#8B5CF6" },
    brandName: { fontSize: 13, fontFamily: "PlusJakartaSans_700Bold", color: "rgba(255,255,255,0.65)", letterSpacing: 0.6 },

    // ── Bottom actions ────────────────────────────────────────────────────────
    hint: {
      fontSize: 12,
      fontFamily: "PlusJakartaSans_500Medium",
      color: c.textFaint,
      textAlign: "center",
    },
    primaryBtn: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      backgroundColor: c.cta,
      borderRadius: 14,
      paddingVertical: 15,
      width: "100%",
    },
    primaryBtnText: { fontSize: 15, fontFamily: "PlusJakartaSans_700Bold", color: c.ctaForeground },

    secondaryBtn: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      backgroundColor: c.primaryLight,
      borderRadius: 14,
      paddingVertical: 15,
      width: "100%",
      borderWidth: 1,
      borderColor: c.primaryBorder,
    },
    secondaryBtnText: { fontSize: 15, fontFamily: "PlusJakartaSans_700Bold", color: "#4A3DE8" },
  });
}
