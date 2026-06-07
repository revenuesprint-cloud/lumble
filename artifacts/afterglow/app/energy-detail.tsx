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
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ─── What each metric means ───────────────────────────────────────────────────

const METRIC_INFO: Record<string, {
  icon: string; color: string; what: string; high: string; low: string;
}> = {
  affection: {
    icon: "❤️", color: "#E85C7A",
    what: "How warm and close you both feel today. High means affection flows easily — a good day to express it. Low means one or both of you might be pulling inward.",
    high: "Say something kind today. It'll land better than usual.",
    low:  "Don't read into the distance. Give it space and come back tonight.",
  },
  communication: {
    icon: "🗣️", color: "#7C52C8",
    what: "How easy it is for you two to understand each other today. This is about emotional translation — are you speaking the same language right now?",
    high: "Good day for the conversation you've been avoiding.",
    low:  "Keep it simple. Today is not the day for a big confrontation.",
  },
  trust: {
    icon: "🤝", color: "#52C8B8",
    what: "How reliably you're showing up for each other in this period. This isn't about one day — it's a read on your current consistency as a pair.",
    high: "You're both showing up. Notice it and appreciate it.",
    low:  "Someone needs more reassurance right now. Ask, don't assume.",
  },
  attraction: {
    icon: "⚡", color: "#F5A623",
    what: "The physical and energetic pull between you. This naturally ebbs and flows — it's driven by your Yoni and Vashya koota compatibility.",
    high: "The spark is present today. Use it.",
    low:  "Normal fluctuation. Attraction isn't a steady flame — it's weather.",
  },
  positivity: {
    icon: "😊", color: "#B855E0",
    what: "The overall emotional optimism in the connection right now. High means you're both in a space where things feel hopeful. Low means life outside the relationship might be pressing in.",
    high: "Good energy to make plans, say yes to things together.",
    low:  "Be gentle. One or both of you is carrying something external.",
  },
};

// ─── Animated energy bar ──────────────────────────────────────────────────────

function DetailBar({ value, color }: { value: number; color: string }) {
  const widthAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(widthAnim, { toValue: value, duration: 1000, delay: 200, useNativeDriver: false }).start();
  }, []);
  const w = widthAnim.interpolate({ inputRange:[0,100], outputRange:["0%","100%"], extrapolate:"clamp" });
  return (
    <View style={barStyles.track}>
      <Animated.View style={{ width: w, height: "100%", overflow: "hidden", borderRadius: 6 }}>
        <LinearGradient colors={[color+"88", color]} start={{x:0,y:0}} end={{x:1,y:0}} style={{ flex: 1 }} />
      </Animated.View>
    </View>
  );
}

const barStyles = StyleSheet.create({
  track: { height: 8, backgroundColor: "rgba(240,235,248,0.08)", borderRadius: 6, overflow: "hidden" },
});

// ─── Metric card ──────────────────────────────────────────────────────────────

function MetricCard({ icon, label, value, color, what, tip }: {
  icon:string; label:string; value:number; color:string; what:string; tip:string;
}) {
  const pct     = Math.round(value);
  const verdict = pct >= 72 ? "Strong" : pct >= 52 ? "Good" : pct >= 38 ? "Moderate" : "Low";

  return (
    <View style={[mcStyles.card, { borderColor: color + "22" }]}>
      <LinearGradient colors={[color+"0C","transparent"]} style={mcStyles.inner}>
        {/* Top row */}
        <View style={mcStyles.topRow}>
          <View style={mcStyles.left}>
            <Text style={mcStyles.icon}>{icon}</Text>
            <Text style={mcStyles.label}>{label}</Text>
          </View>
          <View style={[mcStyles.badge, { backgroundColor: color + "18", borderColor: color + "44" }]}>
            <Text style={[mcStyles.badgeText, { color }]}>{pct}% · {verdict}</Text>
          </View>
        </View>

        <DetailBar value={value} color={color} />

        {/* What it means */}
        <Text style={mcStyles.what}>{what}</Text>

        {/* Tip */}
        <View style={[mcStyles.tipRow, { borderLeftColor: color + "66" }]}>
          <Text style={[mcStyles.tip, { color: color + "CC" }]}>{tip}</Text>
        </View>
      </LinearGradient>
    </View>
  );
}

const mcStyles = StyleSheet.create({
  card:     { borderRadius: 20, borderWidth: 1, overflow: "hidden" },
  inner:    { padding: 20, gap: 14 },
  topRow:   { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 10 },
  left:     { flexDirection: "row", alignItems: "center", gap: 10 },
  icon:     { fontSize: 22 },
  label:    { fontSize: 16, fontFamily: "Nunito_700Bold", color: "#F0EBF8" },
  badge:    { borderRadius: 20, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 4 },
  badgeText:{ fontSize: 11, fontFamily: "Nunito_600SemiBold" },
  what:     { fontSize: 14, fontFamily: "Nunito_400Regular", color: "rgba(240,235,248,0.65)", lineHeight: 22 },
  tipRow:   { borderLeftWidth: 2, paddingLeft: 12 },
  tip:      { fontSize: 14, fontFamily: "Nunito_600SemiBold", lineHeight: 21 },
});

// ─── Energy Detail Screen ─────────────────────────────────────────────────────

export default function EnergyDetailScreen() {
  const insets  = useSafeAreaInsets();
  const router  = useRouter();
  const { user, partner } = useApp();

  const reading = useMemo(() => {
    if (!user || !partner) return null;
    return getAstrologyReading(user.name, user.birthDate, partner.name, partner.birthDate, user.birthTime);
  }, [user?.birthDate, user?.name, user?.birthTime, partner?.birthDate, partner?.name]);

  if (!user || !partner || !reading) return null;

  const energy  = getDailyEnergyPersonalized(reading, reading.user.dasha.current);
  const uMoon   = RASHIS[reading.user.moonRashi].en;
  const pMoon   = RASHIS[reading.partner.moonRashi].en;

  const date    = new Date().toLocaleDateString("en-US", { weekday:"long", month:"long", day:"numeric" });

  const metrics = [
    { key:"affection",     label:"Affection",     value: energy.closeness },
    { key:"communication", label:"Communication",  value: energy.communication },
    { key:"trust",         label:"Trust",          value: energy.trust },
    { key:"attraction",    label:"Attraction",     value: energy.attraction },
    { key:"positivity",    label:"Positivity",     value: energy.positivity },
  ];

  return (
    <LinearGradient colors={["#080611","#0D0A1E"]} style={{ flex: 1 }}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === "web" ? 80 : 16) }]}>
        <TouchableOpacity
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.back(); }}
          activeOpacity={0.7}
          style={styles.backBtn}
        >
          <Feather name="arrow-left" size={20} color="rgba(240,235,248,0.7)" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Your energy today</Text>
          <Text style={styles.headerSub}>{date}</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={Platform.OS === "web" ? { maxWidth:640, alignSelf:"center", width:"100%" } : undefined}
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 40 }]}
      >
        {/* Context */}
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

        {/* Each metric */}
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

        {/* Footer note */}
        <Text style={styles.footer}>
          These are directional signals, not diagnoses. Use them as a lens, not a verdict.
        </Text>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header:        { flexDirection:"row", alignItems:"flex-start", paddingHorizontal:20, paddingBottom:16, gap:12 },
  backBtn:       { width:40, height:40, borderRadius:20, backgroundColor:"rgba(240,235,248,0.06)", alignItems:"center", justifyContent:"center", marginTop:2 },
  headerTitle:   { fontSize:20, fontFamily:"Nunito_700Bold", color:"#F0EBF8" },
  headerSub:     { fontSize:13, fontFamily:"Nunito_400Regular", color:"rgba(240,235,248,0.38)", marginTop:2 },
  scroll:        { paddingHorizontal:20, gap:16 },

  contextCard:   { backgroundColor:"#0C0A18", borderRadius:20, borderWidth:1, borderColor:"rgba(240,235,248,0.07)", padding:20, gap:14 },
  contextTitle:  { fontSize:13, fontFamily:"Nunito_600SemiBold", color:"rgba(240,235,248,0.5)" },
  contextBody:   { fontSize:14, fontFamily:"Nunito_400Regular", color:"rgba(240,235,248,0.65)", lineHeight:22 },
  contextNote:   { borderLeftWidth:2, borderLeftColor:"rgba(232,92,122,0.4)", paddingLeft:12 },
  contextNoteText:{ fontSize:14, fontFamily:"Nunito_400Regular", color:"rgba(240,235,248,0.75)", lineHeight:22, fontStyle:"italic" },

  footer:        { fontSize:13, fontFamily:"Nunito_400Regular", color:"rgba(240,235,248,0.28)", textAlign:"center", lineHeight:20, paddingTop:4, paddingBottom:8 },
});
