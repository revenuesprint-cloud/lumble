import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

interface GlowCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  glowColor?: string;
  intensity?: "low" | "medium" | "high";
  gradient?: boolean;
}

export function GlowCard({
  children,
  style,
  glowColor = "rgba(232,92,122,0.18)",
  intensity = "medium",
  gradient = false,
}: GlowCardProps) {
  const glowSize = { low: 8, medium: 14, high: 20 }[intensity];

  return (
    <View style={[styles.wrapper, style]}>
      <View
        style={[
          styles.glow,
          {
            shadowColor: glowColor.replace(/[\d.]+\)$/, "1)"),
            shadowRadius: glowSize * 2,
            shadowOpacity: intensity === "high" ? 0.5 : intensity === "medium" ? 0.3 : 0.15,
          },
        ]}
      />
      {gradient ? (
        <LinearGradient
          colors={["#1A1630", "#110F1E"]}
          style={[styles.card, styles.cardInner]}
        >
          {children}
        </LinearGradient>
      ) : (
        <View style={[styles.card, styles.cardSolid]}>{children}</View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
  },
  glow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(240,235,248,0.07)",
    overflow: "hidden",
  },
  cardSolid: {
    backgroundColor: "#110F1E",
  },
  cardInner: {},
});
