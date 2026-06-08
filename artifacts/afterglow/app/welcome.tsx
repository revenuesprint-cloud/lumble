import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Image,
  Platform,
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
    icon: "moon"           as const,
    title: "Why you clash",
    sub:   "Moon signs, rising, and dasha phase decoded",
    color: "#5B4CE8",
    bg:    "#EEF2FF",
  },
  {
    icon: "heart"          as const,
    title: "Emotional patterns",
    sub:   "What keeps repeating between you two, and why",
    color: "#F43F5E",
    bg:    "#FFF1F2",
  },
  {
    icon: "message-circle" as const,
    title: "Honest answers",
    sub:   "Ask the questions you haven't said out loud yet",
    color: "#10B981",
    bg:    "#ECFDF5",
  },
];

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const router  = useRouter();

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;
  const logoScale = useRef(new Animated.Value(0.88)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 350, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 350, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.spring(logoScale, { toValue: 1, friction: 6, tension: 80, useNativeDriver: true }),
    ]).start();
  }, []);

  const go = async (mode: "register" | "signin" = "register") => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await AsyncStorage.setItem(WELCOME_SEEN_KEY, "true");
    router.replace({ pathname: "/login", params: { mode } });
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F4F5F7" }}>
      {/* Top decorative band */}
      <LinearGradient
        colors={["#5B4CE8", "#8B5CF6"]}
        style={styles.topBand}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
      />

      <View style={[styles.container, { paddingTop: insets.top + 32, paddingBottom: insets.bottom + 28, maxWidth: Platform.OS === "web" ? 480 : undefined, alignSelf: Platform.OS === "web" ? "center" : undefined, width: Platform.OS === "web" ? "100%" : undefined }]}>

        {/* Brand */}
        <Animated.View style={[styles.brand, { opacity: fadeAnim, transform: [{ scale: logoScale }] }]}>
          <View style={styles.logoCircle}>
            <Image
              source={require("../assets/images/logo.png")}
              style={styles.logo}
              resizeMode="cover"
            />
          </View>
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
              <View style={[styles.featureIconWrap, { backgroundColor: f.bg }]}>
                <Feather name={f.icon} size={18} color={f.color} />
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
              colors={["#5B4CE8", "#8B5CF6"]}
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
    </View>
  );
}

const styles = StyleSheet.create({
  topBand: {
    position: "absolute",
    top: 0, left: 0, right: 0,
    height: 4,
  },
  container: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: "space-between",
  },

  // Brand
  brand: { alignItems: "center", gap: 12 },
  logoCircle: {
    width: 72, height: 72, borderRadius: 36,
    overflow: "hidden", borderWidth: 2, borderColor: "#E5E7EB",
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 4,
  },
  logo:    { width: "100%", height: "100%" },
  appName: {
    fontSize: 13, fontFamily: "PlusJakartaSans_700Bold",
    color: "#9CA3AF", letterSpacing: 4, textTransform: "uppercase",
  },

  // Headline
  headlineBlock: { gap: 12 },
  headline: {
    fontSize: 32, fontFamily: "PlusJakartaSans_700Bold",
    color: "#111827", lineHeight: 41, letterSpacing: -0.3,
  },
  subline: {
    fontSize: 15, fontFamily: "PlusJakartaSans_400Regular",
    color: "#6B7280", lineHeight: 23,
  },

  // Features
  features:    { gap: 14 },
  featureRow:  { flexDirection: "row", alignItems: "center", gap: 14 },
  featureIconWrap: {
    width: 44, height: 44, borderRadius: 14,
    alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  featureText:  { flex: 1, gap: 2 },
  featureTitle: { fontSize: 15, fontFamily: "PlusJakartaSans_700Bold", color: "#111827" },
  featureSub:   { fontSize: 13, fontFamily: "PlusJakartaSans_400Regular", color: "#6B7280", lineHeight: 19 },

  // CTA
  cta:          { gap: 12 },
  primaryBtn:   { borderRadius: 16, overflow: "hidden" },
  primaryBtnGrad: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    paddingVertical: 17, gap: 9,
  },
  primaryBtnText: { fontSize: 16, fontFamily: "PlusJakartaSans_700Bold", color: "#fff", letterSpacing: 0.2 },

  trustRow: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
  },
  trustText: { fontSize: 12, fontFamily: "PlusJakartaSans_400Regular", color: "#9CA3AF" },
  trustDot:  { width: 3, height: 3, borderRadius: 2, backgroundColor: "#D1D5DB" },

  signInRow:  { flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 2 },
  signInText: { fontSize: 14, fontFamily: "PlusJakartaSans_400Regular", color: "#9CA3AF" },
  signInLink: { fontSize: 14, fontFamily: "PlusJakartaSans_600SemiBold", color: "#5B4CE8" },
});
