import { useApp } from "@/context/AppContext";
import { getAstrologyReading, RASHIS } from "@/utils/astrology";
import { getDailyEnergyPersonalized } from "@/utils/personalization";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useRef } from "react";
import {
  Animated,
  Easing,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const METRIC_INFO: Record<string, { icon: string; color: string; what: string; high: string; low: string }> = {
  affection: {
    icon: "❤️", color: "#F43F5E",
    what: "How warm and close you both feel today. High means affection flows easily — a good day to express it. Low means one or both of you might be pulling inward.",
    high: "Say something kind today. It'll land better than usual.",
    low:  "Don't read into the distance. Give it space and come back tonight.",
  },
  communication: {
    icon: "🗣️", color: "#5B4CE8",
    what: "How easy it is for you two to understand each other today. This is about emotional translation — are you speaking the same language right now?",
    high: "Good day for the conversation you've been avoiding.",
    low:  "Keep it simple. Today is not the day for a big confrontation.",
  },
  trust: {
    icon: "🤝", color: "#10B981",
    what: "How reliably you're showing up for each other in this period. This isn't about one day — it's a read on your current consistency as a pair.",
    high: "You're both showing up. Notice it and appreciate it.",
    low:  "Someone needs more reassurance right now. Ask, don't assume.",
  },
  attraction: {
    icon: "⚡", color: "#F59E0B",
    what: "The physical and energetic pull between you. This naturally ebbs and flows — it's driven by your Yoni and Vashya koota compatibility.",
    high: "The spark is present today. Use it.",
    low:  "Normal fluctuation. Attraction isn't a steady flame — it's weather.",
  },
  positivity: {
    icon: "😊", color: "#8B5CF6",
    what: "The overall emotional optimism in the connection right now. High means you're both in a space where things feel hopeful. Low means life outside the relationship might be pressing in.",
    high: "Good energy to make plans, say yes to things together.",
    low:  "Be gentle. One or both of you is carrying something external.",
  },
};

function DetailBar({ value, color }: { value: number; color: string }) {
  const widthAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(widthAnim, { toValue: value, duration: 600, delay: 100, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();
  }, [value]);
  const w = widthAnim.interpolate({ inputRange: [0, 100], outputRange: ["0%", "100%"], extrapolate: "clamp" });
  return (
    <View style={barStyles.track}>
      <Animated.View style={{ width: w, height: "100%", overflow: "hidden", borderRadius: 6 }}>
        <LinearGradient colors={[color + "88", color]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ flex: 1 }} />
      </Animated.View>
    </View>
  );
}

const barStyles = StyleSheet.create({
  track: { height: 8, backgroundColor: "#F3F4F6", borderRadius: 6, overflow: "hidden" },
});

function MetricCard({ icon, label, value, color, what, tip }: {
  icon: string; label: string; value: number; color: string; what: string; tip: string;
}) {
  const pct     = Math.round(value);
  const verdict = pct >= 72 ? "Strong" : pct >= 52 ? "Good" : pct >= 38 ? "Moderate" : "Low";
  const verdictBg = pct >= 52 ? "#ECFDF5" : pct >= 38 ? "#FFFBEB" : "#FFF1F2";
  const verdictColor = pct >= 52 ? "#10B981" : pct >= 38 ? "#F59E0B" : "#F43F5E";

  return (
    <View style={mcStyles.card}>
      <View style={mcStyles.topRow}>
        <View style={mcStyles.left}>
          <Text style={mcStyles.icon}>{icon}</Text>
          <Text style={mcStyles.label}>{label}</Text>
        </View>
        <View style={[mcStyles.badge, { backgroundColor: verdictBg, borderColor: verdictColor + "44" }]}>
          <Text style={[mcStyles.badgeText, { color: verdictColor }]}>{pct}% · {verdict}</Text>
        </View>
      </View>
      <DetailBar value={value} color={color} />
      <Text style={mcStyles.what}>{what}</Text>
      <View style={[mcStyles.tipPill, { backgroundColor: color + "0E" }]}>
        <Text style={[mcStyles.tip, { color: color }]}>{tip}</Text>
      </View>
    </View>
  );
}

const mcStyles = StyleSheet.create({
  card:     { borderRadius: 16, borderWidth: 1, borderColor: "#E5E7EB", backgroundColor: "#FFFFFF",
              padding: 16, gap: 12,
              shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
  topRow:   { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 10 },
  left:     { flexDirection: "row", alignItems: "center", gap: 10 },
  icon:     { fontSize: 20 },
  label:    { fontSize: 16, fontFamily: "PlusJakartaSans_700Bold", color: "#111827" },
  badge:    { borderRadius: 20, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 4 },
  badgeText:{ fontSize: 11, fontFamily: "PlusJakartaSans_600SemiBold" },
  what:     { fontSize: 14, fontFamily: "PlusJakartaSans_400Regular", color: "#6B7280", lineHeight: 22 },
  tipPill:  { borderRadius: 10, padding: 12 },
  tip:      { fontSize: 14, fontFamily: "PlusJakartaSans_600SemiBold", lineHeight: 21 },
});

export default function EnergyDetailScreen() {
  const insets  = useSafeAreaInsets();
  const router  = useRouter();
  const { user, partner } = useApp();

  const reading = useMemo(() => {
    if (!user || !partner) return null;
    return getAstrologyReading(user.name, user.birthDate, partner.name, partner.birthDate, user.birthTime);
  }, [user?.birthDate, user?.name, user?.birthTime, partner?.birthDate, partner?.name]);

  if (!user || !partner || !reading) return null;

  const energy = getDailyEnergyPersonalized(reading, reading.user.dasha.current);
  const uMoon  = RASHIS[reading.user.moonRashi].en;
  const pMoon  = RASHIS[reading.partner.moonRashi].en;
  const date   = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  const metrics = [
    { key: "affection",     label: "Affection",     value: energy.closeness },
    { key: "communication", label: "Communication",  value: energy.communication },
    { key: "trust",         label: "Trust",          value: energy.trust },
    { key: "attraction",    label: "Attraction",     value: energy.attraction },
    { key: "positivity",    label: "Positivity",     value: energy.positivity },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: "#F4F5F7" }}>
      <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === "web" ? 80 : 16) }]}>
        <TouchableOpacity
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.back(); }}
          activeOpacity={0.7}
          style={styles.backBtn}
        >
          <Feather name="arrow-left" size={20} color="#6B7280" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Your energy today</Text>
          <Text style={styles.headerSub}>{date}</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={Platform.OS === "web" ? { maxWidth: 640, alignSelf: "center", width: "100%" } : undefined}
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 40 }]}
      >
        <View style={styles.contextCard}>
          <Text style={styles.contextTitle}>How this is calculated</Text>
          <Text style={styles.contextBody}>
            Each score is derived from your kundli's koota breakdown — the eight traditional compatibility points calculated from your and {partner.name}'s birth charts. They're not guesses.
            {"\n\n"}
            Your {uMoon} moon and {partner.name}'s {pMoon} moon are the primary drivers. On top of that, a daily seed shifts each score slightly — so the exact numbers vary day to day, but the underlying compatibility pattern stays the same.
            {"\n\n"}
            Think of these as directional signals, not diagnoses. A low score on communication doesn't mean something is broken — it means today is a harder day for being understood by each other, and it's worth being a little more patient.
          </Text>
          <View style={styles.contextNote}>
            <Text style={styles.contextNoteText}>"{energy.message}"</Text>
          </View>
        </View>

        {metrics.map((m) => {
          const info = METRIC_INFO[m.key];
          const tip  = m.value >= 58 ? info.high : info.low;
          return (
            <MetricCard
              key={m.key}
              icon={info.icon}
              label={m.label}
              value={m.value}
              color={info.color}
              what={info.what}
              tip={tip}
            />
          );
        })}

        <Text style={styles.footer}>
          These are directional signals, not diagnoses. Use them as a lens, not a verdict.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header:          { flexDirection: "row", alignItems: "flex-start", paddingHorizontal: 20, paddingBottom: 16, gap: 12, backgroundColor: "#F4F5F7" },
  backBtn:         { width: 40, height: 40, borderRadius: 20, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E5E7EB", alignItems: "center", justifyContent: "center", marginTop: 2 },
  headerTitle:     { fontSize: 20, fontFamily: "PlusJakartaSans_700Bold", color: "#111827" },
  headerSub:       { fontSize: 13, fontFamily: "PlusJakartaSans_400Regular", color: "#9CA3AF", marginTop: 2 },
  scroll:          { paddingHorizontal: 20, gap: 14 },
  contextCard:     { backgroundColor: "#FFFFFF", borderRadius: 20, borderWidth: 1, borderColor: "#E5E7EB", padding: 20, gap: 12,
                     shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 2 },
  contextTitle:    { fontSize: 13, fontFamily: "PlusJakartaSans_600SemiBold", color: "#9CA3AF" },
  contextBody:     { fontSize: 14, fontFamily: "PlusJakartaSans_400Regular", color: "#6B7280", lineHeight: 22 },
  contextNote:     { borderLeftWidth: 3, borderLeftColor: "#C7D2FE", paddingLeft: 12 },
  contextNoteText: { fontSize: 14, fontFamily: "PlusJakartaSans_400Regular", color: "#374151", lineHeight: 22, fontStyle: "italic" },
  footer:          { fontSize: 13, fontFamily: "PlusJakartaSans_400Regular", color: "#9CA3AF", textAlign: "center", lineHeight: 20, paddingTop: 4, paddingBottom: 8 },
});
