import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useMemo, useState } from "react";
import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface PremiumGateProps {
  visible: boolean;
  onClose: () => void;
  featureName?: string;
}

const PERKS = [
  { icon: "heart"         as const, text: "Full emotional compatibility breakdown (7 sections)" },
  { icon: "zap"           as const, text: "All 10 deep insight cards unlocked" },
  { icon: "message-circle"as const, text: "Unlimited oracle conversations" },
  { icon: "eye"           as const, text: "Hidden relationship pattern readings" },
  { icon: "alert-triangle"as const, text: "Emotional red flag + green flag analysis" },
  { icon: "refresh-cw"    as const, text: "Ghosting probability & reunion potential" },
];

export function PremiumGate({ visible, onClose, featureName }: PremiumGateProps) {
  const insets = useSafeAreaInsets();
  const { upgradeToPremium, syncProfileToServer } = useApp();
  const { jwtToken } = useAuth();
  const c = useColors();
  const s = useMemo(() => createStyles(c), [c]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error,   setError]   = useState(false);

  const handleUpgrade = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLoading(true);
    setError(false);
    try {
      await upgradeToPremium(jwtToken ?? undefined);
      setSuccess(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setTimeout(() => { setSuccess(false); onClose(); }, 1400);
    } catch {
      setLoading(false);
      setError(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={s.backdrop}>
        <Pressable style={s.backdropPress} onPress={onClose} />
        <View style={[s.sheet, { paddingBottom: insets.bottom + 24 }]}>
          <View style={s.handle} />

          {success ? (
            <View style={s.successBox}>
              <View style={s.successIconCircle}>
                <Feather name="check" size={28} color="#10B981" />
              </View>
              <Text style={s.successTitle}>Premium Unlocked</Text>
              <Text style={s.successSub}>Everything is now open for you.</Text>
            </View>
          ) : (
            <>
              {/* Header */}
              <View style={s.headerRow}>
                <View style={s.lockCircle}>
                  <Feather name="lock" size={20} color="#4A3DE8" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.title}>Unlock Everything</Text>
                  <Text style={s.sub} numberOfLines={2}>
                    {featureName
                      ? `"${featureName}" is a Premium insight.`
                      : "Your full compatibility picture is waiting."}
                  </Text>
                </View>
              </View>

              {/* Perks */}
              <View style={s.perksBox}>
                {PERKS.map((perk, i) => (
                  <View key={i} style={s.perkRow}>
                    <View style={s.perkIconBox}>
                      <Feather name={perk.icon} size={13} color="#4A3DE8" />
                    </View>
                    <Text style={s.perkText}>{perk.text}</Text>
                  </View>
                ))}
              </View>

              {error && (
                <Text style={s.errorText}>Something went wrong. Tap to try again.</Text>
              )}

              {/* CTA */}
              <Pressable
                onPress={handleUpgrade}
                disabled={loading}
                style={({ pressed }) => [s.upgradeBtn, loading && { opacity: 0.6 }, pressed && { opacity: 0.85 }]}
              >
                <View style={s.upgradeBtnInner}>
                  {loading ? (
                    <ActivityIndicator color={c.ctaForeground} size="small" />
                  ) : (
                    <>
                      <Text style={s.upgradeBtnText}>Unlock Premium</Text>
                      <View style={s.upgradeArrow}>
                        <Feather name="arrow-right" size={16} color={c.ctaForeground} />
                      </View>
                    </>
                  )}
                </View>
              </Pressable>

              <Text style={s.priceNote}>$9.99 / month · Cancel anytime</Text>

              <Pressable onPress={onClose} style={s.cancelBtn}>
                <Text style={s.cancelText}>Maybe later</Text>
              </Pressable>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

function createStyles(c: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    backdrop:     { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.45)" },
    backdropPress:{ ...StyleSheet.absoluteFillObject },
    sheet: {
      backgroundColor: c.card,
      borderTopLeftRadius: 28, borderTopRightRadius: 28,
      borderTopWidth: 1, borderColor: c.border,
      paddingHorizontal: 24, paddingTop: 16, gap: 16,
    },
    handle: { width: 40, height: 4, backgroundColor: c.borderLight, borderRadius: 2, alignSelf: "center", marginBottom: 4 },

    headerRow:   { flexDirection: "row", alignItems: "center", gap: 14 },
    lockCircle:  { width: 48, height: 48, borderRadius: 14, backgroundColor: c.primaryLight, alignItems: "center", justifyContent: "center", flexShrink: 0 },
    title:       { fontSize: 18, fontFamily: "PlusJakartaSans_800ExtraBold", color: c.text, letterSpacing: -0.2 },
    sub:         { fontSize: 13, fontFamily: "PlusJakartaSans_400Regular", color: c.textMuted, lineHeight: 19, marginTop: 2 },

    perksBox:   { backgroundColor: c.input, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: c.border, gap: 10 },
    perkRow:    { flexDirection: "row", alignItems: "center", gap: 10 },
    perkIconBox:{ width: 26, height: 26, borderRadius: 8, backgroundColor: c.primaryLight, alignItems: "center", justifyContent: "center", flexShrink: 0 },
    perkText:   { flex: 1, fontSize: 13, fontFamily: "PlusJakartaSans_400Regular", color: c.textBody, lineHeight: 19 },

    errorText: { fontSize: 13, fontFamily: "PlusJakartaSans_400Regular", color: "#F43F5E", textAlign: "center" },

    upgradeBtn:      { borderRadius: 16, overflow: "hidden", marginTop: 4 },
    upgradeBtnInner: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: c.cta, paddingVertical: 17, paddingLeft: 22, paddingRight: 8 },
    upgradeBtnText:  { fontSize: 16, fontFamily: "PlusJakartaSans_700Bold", color: c.ctaForeground },
    upgradeArrow:    { width: 38, height: 38, borderRadius: 11, backgroundColor: c.card, alignItems: "center", justifyContent: "center" },

    priceNote: { fontSize: 12, fontFamily: "PlusJakartaSans_400Regular", color: c.textFaint, textAlign: "center", marginTop: -4 },

    cancelBtn:  { alignItems: "center", paddingVertical: 8 },
    cancelText: { fontSize: 14, fontFamily: "PlusJakartaSans_500Medium", color: c.textFaint },

    successBox:        { alignItems: "center", gap: 12, paddingVertical: 32 },
    successIconCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: "#ECFDF5", borderWidth: 1, borderColor: "#A7F3D0", alignItems: "center", justifyContent: "center" },
    successTitle:      { fontSize: 22, fontFamily: "PlusJakartaSans_800ExtraBold", color: c.text, letterSpacing: -0.3 },
    successSub:        { fontSize: 15, fontFamily: "PlusJakartaSans_400Regular", color: c.textMuted },
  });
}
