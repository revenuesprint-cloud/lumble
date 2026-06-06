import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import { Animated, Image, StyleSheet, Text, View } from "react-native";


export function KundliLoading({ label = "Loading your profile…" }: { label?: string }) {
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
      <Animated.View style={[styles.logoCircle, { opacity: pulse }]}>
        <Image
          source={require("../assets/images/logo.png")}
          style={styles.logoImg}
          resizeMode="cover"
        />
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
  logoCircle: { width: 80, height: 80, borderRadius: 40, overflow: "hidden" },
  logoImg:    { width: "100%", height: "100%" },
  label:     { fontSize: 16, fontFamily: "Nunito_400Regular", color: "rgba(240,235,248,0.5)" },
  dotsRow:   { flexDirection: "row", gap: 6 },
  dot:       { width: 6, height: 6, borderRadius: 3, backgroundColor: "#E85C7A" },
});
