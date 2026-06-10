import { useColors } from "@/hooks/useColors";
import React, { useEffect, useMemo, useRef } from "react";
import { Animated, Easing, Image, StyleSheet, Text, View } from "react-native";

export function KundliLoading({ label = "Loading your profile…" }: { label?: string }) {
  const c = useColors();
  const styles = useMemo(() => createStyles(c), [c]);
  const pulse = useRef(new Animated.Value(0.4)).current;
  const dots  = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];

  useEffect(() => {
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1,   duration: 700, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.4, duration: 700, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    );
    pulseLoop.start();

    const dotLoops = dots.map((dot, i) => {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.delay(i * 140),
          Animated.timing(dot, { toValue: 1,   duration: 280, easing: Easing.out(Easing.quad), useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0.2, duration: 280, easing: Easing.in(Easing.quad),  useNativeDriver: true }),
          Animated.delay(280),
        ])
      );
      loop.start();
      return loop;
    });

    return () => { pulseLoop.stop(); dotLoops.forEach((l) => l.stop()); };
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[
        styles.logoCircle,
        { opacity: pulse, transform: [{ scale: pulse.interpolate({ inputRange: [0.4, 1], outputRange: [0.95, 1.02] }) }] },
      ]}>
        <Image source={require("../assets/images/logo.png")} style={styles.logoImg} resizeMode="cover" />
      </Animated.View>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.dotsRow}>
        {dots.map((dot, i) => (
          <Animated.View
            key={i}
            style={[styles.dot, { opacity: dot, transform: [{ scale: dot.interpolate({ inputRange: [0.2, 1], outputRange: [0.7, 1] }) }] }]}
          />
        ))}
      </View>
    </View>
  );
}

function createStyles(c: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    container:  { flex: 1, alignItems: "center", justifyContent: "center", gap: 20, backgroundColor: c.background },
    logoCircle: {
      width: 80, height: 80, borderRadius: 24, overflow: "hidden",
      shadowColor: "#000", shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08, shadowRadius: 12, elevation: 4,
    },
    logoImg:  { width: "100%", height: "100%" },
    label:    { fontSize: 15, fontFamily: "PlusJakartaSans_500Medium", color: c.textFaint },
    dotsRow:  { flexDirection: "row", gap: 8 },
    dot:      { width: 7, height: 7, borderRadius: 4, backgroundColor: "#4A3DE8" },
  });
}
