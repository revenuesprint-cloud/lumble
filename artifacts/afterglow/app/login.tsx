import { useApp } from "@/context/AppContext";
import { useAuth, type ServerProfile } from "@/context/AuthContext";
import { useLocalSearchParams } from "expo-router";
import { fetchJourney } from "@/utils/dbContent";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
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

  // Redirect already-authenticated users away from login screen
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

  const [mode, setMode] = useState<Mode>(modeParam === "register" ? "register" : "signin");
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
      Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 8,  duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0,  duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const clear = () => { setError(""); };

  const switchMode = (next: Mode) => {
    setMode(next);
    setError("");
    setPassword("");
    setConfirm("");
  };

  const handleSubmit = async () => {
    if (!email.trim() || !password) {
      setError("Please fill in all fields.");
      shake();
      return;
    }
    if (mode === "register") {
      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        shake();
        return;
      }
      if (password !== confirm) {
        setError("Passwords don't match.");
        shake();
        return;
      }
    }

    setLoading(true);
    setError("");
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (mode === "register") {
      const result = await register(email.trim(), password);
      setLoading(false);
      if (result.success) {
        // New account — always clear any stale local profile data and go through onboarding
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        await resetApp();
        router.replace("/onboarding");
      } else {
        setError(result.error ?? "Registration failed.");
        shake();
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      return;
    }

    // Sign-in: server tells us if the user has a profile
    const result = await login(email.trim(), password);
    setLoading(false);

    if (result.success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const serverProfile = result.profile as ServerProfile | null | undefined;
      if (serverProfile) {
        // Existing user with a profile — wipe any stale local session data first
        clearGuidanceMessages();
        await completeOnboarding(
          { name: serverProfile.userName, birthDate: serverProfile.userBirthDate, birthTime: serverProfile.userBirthTime ?? undefined },
          { name: serverProfile.partnerName, birthDate: serverProfile.partnerBirthDate, relationshipType: serverProfile.relationshipType as any },
        );
        // Sync journey states so challenges screen shows correct progress immediately.
        // Read token directly — jwtToken state may not have updated yet.
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
        // Account exists but no profile yet — clear stale local data, go to onboarding
        await resetApp();
        router.replace("/onboarding");
      }
    } else {
      setError(result.error ?? "Sign in failed.");
      shake();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const greeting = mode === "signin" ? "Sign in to continue" : "Create your account";

  return (
    <LinearGradient colors={["#080611", "#0D0A1E", "#110818"]} style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            { paddingTop: insets.top + 36, paddingBottom: insets.bottom + 40 },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo */}
          <View style={styles.logoArea}>
            <View style={styles.logoCircle}>
              <Image
                source={require("../assets/images/logo.png")}
                style={styles.logo}
                resizeMode="cover"
              />
            </View>
            <Text style={styles.appName}>Lumble</Text>
            <Text style={styles.tagline}>{greeting}</Text>
          </View>

          {/* Mode toggle */}
          <View style={styles.toggle}>
            <TouchableOpacity
              onPress={() => switchMode("signin")}
              style={[styles.toggleBtn, mode === "signin" && styles.toggleBtnActive]}
              activeOpacity={0.8}
            >
              <Text style={[styles.toggleText, mode === "signin" && styles.toggleTextActive]}>
                Sign In
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => switchMode("register")}
              style={[styles.toggleBtn, mode === "register" && styles.toggleBtnActive]}
              activeOpacity={0.8}
            >
              <Text style={[styles.toggleText, mode === "register" && styles.toggleTextActive]}>
                Create Account
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form */}
          <Animated.View style={[styles.form, { transform: [{ translateX: shakeAnim }] }]}>

            {/* Email */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Email</Text>
              <View style={styles.fieldRow}>
                <Feather name="mail" size={16} color="rgba(240,235,248,0.3)" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={(t) => { setEmail(t); clear(); }}
                  placeholder="your@email.com"
                  placeholderTextColor="rgba(240,235,248,0.2)"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                />
              </View>
            </View>

            {/* Password */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Password</Text>
              <View style={styles.fieldRow}>
                <Feather name="lock" size={16} color="rgba(240,235,248,0.3)" style={styles.icon} />
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  value={password}
                  onChangeText={(t) => { setPassword(t); clear(); }}
                  placeholder={mode === "register" ? "Min. 6 characters" : "Your password"}
                  placeholderTextColor="rgba(240,235,248,0.2)"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  returnKeyType={mode === "register" ? "next" : "done"}
                  onSubmitEditing={mode === "signin" ? handleSubmit : undefined}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                  <Feather name={showPassword ? "eye-off" : "eye"} size={16} color="rgba(240,235,248,0.3)" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm password — register only */}
            {mode === "register" && (
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Confirm Password</Text>
                <View style={styles.fieldRow}>
                  <Feather name="lock" size={16} color="rgba(240,235,248,0.3)" style={styles.icon} />
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    value={confirm}
                    onChangeText={(t) => { setConfirm(t); clear(); }}
                    placeholder="Re-enter password"
                    placeholderTextColor="rgba(240,235,248,0.2)"
                    secureTextEntry={!showConfirm}
                    autoCapitalize="none"
                    returnKeyType="done"
                    onSubmitEditing={handleSubmit}
                  />
                  <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)} style={styles.eyeBtn}>
                    <Feather name={showConfirm ? "eye-off" : "eye"} size={16} color="rgba(240,235,248,0.3)" />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Error */}
            {error ? (
              <View style={styles.errorBanner}>
                <Feather name="alert-circle" size={14} color="#E85C7A" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {/* Submit */}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={loading}
              activeOpacity={0.85}
              style={[styles.submitBtn, loading && { opacity: 0.7 }]}
            >
              <LinearGradient
                colors={["#E85C7A", "#B855E0"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.submitGradient}
              >
                <Text style={styles.submitText}>
                  {loading
                    ? (mode === "signin" ? "Signing in…" : "Creating account…")
                    : (mode === "signin" ? "Sign In" : "Create Account")}
                </Text>
                {!loading && <Feather name="arrow-right" size={18} color="#fff" />}
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 28,
    gap: 24,
    alignItems: "stretch",
    justifyContent: "center",
  },

  logoArea: { alignItems: "center", gap: 10 },
  logoCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "rgba(240,235,248,0.1)",
  },
  logo: { width: "100%", height: "100%" },
  appName: {
    fontSize: 30,
    fontFamily: "Nunito_700Bold",
    color: "#F0EBF8",
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 14,
    fontFamily: "Nunito_400Regular",
    color: "rgba(240,235,248,0.4)",
  },

  // Toggle
  toggle: {
    flexDirection: "row",
    backgroundColor: "rgba(26,22,48,0.8)",
    borderRadius: 14,
    padding: 4,
    gap: 2,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  toggleBtnActive: { backgroundColor: "#1E1A30" },
  toggleText: {
    fontSize: 14,
    fontFamily: "Nunito_600SemiBold",
    color: "rgba(240,235,248,0.35)",
  },
  toggleTextActive: { color: "#F0EBF8" },

  // Form
  form: { gap: 14 },
  fieldGroup: { gap: 7 },
  fieldLabel: {
    fontSize: 12,
    fontFamily: "Nunito_500Medium",
    color: "rgba(240,235,248,0.45)",
    letterSpacing: 0,
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
  icon: { flexShrink: 0 },
  input: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 15,
    fontFamily: "Nunito_400Regular",
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
    fontFamily: "Nunito_400Regular",
    color: "#E85C7A",
  },

  submitBtn: { borderRadius: 16, overflow: "hidden" },
  submitGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 17,
  },
  submitText: {
    fontSize: 16,
    fontFamily: "Nunito_700Bold",
    color: "#fff",
  },

});
