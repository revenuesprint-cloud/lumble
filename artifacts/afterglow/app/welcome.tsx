import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const WELCOME_SEEN_KEY = "@lumble_welcome_seen";

const FEATURES = [
  {
    icon: "moon"            as const,
    title: "Why you clash",
    sub:   "Moon signs, rising, and dasha phase decoded",
    color: "#E85C7A",
  },
  {
    icon: "heart"           as const,
    title: "Emotional patterns",
    sub:   "What keeps repeating between you two, and why",
    color: "#B855E0",
  },
  {
    icon: "message-circle"  as const,
    title: "Honest answers",
    sub:   "Ask the questions you haven't said out loud yet",
    color: "#7C52C8",
  },
];

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const router  = useRouter();

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const logoScale = useRef(new Animated.Value(0.88)).current;
  const orbAnim   = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
      Animated.spring(logoScale, { toValue: 1, friction: 7, tension: 50, useNativeDriver: true }),
    ]).start();

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(orbAnim, { toValue: 1,   duration: 2600, useNativeDriver: true }),
        Animated.timing(orbAnim, { toValue: 0.6, duration: 2600, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  const go = async (mode: "register" | "signin" = "register") => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await AsyncStorage.setItem(WELCOME_SEEN_KEY, "true");
    router.replace({ pathname: "/login", params: { mode } });
  };

  return (
    <LinearGradient colors={["#080611", "#0C0918", "#110818"]} style={{ flex: 1 }}>

      {/* Subtle glow behind logo */}
      <Animated.View style={[styles.bgGlow, { opacity: orbAnim }]} pointerEvents="none" />

      <View style={[styles.container, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 28 }]}>

        {/* Circular logo + wordmark */}
        <Animated.View style={[styles.brand, { opacity: fadeAnim, transform: [{ scale: logoScale }] }]}>
          <Animated.View style={[styles.logoCircle, { opacity: orbAnim }]}>
            <Image
              source={require("../assets/images/logo.png")}
              style={styles.logo}
              resizeMode="cover"
            />
          </Animated.View>
          <Text style={styles.appName}>Lumble</Text>
        </Animated.View>

        {/* Headline */}
        <Animated.View style={[styles.headlineBlock, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <Text style={styles.headline}>Read your relationship{"\n"}through the stars.</Text>
          <Text style={styles.subline}>
            Ancient Vedic astrology, built around your birth chart — not generic horoscopes.
          </Text>
        </Animated.View>

        {/* Feature rows */}
        <Animated.View style={[styles.features, { opacity: fadeAnim }]}>
          {FEATURES.map((f, i) => (
            <View key={i} style={styles.featureRow}>
              <View style={[styles.featureIconWrap, { backgroundColor: f.color + "18", borderColor: f.color + "35" }]}>
                <Feather name={f.icon} size={17} color={f.color} />
              </View>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>{f.title}</Text>
                <Text style={styles.featureSub}>{f.sub}</Text>
              </View>
            </View>
          ))}
        </Animated.View>

        {/* CTA */}
        <Animated.View style={[styles.cta, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <TouchableOpacity onPress={() => go("register")} activeOpacity={0.88} style={styles.primaryBtn}>
            <LinearGradient
              colors={["#E85C7A", "#C44EBA"]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={styles.primaryBtnGrad}
            >
              <Text style={styles.primaryBtnText}>Begin Your Reading</Text>
              <Feather name="arrow-right" size={17} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.trustRow}>
            <Text style={styles.trustText}>Vedic Jyotish</Text>
            <View style={styles.trustDot} />
            <Text style={styles.trustText}>Free to start</Text>
            <View style={styles.trustDot} />
            <Text style={styles.trustText}>No generic advice</Text>
          </View>

          <Pressable onPress={() => go("signin")} style={styles.signInRow}>
            <Text style={styles.signInText}>Already have an account?</Text>
            <Text style={styles.signInLink}> Sign In →</Text>
          </Pressable>
        </Animated.View>

      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: "space-between",
  },

  bgGlow: {
    position: "absolute",
    top: -60,
    left: "15%",
    right: "15%",
    height: 260,
    borderRadius: 160,
    backgroundColor: "rgba(232,92,122,0.07)",
  },

  // Brand
  brand: {
    alignItems: "center",
    gap: 10,
  },
  logoCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "rgba(240,235,248,0.1)",
  },
  logo: {
    width: "100%",
    height: "100%",
  },
  appName: {
    fontSize: 13,
    fontFamily: "Nunito_700Bold",
    color: "rgba(240,235,248,0.4)",
    letterSpacing: 4,
    textTransform: "uppercase",
  },

  // Headline
  headlineBlock: {
    gap: 12,
  },
  headline: {
    fontSize: 32,
    fontFamily: "Nunito_700Bold",
    color: "#F0EBF8",
    lineHeight: 41,
    letterSpacing: -0.3,
  },
  subline: {
    fontSize: 15,
    fontFamily: "Nunito_400Regular",
    color: "rgba(240,235,248,0.5)",
    lineHeight: 23,
  },

  // Features
  features: {
    gap: 12,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  featureIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 13,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  featureText: {
    flex: 1,
    gap: 2,
  },
  featureTitle: {
    fontSize: 15,
    fontFamily: "Nunito_700Bold",
    color: "#F0EBF8",
  },
  featureSub: {
    fontSize: 13,
    fontFamily: "Nunito_400Regular",
    color: "rgba(240,235,248,0.43)",
    lineHeight: 19,
  },

  // CTA
  cta: {
    gap: 12,
  },
  primaryBtn: {
    borderRadius: 16,
    overflow: "hidden",
  },
  primaryBtnGrad: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 17,
    gap: 9,
  },
  primaryBtnText: {
    fontSize: 16,
    fontFamily: "Nunito_700Bold",
    color: "#fff",
    letterSpacing: 0.2,
  },

  trustRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  trustText: {
    fontSize: 12,
    fontFamily: "Nunito_400Regular",
    color: "rgba(240,235,248,0.28)",
  },
  trustDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: "rgba(240,235,248,0.18)",
  },

  signInRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 2,
  },
  signInText: {
    fontSize: 14,
    fontFamily: "Nunito_400Regular",
    color: "rgba(240,235,248,0.35)",
  },
  signInLink: {
    fontSize: 14,
    fontFamily: "Nunito_600SemiBold",
    color: "#E85C7A",
  },
});
