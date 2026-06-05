import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const WELCOME_SEEN_KEY = "@lumble_welcome_seen";

const FEATURES = [
  {
    icon: "star" as const,
    color: "#F5A623",
    title: "Vedic Compatibility",
    desc: "Kundli-based matching across 36 gunas, doshas, and planetary alignments",
  },
  {
    icon: "activity" as const,
    color: "#E85C7A",
    title: "Relationship Patterns",
    desc: "Understand the emotional and communication dynamics shaping your bond",
  },
  {
    icon: "message-circle" as const,
    color: "#B855E0",
    title: "AI Oracle Guide",
    desc: "Ask anything — get answers rooted in your unique astrological profile",
  },
  {
    icon: "heart" as const,
    color: "#52C8B8",
    title: "Healing Journey",
    desc: "Acknowledge patterns and track your progress toward resolution",
  },
];

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const orbAnim   = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 700, useNativeDriver: true }),
    ]).start();

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(orbAnim, { toValue: 1,   duration: 2200, useNativeDriver: true }),
        Animated.timing(orbAnim, { toValue: 0.8, duration: 2200, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  const handleGetStarted = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await AsyncStorage.setItem(WELCOME_SEEN_KEY, "true");
    router.replace("/login");
  };

  const handleSignIn = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await AsyncStorage.setItem(WELCOME_SEEN_KEY, "true");
    router.replace("/login");
  };

  return (
    <LinearGradient colors={["#080611", "#0D0A1E", "#110818"]} style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 32 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Orb + Logo */}
        <Animated.View style={[styles.heroSection, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <Animated.View style={{ opacity: orbAnim }}>
            <LinearGradient
              colors={["rgba(232,92,122,0.35)", "rgba(184,85,224,0.2)", "rgba(124,82,200,0.1)"]}
              style={styles.orbGlow}
            >
              <LinearGradient
                colors={["#E85C7A", "#B855E0", "#7C52C8"]}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={styles.orb}
              >
                <Text style={styles.orbGlyph}>◉</Text>
              </LinearGradient>
            </LinearGradient>
          </Animated.View>

          <Text style={styles.appName}>Lumble</Text>
          <Text style={styles.tagline}>
            Understand your connection{"\n"}through the lens of the stars
          </Text>
          <Text style={styles.subTagline}>
            Ancient astrology meets modern insight
          </Text>
        </Animated.View>

        {/* Feature cards */}
        <Animated.View style={[styles.featuresSection, { opacity: fadeAnim }]}>
          {FEATURES.map((f, i) => (
            <FeatureRow key={i} {...f} delay={200 + i * 80} />
          ))}
        </Animated.View>

        {/* CTA */}
        <Animated.View style={[styles.ctaSection, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <TouchableOpacity onPress={handleGetStarted} activeOpacity={0.88} style={styles.getStartedBtn}>
            <LinearGradient
              colors={["#E85C7A", "#B855E0"]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={styles.getStartedGradient}
            >
              <Text style={styles.getStartedText}>Get Started</Text>
              <Feather name="arrow-right" size={20} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>

          <Pressable onPress={handleSignIn} style={styles.signInRow}>
            <Text style={styles.signInText}>Already have an account? </Text>
            <Text style={styles.signInLink}>Sign In</Text>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
}

function FeatureRow({
  icon, color, title, desc, delay,
}: {
  icon: React.ComponentProps<typeof Feather>["name"];
  color: string;
  title: string;
  desc: string;
  delay: number;
}) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 500, delay, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, delay, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[styles.featureRow, { opacity: fadeAnim, transform: [{ translateX: slideAnim }] }]}>
      <View style={[styles.featureIconWrap, { backgroundColor: color + "18", borderColor: color + "33" }]}>
        <Feather name={icon} size={18} color={color} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDesc}>{desc}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    gap: 32,
  },

  heroSection: {
    alignItems: "center",
    gap: 12,
    paddingTop: 8,
  },
  orbGlow: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  orb: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  orbGlyph: {
    fontSize: 36,
    color: "#fff",
    opacity: 0.9,
  },
  appName: {
    fontSize: 44,
    fontFamily: "Nunito_700Bold",
    color: "#F0EBF8",
    letterSpacing: 2,
  },
  tagline: {
    fontSize: 18,
    fontFamily: "Nunito_400Regular",
    color: "rgba(240,235,248,0.85)",
    textAlign: "center",
    lineHeight: 28,
  },
  subTagline: {
    fontSize: 13,
    fontFamily: "Nunito_400Regular",
    color: "rgba(240,235,248,0.35)",
    textAlign: "center",
    letterSpacing: 0.5,
  },

  featuresSection: {
    gap: 14,
    backgroundColor: "rgba(26,22,48,0.5)",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(240,235,248,0.06)",
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
  },
  featureIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  featureTitle: {
    fontSize: 15,
    fontFamily: "Nunito_600SemiBold",
    color: "#F0EBF8",
    marginBottom: 2,
  },
  featureDesc: {
    fontSize: 13,
    fontFamily: "Nunito_400Regular",
    color: "rgba(240,235,248,0.45)",
    lineHeight: 19,
  },

  ctaSection: {
    gap: 16,
    alignItems: "stretch",
  },
  getStartedBtn: {
    borderRadius: 16,
    overflow: "hidden",
  },
  getStartedGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    gap: 10,
  },
  getStartedText: {
    fontSize: 17,
    fontFamily: "Nunito_700Bold",
    color: "#fff",
  },
  signInRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
  },
  signInText: {
    fontSize: 14,
    fontFamily: "Nunito_400Regular",
    color: "rgba(240,235,248,0.35)",
  },
  signInLink: {
    fontSize: 14,
    fontFamily: "Nunito_600SemiBold",
    color: "rgba(232,92,122,0.8)",
  },
});
