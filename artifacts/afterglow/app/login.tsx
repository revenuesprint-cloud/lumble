import { useApp } from "@/context/AppContext";
import { useAuth, type ServerProfile } from "@/context/AuthContext";
import { useLocalSearchParams } from "expo-router";
import { fetchJourney } from "@/utils/dbContent";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Mode = "signin" | "register";

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const router  = useRouter();
  const { mode: modeParam } = useLocalSearchParams<{ mode?: string }>();
  const { login, register, isAuthenticated, isAuthLoading } = useAuth();
  const { hasCompletedOnboarding, completeOnboarding, resetApp, clearGuidanceMessages } = useApp();

  useEffect(() => {
    if (isAuthLoading) return;
    if (isAuthenticated) {
      if (hasCompletedOnboarding) {
        router.replace("/(tabs)/home");
      } else {
        router.replace("/onboarding");
      }
    }
  }, [isAuthenticated, isAuthLoading, hasCompletedOnboarding]);

  const [mode,         setMode]         = useState<Mode>(modeParam === "register" ? "register" : "signin");
  const [email,        setEmail]        = useState("");
  const [password,     setPassword]     = useState("");
  const [confirm,      setConfirm]      = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm,  setShowConfirm]  = useState(false);
  const [error,        setError]        = useState("");
  const [loading,      setLoading]      = useState(false);

  const shakeAnim = useRef(new Animated.Value(0)).current;

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10,  duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 8,   duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0,   duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const clear = () => { setError(""); };

  const switchMode = (next: Mode) => {
    setMode(next); setError(""); setPassword(""); setConfirm("");
  };

  const handleSubmit = async () => {
    if (!email.trim() || !password) {
      setError("Please fill in all fields."); shake(); return;
    }
    if (mode === "register") {
      if (password.length < 6) {
        setError("Password must be at least 6 characters."); shake(); return;
      }
      if (password !== confirm) {
        setError("Passwords don't match."); shake(); return;
      }
    }

    setLoading(true); setError("");
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (mode === "register") {
      const result = await register(email.trim(), password);
      setLoading(false);
      if (result.success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        await resetApp();
        router.replace("/onboarding");
      } else {
        setError(result.error ?? "Registration failed."); shake();
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      return;
    }

    const result = await login(email.trim(), password);
    setLoading(false);

    if (result.success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const serverProfile = result.profile as ServerProfile | null | undefined;
      if (serverProfile) {
        clearGuidanceMessages();
        await completeOnboarding(
          { name: serverProfile.userName, birthDate: serverProfile.userBirthDate, birthTime: serverProfile.userBirthTime ?? undefined },
          { name: serverProfile.partnerName, birthDate: serverProfile.partnerBirthDate, relationshipType: serverProfile.relationshipType as any },
        );
        const secureGet = (key: string) =>
          Platform.OS === "web" ? AsyncStorage.getItem(key) : SecureStore.getItemAsync(key);
        secureGet("lumble_token").then((token) => {
          if (!token) return;
          return fetchJourney(token).then((journey) => {
            if (journey.length === 0) return;
            const states: Record<string, string> = {};
            for (const entry of journey) {
              if (entry.problem?.id) states[entry.problem.id] = entry.state;
            }
            return AsyncStorage.setItem("@lumble_challenge_states", JSON.stringify(states));
          });
        }).catch(() => {});
        router.replace("/(tabs)/home");
      } else {
        await resetApp();
        router.replace("/onboarding");
      }
    } else {
      setError(result.error ?? "Sign in failed."); shake();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const heading = mode === "signin" ? "Welcome back" : "Create account";
  const subHeading = mode === "signin"
    ? "Sign in to access your insights"
    : "Set up your astrology profile";

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 40 }]}
          style={Platform.OS === "web" ? styles.webScroll : undefined}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >

          {/* Back + toggle row */}
          <View style={styles.topRow}>
            <TouchableOpacity
              onPress={() => router.back()}
              activeOpacity={0.7}
              style={styles.backBtn}
            >
              <Feather name="arrow-left" size={20} color="#0F172A" />
            </TouchableOpacity>

            <View style={styles.toggle}>
              <TouchableOpacity
                onPress={() => switchMode("register")}
                style={[styles.toggleBtn, mode === "register" && styles.toggleBtnActive]}
                activeOpacity={0.8}
              >
                <Text style={[styles.toggleText, mode === "register" && styles.toggleTextActive]}>
                  New Account
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => switchMode("signin")}
                style={[styles.toggleBtn, mode === "signin" && styles.toggleBtnActive]}
                activeOpacity={0.8}
              >
                <Text style={[styles.toggleText, mode === "signin" && styles.toggleTextActive]}>
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Heading */}
          <View style={styles.headingBlock}>
            <Text style={styles.heading}>{heading}</Text>
            <Text style={styles.subHeading}>{subHeading}</Text>
          </View>

          {/* Form */}
          <Animated.View style={[styles.form, { transform: [{ translateX: shakeAnim }] }]}>

            {/* Email */}
            <View style={styles.fieldWrap}>
              <View style={styles.fieldRow}>
                <Feather name="mail" size={16} color="#94A3B8" />
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={(t) => { setEmail(t); clear(); }}
                  placeholder="Email address"
                  placeholderTextColor="#CBD5E1"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                />
              </View>
            </View>

            {/* Password */}
            <View style={styles.fieldWrap}>
              <View style={styles.fieldRow}>
                <Feather name="lock" size={16} color="#94A3B8" />
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  value={password}
                  onChangeText={(t) => { setPassword(t); clear(); }}
                  placeholder={mode === "register" ? "Password (min. 6 chars)" : "Password"}
                  placeholderTextColor="#CBD5E1"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  returnKeyType={mode === "register" ? "next" : "done"}
                  onSubmitEditing={mode === "signin" ? handleSubmit : undefined}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                  <Feather name={showPassword ? "eye-off" : "eye"} size={16} color="#94A3B8" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm password */}
            {mode === "register" && (
              <View style={styles.fieldWrap}>
                <View style={styles.fieldRow}>
                  <Feather name="lock" size={16} color="#94A3B8" />
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    value={confirm}
                    onChangeText={(t) => { setConfirm(t); clear(); }}
                    placeholder="Confirm password"
                    placeholderTextColor="#CBD5E1"
                    secureTextEntry={!showConfirm}
                    autoCapitalize="none"
                    returnKeyType="done"
                    onSubmitEditing={handleSubmit}
                  />
                  <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)} style={styles.eyeBtn}>
                    <Feather name={showConfirm ? "eye-off" : "eye"} size={16} color="#94A3B8" />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Error */}
            {error ? (
              <View style={styles.errorBanner}>
                <Feather name="alert-circle" size={14} color="#F43F5E" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {/* Submit */}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={loading}
              activeOpacity={0.85}
              style={[styles.submitBtn, loading && { opacity: 0.6 }]}
            >
              <Text style={styles.submitText}>
                {loading
                  ? (mode === "signin" ? "Signing in…" : "Creating account…")
                  : (mode === "signin" ? "Sign In" : "Create Account")}
              </Text>
              {!loading && (
                <View style={styles.submitArrow}>
                  <Feather name="arrow-right" size={16} color="#0F172A" />
                </View>
              )}
            </TouchableOpacity>

          </Animated.View>

          {/* Bottom links */}
          <View style={styles.bottomLinks}>
            {mode === "signin" ? (
              <>
                <TouchableOpacity onPress={() => switchMode("register")} activeOpacity={0.7}>
                  <Text style={styles.bottomLinkText}>
                    Don't have an account?{" "}
                    <Text style={styles.bottomLinkAccent}>Create one</Text>
                  </Text>
                </TouchableOpacity>
                <Text style={styles.forgotLink}>Forgot password?</Text>
              </>
            ) : (
              <TouchableOpacity onPress={() => switchMode("signin")} activeOpacity={0.7}>
                <Text style={styles.bottomLinkText}>
                  Already have an account?{" "}
                  <Text style={styles.bottomLinkAccent}>Sign in</Text>
                </Text>
              </TouchableOpacity>
            )}
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F7F5F0",
  },
  webScroll: {
    maxWidth: 480,
    alignSelf: "center",
    width: "100%",
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    gap: 28,
  },

  // Top row
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  backBtn: {
    width: 40, height: 40,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
  },
  toggle: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 3,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  toggleBtn:       { flex: 1, paddingVertical: 10, borderRadius: 11, alignItems: "center" },
  toggleBtnActive: { backgroundColor: "#0F172A" },
  toggleText:      { fontSize: 13, fontFamily: "PlusJakartaSans_600SemiBold", color: "#94A3B8" },
  toggleTextActive:{ color: "#FFFFFF" },

  // Heading
  headingBlock: { gap: 6 },
  heading: {
    fontSize: 26,
    fontFamily: "PlusJakartaSans_800ExtraBold",
    color: "#0F172A",
    letterSpacing: -0.4,
  },
  subHeading: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans_400Regular",
    color: "#64748B",
  },

  // Form
  form:     { gap: 12 },
  fieldWrap: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    overflow: "hidden",
  },
  fieldRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    gap: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 15,
    fontFamily: "PlusJakartaSans_400Regular",
    color: "#0F172A",
  },
  eyeBtn: { padding: 4 },

  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FFF1F2",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#FECDD3",
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    fontFamily: "PlusJakartaSans_400Regular",
    color: "#F43F5E",
  },

  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#0F172A",
    borderRadius: 16,
    paddingVertical: 18,
    paddingLeft: 22,
    paddingRight: 8,
    marginTop: 4,
  },
  submitText: {
    fontSize: 16,
    fontFamily: "PlusJakartaSans_700Bold",
    color: "#FFFFFF",
  },
  submitArrow: {
    width: 38, height: 38,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  // Bottom links
  bottomLinks: {
    alignItems: "center",
    gap: 12,
    paddingBottom: 8,
  },
  bottomLinkText: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans_400Regular",
    color: "#94A3B8",
    textAlign: "center",
  },
  bottomLinkAccent: {
    fontFamily: "PlusJakartaSans_700Bold",
    color: "#4A3DE8",
  },
  forgotLink: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans_600SemiBold",
    color: "#4A3DE8",
  },
});
