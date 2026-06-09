import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
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
    color: "#4A3DE8",
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
  const slideAnim = useRef(new Animated.Value(28)).current;
  const logoScale = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 400, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 400, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.spring(logoScale, { toValue: 1, friction: 7, tension: 80, useNativeDriver: true }),
    ]).start();
  }, []);

  const go = async (mode: "register" | "signin" = "register") => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await AsyncStorage.setItem(WELCOME_SEEN_KEY, "true");
    router.replace({ pathname: "/login", params: { mode } });
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={[styles.container, Platform.OS === "web" && styles.webContainer]}>

        {/* Brand block */}
        <Animated.View style={[styles.brand, { opacity: fadeAnim, transform: [{ scale: logoScale }] }]}>
          <View style={styles.logoWrap}>
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
          <Text style={styles.headlineLight}>Read your relationship</Text>
          <Text style={styles.headlineBold}>through the stars.</Text>
          <Text style={styles.subline}>
            Vedic astrology built around your birth chart — not generic horoscopes.
          </Text>
        </Animated.View>

        {/* Feature rows */}
        <Animated.View style={[styles.features, { opacity: fadeAnim }]}>
          {FEATURES.map((f, i) => (
            <View key={i} style={styles.featureRow}>
              <View style={[styles.featureIcon, { backgroundColor: f.bg }]}>
                <Feather name={f.icon} size={18} color={f.color} />
              </View>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>{f.title}</Text>
                <Text style={styles.featureSub}>{f.sub}</Text>
              </View>
            </View>
          ))}
        </Animated.View>

        {/* CTA block */}
        <Animated.View style={[styles.ctaBlock, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>

          <TouchableOpacity onPress={() => go("register")} activeOpacity={0.88} style={styles.primaryBtn}>
            <Text style={styles.primaryBtnText}>Get Started Free</Text>
            <View style={styles.primaryBtnArrow}>
              <Feather name="arrow-right" size={16} color="#0F172A" />
            </View>
          </TouchableOpacity>

          <View style={styles.trustRow}>
            <Text style={styles.trustText}>Vedic Jyotish</Text>
            <View style={styles.trustDot} />
            <Text style={styles.trustText}>Free to start</Text>
            <View style={styles.trustDot} />
            <Text style={styles.trustText}>No generic advice</Text>
          </View>

          <Pressable onPress={() => go("signin")} style={styles.signInRow}>
            <Text style={styles.signInText}>Already have an account? </Text>
            <Text style={styles.signInLink}>Sign In</Text>
          </Pressable>

        </Animated.View>

        {/* Footer */}
        <Text style={styles.footer}>
          Lumble is built by Tirthantech. All astrological insights are for reflection purposes only.
        </Text>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F7F5F0",
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 36,
    paddingBottom: 20,
    justifyContent: "space-between",
  },
  webContainer: {
    maxWidth: 480,
    alignSelf: "center",
    width: "100%",
  },

  // Brand
  brand: {
    alignItems: "center",
    gap: 10,
  },
  logoWrap: {
    width: 72, height: 72,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  logo: { width: "100%", height: "100%" },
  appName: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans_700Bold",
    color: "#94A3B8",
    letterSpacing: 4,
    textTransform: "uppercase",
  },

  // Headline
  headlineBlock: { gap: 8 },
  headlineLight: {
    fontSize: 30,
    fontFamily: "PlusJakartaSans_500Medium",
    color: "#0F172A",
    lineHeight: 38,
    letterSpacing: -0.3,
  },
  headlineBold: {
    fontSize: 30,
    fontFamily: "PlusJakartaSans_800ExtraBold",
    color: "#0F172A",
    lineHeight: 38,
    letterSpacing: -0.5,
  },
  subline: {
    marginTop: 4,
    fontSize: 14,
    fontFamily: "PlusJakartaSans_400Regular",
    color: "#64748B",
    lineHeight: 22,
  },

  // Features
  features:    { gap: 16 },
  featureRow:  { flexDirection: "row", alignItems: "center", gap: 14 },
  featureIcon: {
    width: 46, height: 46,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  featureText:  { flex: 1, gap: 2 },
  featureTitle: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans_700Bold",
    color: "#0F172A",
  },
  featureSub: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans_400Regular",
    color: "#64748B",
    lineHeight: 19,
  },

  // CTA block
  ctaBlock: { gap: 12 },
  primaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#0F172A",
    borderRadius: 16,
    paddingVertical: 18,
    paddingLeft: 22,
    paddingRight: 8,
  },
  primaryBtnText: {
    fontSize: 16,
    fontFamily: "PlusJakartaSans_700Bold",
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },
  primaryBtnArrow: {
    width: 38, height: 38,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  trustRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  trustText: {
    fontSize: 12,
    fontFamily: "PlusJakartaSans_400Regular",
    color: "#94A3B8",
  },
  trustDot: {
    width: 3, height: 3,
    borderRadius: 2,
    backgroundColor: "#CBD5E1",
  },

  signInRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
  },
  signInText: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans_400Regular",
    color: "#94A3B8",
  },
  signInLink: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans_700Bold",
    color: "#4A3DE8",
  },

  // Footer
  footer: {
    fontSize: 11,
    fontFamily: "PlusJakartaSans_400Regular",
    color: "#CBD5E1",
    textAlign: "center",
    lineHeight: 16,
  },
});
