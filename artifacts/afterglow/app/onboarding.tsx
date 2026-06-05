import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  Image,
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

type RelType = "crush" | "situationship" | "relationship" | "ex";

interface FormData {
  userName: string;
  userBirthDate: Date;
  userBirthTime: string;
  partnerName: string;
  partnerBirthDate: Date;
  relationshipType: RelType;
}

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const ITEM_H = 52;

function WheelPicker({
  items,
  selectedIndex,
  onSelect,
  width = 90,
}: {
  items: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  width?: number;
}) {
  const scrollRef = useRef<ScrollView>(null);
  const totalItems = items.length;

  React.useEffect(() => {
    scrollRef.current?.scrollTo({
      y: selectedIndex * ITEM_H,
      animated: false,
    });
  }, [selectedIndex]);

  return (
    <View style={{ width, height: ITEM_H * 5, overflow: "hidden" }}>
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: ITEM_H * 2,
          zIndex: 10,
        }}
      >
        <LinearGradient
          colors={["rgba(8,6,17,0.95)", "rgba(8,6,17,0)"]}
          style={{ flex: 1 }}
        />
      </View>
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: ITEM_H * 2,
          zIndex: 10,
        }}
      >
        <LinearGradient
          colors={["rgba(8,6,17,0)", "rgba(8,6,17,0.95)"]}
          style={{ flex: 1 }}
        />
      </View>
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          top: ITEM_H * 2,
          left: 0,
          right: 0,
          height: ITEM_H,
          borderTopWidth: 1,
          borderBottomWidth: 1,
          borderColor: "rgba(232,92,122,0.3)",
          zIndex: 5,
        }}
      />
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_H}
        decelerationRate="fast"
        contentContainerStyle={{ paddingVertical: ITEM_H * 2 }}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.y / ITEM_H);
          const clamped = Math.max(0, Math.min(totalItems - 1, index));
          onSelect(clamped);
          Haptics.selectionAsync();
        }}
      >
        {items.map((item, i) => (
          <View
            key={i}
            style={{ height: ITEM_H, alignItems: "center", justifyContent: "center" }}
          >
            <Text
              style={{
                fontSize: 16,
                color:
                  i === selectedIndex
                    ? "#F0EBF8"
                    : "rgba(240,235,248,0.35)",
                fontFamily: "Nunito_500Medium",
              }}
            >
              {item}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

function DatePicker({ value, onChange }: { value: Date; onChange: (d: Date) => void }) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 60 }, (_, i) => String(currentYear - 15 - i));
  const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, "0"));

  const monthIndex = value.getMonth();
  const dayIndex = value.getDate() - 1;
  const yearIndex = years.indexOf(String(value.getFullYear()));

  const update = (m: number, d: number, y: number) => {
    const maxDay = new Date(Number(years[y]), m + 1, 0).getDate();
    const clampedDay = Math.min(d, maxDay - 1);
    onChange(new Date(Number(years[y]), m, clampedDay + 1));
  };

  return (
    <View style={{ flexDirection: "row", gap: 8, alignItems: "center", justifyContent: "center" }}>
      <WheelPicker
        items={MONTHS}
        selectedIndex={monthIndex}
        onSelect={(i) => update(i, dayIndex, yearIndex >= 0 ? yearIndex : 0)}
        width={120}
      />
      <WheelPicker
        items={days}
        selectedIndex={dayIndex}
        onSelect={(i) => update(monthIndex, i, yearIndex >= 0 ? yearIndex : 0)}
        width={60}
      />
      <WheelPicker
        items={years}
        selectedIndex={yearIndex >= 0 ? yearIndex : 20}
        onSelect={(i) => update(monthIndex, dayIndex, i)}
        width={80}
      />
    </View>
  );
}

const TOTAL_STEPS = 8;

function toLocalDateString(d: Date): string {
  const y  = d.getFullYear();
  const m  = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

export default function Onboarding() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { completeOnboarding, syncProfileToServer } = useApp();
  const { jwtToken } = useAuth();

  const [step, setStep] = useState(0);
  const fadeAnim  = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const defaultUserDate    = new Date(1998, 5, 15);   // June 15 1998
  const defaultPartnerDate = new Date(1995, 10, 22);  // Nov 22 1995 — intentionally different
  const [form, setForm] = useState<FormData>({
    userName: "",
    userBirthDate: defaultUserDate,
    userBirthTime: "",
    partnerName: "",
    partnerBirthDate: defaultPartnerDate,
    relationshipType: "crush",
  });

  const transitionTo = (next: number, direction: "forward" | "back" = "forward") => {
    const outX = direction === "forward" ? -30 : 30;
    const inX = direction === "forward" ? 30 : -30;

    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 180, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: outX, duration: 180, useNativeDriver: true }),
    ]).start(() => {
      setStep(next);
      slideAnim.setValue(inX);
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 220, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 220, useNativeDriver: true }),
      ]).start();
    });
  };

  const goBack = () => {
    if (step === 0) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    transitionTo(step - 1, "back");
  };

  const next = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (step === TOTAL_STEPS - 2) {
      transitionTo(step + 1);
      const newUser    = { name: form.userName, birthDate: toLocalDateString(form.userBirthDate), birthTime: form.userBirthTime || undefined };
      const newPartner = { name: form.partnerName, birthDate: toLocalDateString(form.partnerBirthDate), relationshipType: form.relationshipType };
      await completeOnboarding(newUser, newPartner);

      if (jwtToken) {
        // Authenticated — sync profile to server (fire-and-forget) then go home
        syncProfileToServer(jwtToken, newUser, newPartner).catch(() => {});
      }
      // Always navigate after animation regardless of auth state.
      // If not authenticated, AuthGuard will redirect to login.
      // If authenticated, go straight to home.
      setTimeout(() => {
        if (jwtToken) {
          router.replace("/(tabs)/home");
        } else {
          router.replace("/login");
        }
      }, 2600);
    } else {
      transitionTo(step + 1);
    }
  };

  const canProceed = (): boolean => {
    if (step === 1) return form.userName.trim().length >= 2;
    if (step === 4) return form.partnerName.trim().length >= 2;
    return true;
  };

  const relTypes: { key: RelType; label: string; desc: string }[] = [
    { key: "crush", label: "Crush", desc: "Feelings not yet spoken" },
    { key: "situationship", label: "Situationship", desc: "Feelings without a label" },
    { key: "relationship", label: "Relationship", desc: "Official and intentional" },
    { key: "ex", label: "Ex", desc: "Something that ended" },
  ];

  const steps = [
    // Step 0: Welcome
    <View key={0} style={styles.stepContainer}>
      <Image
        source={require("../assets/images/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.appName}>Lumble</Text>
      <Text style={styles.tagline}>
        Understand your connection{"\n"}through personality and emotional patterns
      </Text>
    </View>,

    // Step 1: Your name
    <View key={1} style={styles.stepContainer}>
      <Text style={styles.stepLabel}>First, who are you?</Text>
      <Text style={styles.stepSub}>Your name helps personalize every insight</Text>
      <TextInput
        style={styles.textInput}
        value={form.userName}
        onChangeText={(t) => setForm((f) => ({ ...f, userName: t }))}
        placeholder="Your first name"
        placeholderTextColor="rgba(240,235,248,0.25)"
        autoFocus
        maxLength={30}
      />
    </View>,

    // Step 2: Your birthday
    <View key={2} style={styles.stepContainer}>
      <Text style={styles.stepLabel}>When were you born?</Text>
      <Text style={styles.stepSub}>Your birth date helps map your emotional style and personality type</Text>
      <DatePicker
        value={form.userBirthDate}
        onChange={(d) => setForm((f) => ({ ...f, userBirthDate: d }))}
      />
    </View>,

    // Step 3: Birth time (optional)
    <View key={3} style={styles.stepContainer}>
      <Text style={styles.stepLabel}>What time were you born?</Text>
      <Text style={styles.stepSub}>Optional. Helps make your profile more accurate.</Text>
      <TextInput
        style={styles.textInput}
        value={form.userBirthTime}
        onChangeText={(t) => setForm((f) => ({ ...f, userBirthTime: t }))}
        placeholder="e.g. 3:45 PM  (optional)"
        placeholderTextColor="rgba(240,235,248,0.25)"
        keyboardType="default"
      />
      <TouchableOpacity onPress={next} style={styles.skipBtn}>
        <Text style={styles.skipText}>Skip this</Text>
      </TouchableOpacity>
    </View>,

    // Step 4: Partner name
    <View key={4} style={styles.stepContainer}>
      <Text style={styles.stepLabel}>Who are you thinking about?</Text>
      <Text style={styles.stepSub}>Their first name is enough</Text>
      <TextInput
        style={styles.textInput}
        value={form.partnerName}
        onChangeText={(t) => setForm((f) => ({ ...f, partnerName: t }))}
        placeholder="Their first name"
        placeholderTextColor="rgba(240,235,248,0.25)"
        autoFocus
        maxLength={30}
      />
    </View>,

    // Step 5: Partner birthday
    <View key={5} style={styles.stepContainer}>
      <Text style={styles.stepLabel}>
        {form.partnerName ? `When is ${form.partnerName}'s birthday?` : "When is their birthday?"}
      </Text>
      <Text style={styles.stepSub}>Approximate is fine if you're not sure</Text>
      <DatePicker
        value={form.partnerBirthDate}
        onChange={(d) => setForm((f) => ({ ...f, partnerBirthDate: d }))}
      />
    </View>,

    // Step 6: Relationship type
    <View key={6} style={[styles.stepContainer, { gap: 12 }]}>
      <Text style={styles.stepLabel}>What is this?</Text>
      <Text style={styles.stepSub}>Be honest. It shapes everything.</Text>
      {relTypes.map((r) => (
        <TouchableOpacity
          key={r.key}
          onPress={() => {
            Haptics.selectionAsync();
            setForm((f) => ({ ...f, relationshipType: r.key }));
          }}
          style={[
            styles.relTypeCard,
            form.relationshipType === r.key && styles.relTypeCardSelected,
          ]}
        >
          <Text style={[styles.relTypeLabel, form.relationshipType === r.key && { color: "#E85C7A" }]}>
            {r.label}
          </Text>
          <Text style={styles.relTypeDesc}>{r.desc}</Text>
        </TouchableOpacity>
      ))}
    </View>,

    // Step 7: Calculating → navigates automatically
    <View key={7} style={[styles.stepContainer, { gap: 20 }]}>
      <CalcAnimation name={form.partnerName} />
    </View>,
  ];

  const isCalculating = step === TOTAL_STEPS - 1;

  return (
    <LinearGradient colors={["#080611", "#0D0A1E", "#110818"]} style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={[
            styles.container,
            { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 40 },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          {/* Top nav row — back button + progress */}
          {!isCalculating && (
            <View style={styles.topNav}>
              {step > 0 ? (
                <TouchableOpacity onPress={goBack} style={styles.backBtn} activeOpacity={0.7}>
                  <Ionicons name="chevron-back" size={22} color="rgba(240,235,248,0.6)" />
                </TouchableOpacity>
              ) : (
                <View style={styles.backBtnPlaceholder} />
              )}
              {step > 0 && (
                <View style={styles.progressRow}>
                  {Array.from({ length: TOTAL_STEPS - 1 }).map((_, i) => (
                    <View
                      key={i}
                      style={[
                        styles.progressDot,
                        i < step && styles.progressDotActive,
                        i === step - 1 && styles.progressDotCurrent,
                      ]}
                    />
                  ))}
                </View>
              )}
              <View style={styles.backBtnPlaceholder} />
            </View>
          )}

          <Animated.View
            style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }], flex: 1 }}
          >
            {steps[step]}
          </Animated.View>

          {!isCalculating && (
            <Pressable
              onPress={next}
              disabled={!canProceed()}
              style={[styles.nextBtn, !canProceed() && { opacity: 0.4 }]}
            >
              <LinearGradient
                colors={["#E85C7A", "#C4306E"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.nextBtnGradient}
              >
                <Text style={styles.nextBtnText}>
                  {step === 0 ? "Begin" : step === TOTAL_STEPS - 2 ? "Reveal" : "Continue"}
                </Text>
                {step > 0 && <Ionicons name="arrow-forward" size={20} color="#fff" />}
              </LinearGradient>
            </Pressable>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

function CalcAnimation({ name }: { name: string }) {
  const pulseAnim = useRef(new Animated.Value(0.6)).current;
  const [dots, setDots] = useState(0);

  React.useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1,   duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0.6, duration: 800, useNativeDriver: true }),
      ])
    );
    loop.start();
    const interval = setInterval(() => setDots((d) => (d + 1) % 4), 500);
    return () => { loop.stop(); clearInterval(interval); };
  }, []);

  return (
    <View style={{ alignItems: "center", gap: 24 }}>
      <Animated.View style={{ opacity: pulseAnim }}>
        <LinearGradient
          colors={["#E85C7A", "#B855E0", "#7C52C8"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.calcOrb}
        />
      </Animated.View>
      <Text style={styles.calcTitle}>Reading your connection{".".repeat(dots)}</Text>
      <Text style={styles.calcSub}>Mapping emotional patterns with {name}</Text>
      <Text style={styles.calcSub2}>
        Mapping attachment styles{"\n"}communication tendencies{"\n"}emotional compatibility
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    gap: 20,
  },
  topNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(240,235,248,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  backBtnPlaceholder: {
    width: 40,
    height: 40,
  },
  progressRow: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  progressDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(240,235,248,0.12)",
  },
  progressDotActive: {
    backgroundColor: "rgba(232,92,122,0.45)",
  },
  progressDotCurrent: {
    backgroundColor: "#E85C7A",
    width: 18,
    borderRadius: 3,
  },
  stepContainer: {
    flex: 1,
    gap: 14,
    paddingTop: 16,
    minHeight: 280,
    justifyContent: "center",
  },
  welcomeEye: {
    fontSize: 48,
    textAlign: "center",
    color: "#E85C7A",
    marginBottom: 8,
  },
  logo: { width: 100, height: 100, alignSelf: "center", marginBottom: 4 },
  appName: {
    fontSize: 42,
    fontFamily: "Nunito_700Bold",
    color: "#F0EBF8",
    textAlign: "center",
    letterSpacing: 2,
  },
  tagline: {
    fontSize: 18,
    fontFamily: "Nunito_400Regular",
    color: "rgba(240,235,248,0.8)",
    textAlign: "center",
    lineHeight: 28,
  },
  subTagline: {
    fontSize: 13,
    fontFamily: "Nunito_400Regular",
    color: "rgba(240,235,248,0.4)",
    textAlign: "center",
    marginTop: 8,
  },
  demoBtn: {
    alignSelf: "center",
    marginTop: 12,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(240,235,248,0.1)",
    backgroundColor: "rgba(240,235,248,0.04)",
  },
  demoBtnText: {
    fontSize: 13,
    fontFamily: "Nunito_400Regular",
    color: "rgba(240,235,248,0.35)",
  },
  stepLabel: {
    fontSize: 26,
    fontFamily: "Nunito_700Bold",
    color: "#F0EBF8",
    lineHeight: 34,
  },
  stepSub: {
    fontSize: 15,
    fontFamily: "Nunito_400Regular",
    color: "rgba(240,235,248,0.5)",
  },
  textInput: {
    backgroundColor: "rgba(26,22,48,0.8)",
    borderWidth: 1,
    borderColor: "rgba(232,92,122,0.3)",
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 18,
    fontSize: 20,
    fontFamily: "Nunito_500Medium",
    color: "#F0EBF8",
    marginTop: 8,
  },
  skipBtn: {
    alignSelf: "center",
    padding: 8,
  },
  skipText: {
    fontSize: 14,
    color: "rgba(240,235,248,0.35)",
    fontFamily: "Nunito_400Regular",
  },
  relTypeCard: {
    backgroundColor: "rgba(26,22,48,0.6)",
    borderWidth: 1,
    borderColor: "rgba(240,235,248,0.1)",
    borderRadius: 14,
    padding: 18,
    gap: 4,
  },
  relTypeCardSelected: {
    borderColor: "rgba(232,92,122,0.5)",
    backgroundColor: "rgba(232,92,122,0.08)",
  },
  relTypeLabel: {
    fontSize: 17,
    fontFamily: "Nunito_600SemiBold",
    color: "#F0EBF8",
  },
  relTypeDesc: {
    fontSize: 13,
    fontFamily: "Nunito_400Regular",
    color: "rgba(240,235,248,0.4)",
  },
  nextBtn: {
    marginTop: 8,
    borderRadius: 16,
    overflow: "hidden",
  },
  nextBtnGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    gap: 8,
  },
  nextBtnText: {
    fontSize: 17,
    fontFamily: "Nunito_600SemiBold",
    color: "#fff",
  },
  calcOrb: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  calcTitle: {
    fontSize: 22,
    fontFamily: "Nunito_700Bold",
    color: "#F0EBF8",
    textAlign: "center",
  },
  calcSub: {
    fontSize: 15,
    fontFamily: "Nunito_400Regular",
    color: "rgba(240,235,248,0.5)",
    textAlign: "center",
  },
  calcSub2: {
    fontSize: 13,
    fontFamily: "Nunito_400Regular",
    color: "rgba(232,92,122,0.6)",
    textAlign: "center",
    lineHeight: 22,
  },
});
