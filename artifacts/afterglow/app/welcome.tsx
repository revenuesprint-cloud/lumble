import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Image,
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
    icon: "heart" as const,
    color: "#E85C7A",
    title: "Does he actually love me?",
    desc: "Get a real read on how they feel and why they act the way they do",
  },
  {
    icon: "activity" as const,
    color: "#B855E0",
    title: "Why can I not let go?",
    desc: "Understand what keeps pulling you back and what it says about your patterns",
  },
  {
    icon: "message-circle" as const,
    color: "#7C52C8",
    title: "Am I too much for them?",
    desc: "Ask the questions you are too afraid to say out loud and get honest answers",
  },
  {
    icon: "trending-up" as const,
    color: "#52C8B8",
    title: "Are we actually compatible?",
    desc: "See what flows naturally between you and where the real friction lives",
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
            <Image
              source={require("../assets/images/logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </Animated.View>

          <Text style={styles.appName}>Lumble</Text>
          <Text style={styles.tagline}>
            The app for every question{"\n"}you are afraid to ask out loud
          </Text>
          <Text style={styles.subTagline}>
            Relationship insight built on personality science
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
  logo: {
    width: 120,
    height: 120,
    marginBottom: 4,
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
