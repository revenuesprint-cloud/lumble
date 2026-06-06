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
  { icon: "star"          as const, label: "Vedic Astrology" },
  { icon: "activity"      as const, label: "Compatibility"   },
  { icon: "message-circle"as const, label: "AI Oracle"       },
  { icon: "heart"         as const, label: "Healing Journey" },
];

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const router  = useRouter();
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;
  const orbAnim   = useRef(new Animated.Value(0.75)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(orbAnim, { toValue: 1,    duration: 2000, useNativeDriver: true }),
        Animated.timing(orbAnim, { toValue: 0.75, duration: 2000, useNativeDriver: true }),
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
    <LinearGradient colors={["#080611", "#0D0A1E", "#110818"]} style={{ flex: 1 }}>
      <View style={[styles.container, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 20 }]}>

        {/* Hero */}
        <Animated.View style={[styles.hero, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <Animated.View style={{ opacity: orbAnim }}>
            <Image
              source={require("../assets/images/logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </Animated.View>
          <Text style={styles.appName}>Lumble</Text>
          <Text style={styles.tagline}>Relationship insights backed{"\n"}by ancient astrology</Text>
        </Animated.View>

        {/* Feature pills */}
        <Animated.View style={[styles.pills, { opacity: fadeAnim }]}>
          {FEATURES.map((f, i) => (
            <View key={i} style={styles.pill}>
              <Feather name={f.icon} size={14} color="#E85C7A" />
              <Text style={styles.pillText}>{f.label}</Text>
            </View>
          ))}
        </Animated.View>

        {/* CTA */}
        <Animated.View style={[styles.cta, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <TouchableOpacity onPress={() => go("register")} activeOpacity={0.88} style={styles.btn}>
            <LinearGradient
              colors={["#E85C7A", "#B855E0"]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={styles.btnGradient}
            >
              <Text style={styles.btnText}>Get Started</Text>
              <Feather name="arrow-right" size={18} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>

          <Pressable onPress={() => go("signin")} style={styles.signInRow}>
            <Text style={styles.signInText}>Already have an account? </Text>
            <Text style={styles.signInLink}>Sign In</Text>
          </Pressable>
        </Animated.View>

      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "space-between",
  },

  hero: {
    alignItems: "center",
    gap: 10,
    flex: 1,
    justifyContent: "center",
  },
  logo: {
    width: 88,
    height: 88,
    marginBottom: 2,
  },
  appName: {
    fontSize: 38,
    fontFamily: "Nunito_700Bold",
    color: "#F0EBF8",
    letterSpacing: 1.5,
  },
  tagline: {
    fontSize: 15,
    fontFamily: "Nunito_400Regular",
    color: "rgba(240,235,248,0.6)",
    textAlign: "center",
    lineHeight: 23,
  },

  pills: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
    paddingVertical: 8,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(232,92,122,0.08)",
    borderWidth: 1,
    borderColor: "rgba(232,92,122,0.2)",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  pillText: {
    fontSize: 13,
    fontFamily: "Nunito_500Medium",
    color: "rgba(240,235,248,0.7)",
  },

  cta: {
    gap: 12,
  },
  btn: {
    borderRadius: 14,
    overflow: "hidden",
  },
  btnGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 8,
  },
  btnText: {
    fontSize: 16,
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
    fontSize: 13,
    fontFamily: "Nunito_400Regular",
    color: "rgba(240,235,248,0.35)",
  },
  signInLink: {
    fontSize: 13,
    fontFamily: "Nunito_600SemiBold",
    color: "rgba(232,92,122,0.8)",
  },
});
