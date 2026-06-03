import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { login } = useAuth();
  const { user, hasCompletedOnboarding } = useApp();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      shake();
      return;
    }
    setLoading(true);
    setError("");
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const result = await login(email.trim(), password);
    setLoading(false);
    if (result.success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace("/(tabs)/home");
    } else {
      setError(result.error || "Login failed.");
      shake();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  return (
    <LinearGradient colors={["#080611", "#0D0A1E", "#110818"]} style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 40 },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo */}
          <View style={styles.logoArea}>
            <LinearGradient
              colors={["rgba(232,92,122,0.2)", "rgba(184,85,224,0.1)"]}
              style={styles.logoOrb}
            >
              <Text style={styles.logoGlyph}>◉</Text>
            </LinearGradient>
            <Text style={styles.appName}>Afterglow</Text>
            <Text style={styles.tagline}>
              {user?.name ? `Welcome back, ${user.name}` : "Welcome back"}
            </Text>
          </View>

          {/* Form */}
          <Animated.View style={[styles.form, { transform: [{ translateX: shakeAnim }] }]}>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Email</Text>
              <View style={styles.fieldRow}>
                <Feather name="mail" size={16} color="rgba(240,235,248,0.3)" style={styles.fieldIcon} />
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={(t) => { setEmail(t); setError(""); }}
                  placeholder="your@email.com"
                  placeholderTextColor="rgba(240,235,248,0.2)"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Password</Text>
              <View style={styles.fieldRow}>
                <Feather name="lock" size={16} color="rgba(240,235,248,0.3)" style={styles.fieldIcon} />
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  value={password}
                  onChangeText={(t) => { setPassword(t); setError(""); }}
                  placeholder="Your password"
                  placeholderTextColor="rgba(240,235,248,0.2)"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                  <Feather name={showPassword ? "eye-off" : "eye"} size={16} color="rgba(240,235,248,0.3)" />
                </TouchableOpacity>
              </View>
            </View>

            {error ? (
              <View style={styles.errorBanner}>
                <Feather name="alert-circle" size={14} color="#E85C7A" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <TouchableOpacity
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.85}
              style={[styles.loginBtn, loading && { opacity: 0.7 }]}
            >
              <LinearGradient
                colors={["#E85C7A", "#B855E0"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.loginBtnGradient}
              >
                <Text style={styles.loginBtnText}>{loading ? "Signing in…" : "Sign In"}</Text>
                {!loading && <Feather name="arrow-right" size={18} color="#fff" />}
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Secondary actions */}
          <View style={styles.secondaryActions}>
            {!hasCompletedOnboarding ? (
              <TouchableOpacity
                onPress={() => router.replace("/onboarding")}
                style={styles.secondaryBtn}
              >
                <Text style={styles.secondaryBtnText}>New here? Set up your profile</Text>
                <Feather name="chevron-right" size={14} color="rgba(240,235,248,0.35)" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => router.replace("/(tabs)/home")}
                style={styles.secondaryBtn}
              >
                <Text style={styles.secondaryBtnText}>Continue without password</Text>
                <Feather name="chevron-right" size={14} color="rgba(240,235,248,0.35)" />
              </TouchableOpacity>
            )}
          </View>

          {/* Bottom note */}
          <Text style={styles.bottomNote}>
            Your data stays on this device.{"\n"}No cloud sync, no tracking.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: 28,
    gap: 28,
    alignItems: "stretch",
  },
  logoArea: {
    alignItems: "center",
    gap: 12,
    paddingBottom: 8,
  },
  logoOrb: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(232,92,122,0.2)",
  },
  logoGlyph: { fontSize: 32, color: "#E85C7A" },
  appName: {
    fontSize: 32,
    fontFamily: "Inter_700Bold",
    color: "#F0EBF8",
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    color: "rgba(240,235,248,0.4)",
  },

  form: { gap: 16 },
  fieldGroup: { gap: 8 },
  fieldLabel: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    color: "rgba(240,235,248,0.4)",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  fieldRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#110F1E",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(240,235,248,0.08)",
    paddingHorizontal: 14,
    gap: 10,
  },
  fieldIcon: { flexShrink: 0 },
  input: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    color: "#F0EBF8",
  },
  eyeBtn: { padding: 4 },

  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(232,92,122,0.08)",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(232,92,122,0.2)",
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: "#E85C7A",
  },

  loginBtn: { borderRadius: 16, overflow: "hidden" },
  loginBtnGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 17,
  },
  loginBtnText: {
    fontSize: 17,
    fontFamily: "Inter_700Bold",
    color: "#fff",
  },

  dividerRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  dividerLine: { flex: 1, height: 1, backgroundColor: "rgba(240,235,248,0.07)" },
  dividerText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: "rgba(240,235,248,0.25)",
  },

  secondaryActions: { gap: 10 },
  secondaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "rgba(240,235,248,0.04)",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(240,235,248,0.07)",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  secondaryBtnText: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    color: "rgba(240,235,248,0.45)",
  },

  bottomNote: {
    textAlign: "center",
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: "rgba(240,235,248,0.2)",
    lineHeight: 20,
  },
});
