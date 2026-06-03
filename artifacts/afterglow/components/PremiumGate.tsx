import { useApp } from "@/context/AppContext";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface PremiumGateProps {
  visible: boolean;
  onClose: () => void;
  featureName?: string;
}

export function PremiumGate({ visible, onClose, featureName }: PremiumGateProps) {
  const insets = useSafeAreaInsets();
  const { upgradeToPremium } = useApp();

  const handleUpgrade = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    upgradeToPremium();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={[styles.sheet, { paddingBottom: insets.bottom + 24 }]}>
          <View style={styles.handle} />
          <Text style={styles.lockIcon}>◈</Text>
          <Text style={styles.title}>Premium Insight</Text>
          <Text style={styles.sub}>
            {featureName
              ? `"${featureName}" is a deep analysis unlocked with Premium.`
              : "This insight goes deeper than the surface. Unlock it with Premium."}
          </Text>

          <View style={styles.perksContainer}>
            {[
              "Full emotional compatibility analysis",
              "All 10 viral features unlocked",
              "Unlimited guidance conversations",
              "Deep relationship pattern readings",
              "Future emotional forecasts",
            ].map((perk, i) => (
              <View key={i} style={styles.perkRow}>
                <Text style={styles.perkDot}>◉</Text>
                <Text style={styles.perkText}>{perk}</Text>
              </View>
            ))}
          </View>

          <Pressable onPress={handleUpgrade} style={styles.upgradeBtn}>
            <LinearGradient
              colors={["#E85C7A", "#B855E0"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.upgradeGradient}
            >
              <Text style={styles.upgradeBtnText}>Unlock Premium</Text>
              <Text style={styles.upgradePriceText}>$9.99 / month</Text>
            </LinearGradient>
          </Pressable>

          <Pressable onPress={onClose} style={styles.cancelBtn}>
            <Text style={styles.cancelText}>Maybe later</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(8,6,17,0.7)",
  },
  sheet: {
    backgroundColor: "#110F1E",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1,
    borderColor: "rgba(232,92,122,0.2)",
    paddingHorizontal: 28,
    paddingTop: 16,
    gap: 16,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: "rgba(240,235,248,0.15)",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 8,
  },
  lockIcon: {
    fontSize: 36,
    color: "#E85C7A",
    textAlign: "center",
  },
  title: {
    fontSize: 24,
    fontFamily: "Inter_700Bold",
    color: "#F0EBF8",
    textAlign: "center",
  },
  sub: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    color: "rgba(240,235,248,0.6)",
    textAlign: "center",
    lineHeight: 22,
  },
  perksContainer: {
    gap: 10,
    backgroundColor: "rgba(240,235,248,0.04)",
    borderRadius: 14,
    padding: 16,
  },
  perkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  perkDot: {
    color: "#E85C7A",
    fontSize: 10,
  },
  perkText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "rgba(240,235,248,0.7)",
  },
  upgradeBtn: {
    borderRadius: 16,
    overflow: "hidden",
    marginTop: 4,
  },
  upgradeGradient: {
    paddingVertical: 18,
    alignItems: "center",
    gap: 2,
  },
  upgradeBtnText: {
    fontSize: 17,
    fontFamily: "Inter_700Bold",
    color: "#fff",
  },
  upgradePriceText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.6)",
  },
  cancelBtn: {
    alignItems: "center",
    padding: 8,
  },
  cancelText: {
    fontSize: 14,
    color: "rgba(240,235,248,0.3)",
    fontFamily: "Inter_400Regular",
  },
});
