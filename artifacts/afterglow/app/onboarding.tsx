import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";
import { HP, IS_SMALL, rf, rs, SCREEN_W, webScrollStyle } from "@/constants/layout";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useMemo, useRef, useState } from "react";
import {
  Animated,
  Easing,
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
  userDobSet: boolean;
  userBirthTime: string;
  partnerName: string;
  partnerBirthDate: Date;
  partnerDobSet: boolean;
  relationshipType: RelType;
}

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const ITEM_H = 52;

const WW_MONTH = IS_SMALL ? 100 : 120;
const WW_DAY   = IS_SMALL ? 52  : 60;
const WW_YEAR  = IS_SMALL ? 72  : 80;

function WheelPicker({
  items,
  selectedIndex,
  onSelect,
  width = 90,
  c,
}: {
  items: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  width?: number;
  c: ReturnType<typeof useColors>;
}) {
  const scrollRef = useRef<ScrollView>(null);

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ y: selectedIndex * ITEM_H, animated: false });
  }, [selectedIndex]);

  return (
    <View style={{ width, height: ITEM_H * 5, overflow: "hidden" }}>
      {/* Top fade */}
      <View pointerEvents="none" style={{ position: "absolute", top: 0, left: 0, right: 0, height: ITEM_H * 2, zIndex: 10 }}>
        <LinearGradient colors={[c.background + "F7", c.background + "00"]} style={{ flex: 1 }} />
      </View>
      {/* Bottom fade */}
      <View pointerEvents="none" style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: ITEM_H * 2, zIndex: 10 }}>
        <LinearGradient colors={[c.background + "00", c.background + "F7"]} style={{ flex: 1 }} />
      </View>
      {/* Selection highlight */}
      <View pointerEvents="none" style={{
        position: "absolute", top: ITEM_H * 2, left: 0, right: 0, height: ITEM_H,
        borderTopWidth: 1, borderBottomWidth: 1, borderColor: c.primaryBorder, zIndex: 5,
        backgroundColor: c.primaryLight,
      }} />
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_H}
        decelerationRate="fast"
        contentContainerStyle={{ paddingVertical: ITEM_H * 2 }}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.y / ITEM_H);
          const clamped = Math.max(0, Math.min(items.length - 1, index));
          onSelect(clamped);
          Haptics.selectionAsync();
        }}
      >
        {items.map((item, i) => (
          <View key={i} style={{ height: ITEM_H, alignItems: "center", justifyContent: "center" }}>
            <Text style={{
              fontSize: rf(16),
              color: i === selectedIndex ? c.text : c.textMuted,
              fontFamily: "PlusJakartaSans_600SemiBold",
              fontWeight: i === selectedIndex ? "700" : "400",
            }}>
              {item}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

function DatePicker({ value, onChange, c }: { value: Date; onChange: (d: Date) => void; c: ReturnType<typeof useColors> }) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 60 }, (_, i) => String(currentYear - 15 - i));
  const days  = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, "0"));

  const monthIndex = value.getMonth();
  const dayIndex   = value.getDate() - 1;
  const yearIndex  = years.indexOf(String(value.getFullYear()));

  const update = (m: number, d: number, y: number) => {
    const maxDay = new Date(Number(years[y]), m + 1, 0).getDate();
    const clampedDay = Math.min(d, maxDay - 1);
    onChange(new Date(Number(years[y]), m, clampedDay + 1));
  };

  return (
    <View style={{ flexDirection: "row", gap: IS_SMALL ? 4 : 8, alignItems: "center", justifyContent: "center" }}>
      <WheelPicker items={MONTHS} selectedIndex={monthIndex} onSelect={(i) => update(i, dayIndex, yearIndex >= 0 ? yearIndex : 0)} width={WW_MONTH} c={c} />
      <WheelPicker items={days}   selectedIndex={dayIndex}   onSelect={(i) => update(monthIndex, i, yearIndex >= 0 ? yearIndex : 0)} width={WW_DAY} c={c} />
      <WheelPicker items={years}  selectedIndex={yearIndex >= 0 ? yearIndex : 20} onSelect={(i) => update(monthIndex, dayIndex, i)} width={WW_YEAR} c={c} />
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

function formatDob(d: Date): string {
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

export default function Onboarding() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { completeOnboarding, syncProfileToServer } = useApp();
  const { jwtToken } = useAuth();
  const c = useColors();
  const styles = useMemo(() => createStyles(c), [c]);

  const [step, setStep] = useState(0);
  const fadeAnim    = useRef(new Animated.Value(1)).current;
  const slideAnim   = useRef(new Animated.Value(0)).current;
  const navTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    return () => { if (navTimerRef.current) clearTimeout(navTimerRef.current); };
  }, []);

  const defaultUserDate    = new Date(1998, 5, 15);
  const defaultPartnerDate = new Date(1995, 10, 22);
  const [form, setForm] = useState<FormData>({
    userName: "",
    userBirthDate: defaultUserDate,
    userDobSet: false,
    userBirthTime: "",
    partnerName: "",
    partnerBirthDate: defaultPartnerDate,
    partnerDobSet: false,
    relationshipType: "crush",
  });

  const transitionTo = (next: number, direction: "forward" | "back" = "forward") => {
    const outX = direction === "forward" ? -30 : 30;
    const inX  = direction === "forward" ?  30 : -30;
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 0, duration: 150, easing: Easing.in(Easing.quad), useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: outX, duration: 150, useNativeDriver: true }),
    ]).start(() => {
      setStep(next);
      slideAnim.setValue(inX);
      Animated.parallel([
        Animated.timing(fadeAnim,  { toValue: 1, duration: 200, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 200, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
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
      if (jwtToken) syncProfileToServer(jwtToken, newUser, newPartner).catch(() => {});
      navTimerRef.current = setTimeout(() => {
        router.replace(jwtToken ? "/(tabs)/home" : "/login");
      }, 2600);
    } else {
      transitionTo(step + 1);
    }
  };

  const canProceed = (): boolean => {
    if (step === 1) return form.userName.trim().length >= 2;
    if (step === 2) return form.userDobSet;       // DOB is required — no proceeding on the default
    if (step === 4) return form.partnerName.trim().length >= 2;
    if (step === 5) return form.partnerDobSet;     // partner DOB required too
    return true;
  };

  const relTypes: { key: RelType; label: string; desc: string }[] = [
    { key: "crush",         label: "Crush",         desc: "Feelings not yet spoken" },
    { key: "situationship", label: "Situationship",  desc: "Feelings without a label" },
    { key: "relationship",  label: "Relationship",   desc: "Official and intentional" },
    { key: "ex",            label: "Ex",             desc: "Something that ended" },
  ];

  const steps = [
    // 0: Welcome
    <View key={0} style={styles.stepContainer}>
      <View style={styles.logoCircle}>
        <LinearGradient colors={["#4A3DE8", "#8B5CF6"]} style={styles.logoGradient}>
          <Text style={styles.logoInitial}>L</Text>
        </LinearGradient>
      </View>
      <Text style={styles.appName}>Lumble</Text>
      <Text style={styles.tagline}>What your stars reveal{"\n"}about this connection</Text>
    </View>,

    // 1: Your name
    <View key={1} style={styles.stepContainer}>
      <Text style={styles.stepLabel}>First, who are you?</Text>
      <Text style={styles.stepSub}>Your name helps personalize every insight</Text>
      <TextInput
        style={styles.textInput}
        value={form.userName}
        onChangeText={(t) => setForm((f) => ({ ...f, userName: t }))}
        placeholder="Your first name"
        placeholderTextColor={c.textFaint}
        autoFocus
        maxLength={30}
      />
    </View>,

    // 2: Your birthday
    <View key={2} style={styles.stepContainer}>
      <Text style={styles.stepLabel}>When were you born?</Text>
      <Text style={styles.stepSub}>Set your real birth date — every insight is built from it</Text>
      <DatePicker value={form.userBirthDate} onChange={(d) => setForm((f) => ({ ...f, userBirthDate: d, userDobSet: true }))} c={c} />
      <Text style={[styles.dobConfirm, !form.userDobSet && styles.dobConfirmPending]}>
        {form.userDobSet ? `✓ ${formatDob(form.userBirthDate)}` : "Scroll to set your date of birth"}
      </Text>
    </View>,

    // 3: Birth time
    <View key={3} style={styles.stepContainer}>
      <Text style={styles.stepLabel}>What time were you born?</Text>
      <Text style={styles.stepSub}>Optional — helps make your profile more accurate</Text>
      <TextInput
        style={styles.textInput}
        value={form.userBirthTime}
        onChangeText={(t) => setForm((f) => ({ ...f, userBirthTime: t }))}
        placeholder="e.g. 3:45 PM  (optional)"
        placeholderTextColor={c.textFaint}
      />
      <TouchableOpacity onPress={next} style={styles.skipBtn}>
        <Text style={styles.skipText}>Skip this</Text>
      </TouchableOpacity>
    </View>,

    // 4: Partner name
    <View key={4} style={styles.stepContainer}>
      <Text style={styles.stepLabel}>Who are you thinking about?</Text>
      <Text style={styles.stepSub}>Their first name is enough</Text>
      <TextInput
        style={styles.textInput}
        value={form.partnerName}
        onChangeText={(t) => setForm((f) => ({ ...f, partnerName: t }))}
        placeholder="Their first name"
        placeholderTextColor={c.textFaint}
        autoFocus
        maxLength={30}
      />
    </View>,

    // 5: Partner birthday
    <View key={5} style={styles.stepContainer}>
      <Text style={styles.stepLabel}>
        {form.partnerName ? `When is ${form.partnerName}'s birthday?` : "When is their birthday?"}
      </Text>
      <Text style={styles.stepSub}>Approximate is fine if you're not sure</Text>
      <DatePicker value={form.partnerBirthDate} onChange={(d) => setForm((f) => ({ ...f, partnerBirthDate: d, partnerDobSet: true }))} c={c} />
      <Text style={[styles.dobConfirm, !form.partnerDobSet && styles.dobConfirmPending]}>
        {form.partnerDobSet ? `✓ ${formatDob(form.partnerBirthDate)}` : "Scroll to set their date of birth"}
      </Text>
    </View>,

    // 6: Relationship type
    <View key={6} style={[styles.stepContainer, { gap: 10 }]}>
      <Text style={styles.stepLabel}>What is this?</Text>
      <Text style={styles.stepSub}>Be honest. It shapes everything.</Text>
      {relTypes.map((r) => (
        <TouchableOpacity
          key={r.key}
          onPress={() => { Haptics.selectionAsync(); setForm((f) => ({ ...f, relationshipType: r.key })); }}
          style={[styles.relTypeCard, form.relationshipType === r.key && styles.relTypeCardSelected]}
          activeOpacity={0.8}
        >
          <Text style={[styles.relTypeLabel, form.relationshipType === r.key && { color: "#4A3DE8" }]}>{r.label}</Text>
          <Text style={styles.relTypeDesc}>{r.desc}</Text>
        </TouchableOpacity>
      ))}
    </View>,

    // 7: Calculating
    <View key={7} style={[styles.stepContainer, { gap: 20 }]}>
      <CalcAnimation name={form.partnerName} c={c} styles={styles} />
    </View>,
  ];

  const isCalculating = step === TOTAL_STEPS - 1;

  return (
    <View style={{ flex: 1, backgroundColor: c.background }}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView
          style={webScrollStyle}
          contentContainerStyle={[
            styles.container,
            { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 40 },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Top nav */}
          {!isCalculating && (
            <View style={styles.topNav}>
              {step > 0 ? (
                <TouchableOpacity onPress={goBack} style={styles.backBtn} activeOpacity={0.7}>
                  <Ionicons name="chevron-back" size={22} color={c.textMuted} />
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
                        i < step  && styles.progressDotActive,
                        i === step - 1 && styles.progressDotCurrent,
                      ]}
                    />
                  ))}
                </View>
              )}
              <View style={styles.backBtnPlaceholder} />
            </View>
          )}

          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }], flex: 1 }}>
            {steps[step]}
          </Animated.View>

          {!isCalculating && (
            <Pressable onPress={next} disabled={!canProceed()} style={[styles.nextBtn, !canProceed() && { opacity: 0.4 }]}>
              <View style={styles.nextBtnInner}>
                <Text style={styles.nextBtnText}>
                  {step === 0 ? "Begin" : step === TOTAL_STEPS - 2 ? "Reveal" : "Continue"}
                </Text>
                {step > 0 && (
                  <View style={styles.nextBtnArrow}>
                    <Ionicons name="arrow-forward" size={18} color={c.cta} />
                  </View>
                )}
              </View>
            </Pressable>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

function CalcAnimation({ name, c, styles }: { name: string; c: ReturnType<typeof useColors>; styles: any }) {
  const pulseAnim = useRef(new Animated.Value(0.6)).current;
  const [dots, setDots] = useState(0);

  React.useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1,   duration: 700, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0.6, duration: 700, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    );
    loop.start();
    const interval = setInterval(() => setDots((d) => (d + 1) % 4), 500);
    return () => { loop.stop(); clearInterval(interval); };
  }, []);

  return (
    <View style={{ alignItems: "center", gap: 24 }}>
      <Animated.View style={{ opacity: pulseAnim, transform: [{ scale: pulseAnim.interpolate({ inputRange: [0.6, 1], outputRange: [0.94, 1.04] }) }] }}>
        <LinearGradient
          colors={["#4A3DE8", "#8B5CF6", "#10B981"]}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
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

function createStyles(c: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    container: {
      flexGrow: 1,
      paddingHorizontal: HP,
      gap: 20,
    },
    topNav: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 4,
    },
    backBtn: {
      width: 40, height: 40, borderRadius: 20,
      backgroundColor: c.card, borderWidth: 1, borderColor: c.border,
      alignItems: "center", justifyContent: "center",
    },
    backBtnPlaceholder: { width: 40, height: 40 },
    progressRow: {
      flexDirection: "row", gap: 5, alignItems: "center",
      flex: 1, justifyContent: "center",
    },
    progressDot: {
      width: 6, height: 6, borderRadius: 3, backgroundColor: c.border,
    },
    progressDotActive:  { backgroundColor: c.primaryBorder },
    progressDotCurrent: { backgroundColor: "#4A3DE8", width: 18, borderRadius: 3 },

    stepContainer: {
      flex: 1, gap: 14, paddingTop: 16,
      minHeight: 280, justifyContent: "center",
    },

    logoCircle: {
      width: rs(96), height: rs(96), borderRadius: rs(48),
      overflow: "hidden", alignSelf: "center", marginBottom: 4,
      shadowColor: "#000", shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12, shadowRadius: 16, elevation: 5,
    },
    logoGradient: { flex: 1, alignItems: "center", justifyContent: "center" },
    logoInitial: { fontSize: rf(42), fontFamily: "PlusJakartaSans_700Bold", color: "#fff" },

    appName: {
      fontSize: rf(34), fontFamily: "PlusJakartaSans_800ExtraBold",
      color: c.text, textAlign: "center", letterSpacing: -0.8,
    },
    tagline: {
      fontSize: rf(16), fontFamily: "PlusJakartaSans_400Regular",
      color: c.textMuted, textAlign: "center", lineHeight: rf(16) * 1.65,
    },
    stepLabel: {
      fontSize: rf(26), fontFamily: "PlusJakartaSans_800ExtraBold",
      color: c.text, lineHeight: rf(26) * 1.3, letterSpacing: -0.4,
    },
    stepSub: {
      fontSize: rf(15), fontFamily: "PlusJakartaSans_400Regular", color: c.textMuted,
    },
    textInput: {
      backgroundColor: c.card,
      borderWidth: 1.5, borderColor: c.primaryBorder,
      borderRadius: 14,
      paddingHorizontal: 18, paddingVertical: 16,
      fontSize: rf(18), fontFamily: "PlusJakartaSans_600SemiBold",
      color: c.text, marginTop: 8,
      shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
    },
    skipBtn:  { alignSelf: "center", padding: 8 },
    skipText: { fontSize: rf(14), color: c.textFaint, fontFamily: "PlusJakartaSans_400Regular" },

    dobConfirm:        { fontSize: rf(14), fontFamily: "PlusJakartaSans_700Bold", color: "#10B981", textAlign: "center", marginTop: 10 },
    dobConfirmPending: { color: c.textFaint, fontFamily: "PlusJakartaSans_400Regular" },

    relTypeCard: {
      backgroundColor: c.card, borderWidth: 1, borderColor: c.border,
      borderRadius: 14, padding: 16, gap: 4,
      shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
    },
    relTypeCardSelected: { borderColor: c.primaryBorder, backgroundColor: c.primaryLight },
    relTypeLabel: { fontSize: rf(16), fontFamily: "PlusJakartaSans_700Bold", color: c.text },
    relTypeDesc:  { fontSize: rf(13), fontFamily: "PlusJakartaSans_400Regular", color: c.textMuted },

    nextBtn:      { marginTop: 8, borderRadius: 16, overflow: "hidden" },
    nextBtnInner: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: c.cta, paddingVertical: 17, paddingLeft: 22, paddingRight: 8 },
    nextBtnText:  { fontSize: rf(16), fontFamily: "PlusJakartaSans_700Bold", color: c.ctaForeground },
    nextBtnArrow: { width: 38, height: 38, borderRadius: 11, backgroundColor: c.card, alignItems: "center", justifyContent: "center" },

    calcOrb: { width: rs(120), height: rs(120), borderRadius: rs(60) },
    calcTitle: {
      fontSize: rf(22), fontFamily: "PlusJakartaSans_700Bold",
      color: c.text, textAlign: "center",
    },
    calcSub: {
      fontSize: rf(15), fontFamily: "PlusJakartaSans_400Regular",
      color: c.textMuted, textAlign: "center",
    },
    calcSub2: {
      fontSize: rf(13), fontFamily: "PlusJakartaSans_400Regular",
      color: "#4A3DE8", textAlign: "center", lineHeight: rf(13) * 1.7,
    },
  });
}
