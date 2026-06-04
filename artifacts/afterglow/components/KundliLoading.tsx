import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

export function KundliLoading({ label = "Reading your stars…" }: { label?: string }) {
  const pulse = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.5, duration: 900, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  return (
    <LinearGradient colors={["#080611", "#0D0A1E"]} style={styles.container}>
      <Animated.View style={[styles.orb, { opacity: pulse }]}>
        <LinearGradient
          colors={["rgba(232,92,122,0.3)", "rgba(184,85,224,0.15)", "transparent"]}
          style={styles.orbGrad}
        >
          <Text style={styles.glyph}>◉</Text>
        </LinearGradient>
      </Animated.View>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.dotsRow}>
        {[0, 1, 2].map((i) => (
          <Animated.View key={i} style={[styles.dot, { opacity: pulse }]} />
        ))}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", gap: 20 },
  orb:       { alignItems: "center", justifyContent: "center" },
  orbGrad:   { width: 100, height: 100, borderRadius: 50, alignItems: "center", justifyContent: "center" },
  glyph:     { fontSize: 40, color: "#E85C7A" },
  label:     { fontSize: 16, fontFamily: "Nunito_400Regular", color: "rgba(240,235,248,0.5)" },
  dotsRow:   { flexDirection: "row", gap: 6 },
  dot:       { width: 6, height: 6, borderRadius: 3, backgroundColor: "#E85C7A" },
});
