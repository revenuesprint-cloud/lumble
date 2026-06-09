import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
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
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <>
                      <Text style={s.upgradeBtnText}>Unlock Premium</Text>
                      <View style={s.upgradeArrow}>
                        <Feather name="arrow-right" size={16} color="#0F172A" />
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

const s = StyleSheet.create({
  backdrop:     { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.45)" },
  backdropPress:{ ...StyleSheet.absoluteFillObject },
  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    borderTopWidth: 1, borderColor: "#E2E8F0",
    paddingHorizontal: 24, paddingTop: 16, gap: 16,
  },
  handle: { width: 40, height: 4, backgroundColor: "#CBD5E1", borderRadius: 2, alignSelf: "center", marginBottom: 4 },

  headerRow:   { flexDirection: "row", alignItems: "center", gap: 14 },
  lockCircle:  { width: 48, height: 48, borderRadius: 14, backgroundColor: "#EEF2FF", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  title:       { fontSize: 18, fontFamily: "PlusJakartaSans_800ExtraBold", color: "#0F172A", letterSpacing: -0.2 },
  sub:         { fontSize: 13, fontFamily: "PlusJakartaSans_400Regular", color: "#64748B", lineHeight: 19, marginTop: 2 },

  perksBox:   { backgroundColor: "#F8FAFC", borderRadius: 14, padding: 14, borderWidth: 1, borderColor: "#E2E8F0", gap: 10 },
  perkRow:    { flexDirection: "row", alignItems: "center", gap: 10 },
  perkIconBox:{ width: 26, height: 26, borderRadius: 8, backgroundColor: "#EEF2FF", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  perkText:   { flex: 1, fontSize: 13, fontFamily: "PlusJakartaSans_400Regular", color: "#374151", lineHeight: 19 },

  errorText: { fontSize: 13, fontFamily: "PlusJakartaSans_400Regular", color: "#F43F5E", textAlign: "center" },

  upgradeBtn:      { borderRadius: 16, overflow: "hidden", marginTop: 4 },
  upgradeBtnInner: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "#0F172A", paddingVertical: 17, paddingLeft: 22, paddingRight: 8 },
  upgradeBtnText:  { fontSize: 16, fontFamily: "PlusJakartaSans_700Bold", color: "#FFFFFF" },
  upgradeArrow:    { width: 38, height: 38, borderRadius: 11, backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center" },

  priceNote: { fontSize: 12, fontFamily: "PlusJakartaSans_400Regular", color: "#94A3B8", textAlign: "center", marginTop: -4 },

  cancelBtn:  { alignItems: "center", paddingVertical: 8 },
  cancelText: { fontSize: 14, fontFamily: "PlusJakartaSans_500Medium", color: "#94A3B8" },

  successBox:        { alignItems: "center", gap: 12, paddingVertical: 32 },
  successIconCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: "#ECFDF5", borderWidth: 1, borderColor: "#A7F3D0", alignItems: "center", justifyContent: "center" },
  successTitle:      { fontSize: 22, fontFamily: "PlusJakartaSans_800ExtraBold", color: "#0F172A", letterSpacing: -0.3 },
  successSub:        { fontSize: 15, fontFamily: "PlusJakartaSans_400Regular", color: "#64748B" },
});
