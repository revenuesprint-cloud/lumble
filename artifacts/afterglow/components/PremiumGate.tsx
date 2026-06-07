import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface PremiumGateProps {
  visible: boolean;
  onClose: () => void;
  featureName?: string;
}

const PERKS = [
  "Full emotional compatibility breakdown (7 sections)",
  "All 10 deep insight cards unlocked",
  "Unlimited oracle conversations",
  "Hidden relationship pattern readings",
  "Emotional red flag + green flag analysis",
  "Ghosting probability & reunion potential",
];

export function PremiumGate({ visible, onClose, featureName }: PremiumGateProps) {
  const insets  = useSafeAreaInsets();
  const { upgradeToPremium, syncProfileToServer } = useApp();
  const { jwtToken } = useAuth();
  const [loading,  setLoading]  = useState(false);
  const [success,  setSuccess]  = useState(false);
  const [error,    setError]    = useState(false);

  const handleUpgrade = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLoading(true);
    setError(false);
    try {
      await upgradeToPremium(jwtToken ?? undefined);
      setSuccess(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1400);
    } catch {
      setLoading(false);
      setError(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={[styles.sheet, { paddingBottom: insets.bottom + 24 }]}>
          <View style={styles.handle} />

          {success ? (
            <View style={styles.successContainer}>
              <Text style={styles.successIcon}>◈</Text>
              <Text style={styles.successTitle}>Premium Unlocked</Text>
              <Text style={styles.successSub}>Everything is now open for you.</Text>
            </View>
          ) : (
            <>
              <Text style={styles.lockIcon}>◈</Text>
              <Text style={styles.title}>Unlock Everything</Text>
              <Text style={styles.sub}>
                {featureName
                  ? `"${featureName}" is a deep insight unlocked with Premium.`
                  : "Your compatibility picture has more depth. Premium opens all of it."}
              </Text>

              <View style={styles.perksContainer}>
                {PERKS.map((perk, i) => (
                  <View key={i} style={styles.perkRow}>
                    <Text style={styles.perkDot}>·</Text>
                    <Text style={styles.perkText}>{perk}</Text>
                  </View>
                ))}
              </View>

              {error && (
                <Text style={styles.errorText}>Something went wrong. Tap to try again.</Text>
              )}

              <Pressable
                onPress={handleUpgrade}
                disabled={loading}
                style={[styles.upgradeBtn, loading && { opacity: 0.7 }]}
              >
                <LinearGradient
                  colors={["#5B4CE8", "#8B5CF6"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.upgradeGradient}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <>
                      <Text style={styles.upgradeBtnText}>Unlock Premium</Text>
                      <Text style={styles.upgradePriceText}>$9.99 / month</Text>
                    </>
                  )}
                </LinearGradient>
              </Pressable>

              <Pressable onPress={onClose} style={styles.cancelBtn}>
                <Text style={styles.cancelText}>Maybe later</Text>
              </Pressable>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.45)" },
  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    borderTopWidth: 1, borderColor: "#E5E7EB",
    paddingHorizontal: 28, paddingTop: 16, gap: 16,
  },
  handle: { width: 40, height: 4, backgroundColor: "#D1D5DB", borderRadius: 2, alignSelf: "center", marginBottom: 8 },
  lockIcon: { fontSize: 36, color: "#5B4CE8", textAlign: "center" },
  title: { fontSize: 24, fontFamily: "Nunito_700Bold", color: "#111827", textAlign: "center" },
  sub: { fontSize: 15, fontFamily: "Nunito_400Regular", color: "#6B7280", textAlign: "center", lineHeight: 22 },
  perksContainer: { gap: 10, backgroundColor: "#F9FAFB", borderRadius: 14, padding: 16, borderWidth: 1, borderColor: "#E5E7EB" },
  perkRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  perkDot: { color: "#5B4CE8", fontSize: 10 },
  perkText: { fontSize: 14, fontFamily: "Nunito_400Regular", color: "#374151", flex: 1 },
  upgradeBtn: { borderRadius: 16, overflow: "hidden", marginTop: 4 },
  upgradeGradient: { paddingVertical: 18, alignItems: "center", gap: 2, minHeight: 56, justifyContent: "center" },
  upgradeBtnText: { fontSize: 17, fontFamily: "Nunito_700Bold", color: "#fff" },
  upgradePriceText: { fontSize: 12, fontFamily: "Nunito_400Regular", color: "rgba(255,255,255,0.7)" },
  cancelBtn: { alignItems: "center", padding: 8 },
  cancelText: { fontSize: 14, color: "#9CA3AF", fontFamily: "Nunito_400Regular" },
  errorText:  { fontSize: 13, fontFamily: "Nunito_400Regular", color: "#F43F5E", textAlign: "center" },
  successContainer: { alignItems: "center", gap: 10, paddingVertical: 32 },
  successIcon: { fontSize: 48, color: "#10B981" },
  successTitle: { fontSize: 24, fontFamily: "Nunito_700Bold", color: "#111827" },
  successSub: { fontSize: 15, fontFamily: "Nunito_400Regular", color: "#6B7280" },
});
