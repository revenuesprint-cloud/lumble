import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import { SCREEN_W } from "@/constants/layout";
import { getAstrologyReading, RASHIS } from "@/utils/astrology";
import {
  getDailyEnergyPersonalized,
  getPersonalizedHero,
  getTodayBetweenYou,
} from "@/utils/personalization";
import { fetchDailyContent, type DailyContent } from "@/utils/dbContent";
import { extractKundliAttributes } from "@/utils/challenges";
import { getLuckyFeatures, type LuckyFeatures } from "@/utils/lucky";
import { recordDailyOpen, getDailyPrediction, type StreakState } from "@/utils/daily";
import { ensureDailyNotifications } from "@/utils/notifications";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Card width for the swipe carousel — fills the padded content area exactly.
const PAGE_W = SCREEN_W - 36;

// ─── Streak chip (header) ─────────────────────────────────────────────────────

function StreakChip({ streak }: { streak: number }) {
  const c = useColors();
  const s = useMemo(() => createStreakChipStyles(c), [c]);
  return (
    <View style={s.chip}>
      <Text style={s.flame}>🔥</Text>
      <Text style={s.num}>{streak}</Text>
    </View>
  );
}

function createStreakChipStyles(c: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    chip:  { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: c.goldLight, borderWidth: 1, borderColor: "#F59E0B44", borderRadius: 20, paddingHorizontal: 10, paddingVertical: 6 },
    flame: { fontSize: 13 },
    num:   { fontSize: 13, fontFamily: "PlusJakartaSans_800ExtraBold", color: "#D97706" },
  });
}

// ─── Daily loop banner (love weather) ─────────────────────────────────────────

function DailyBanner({
  score, streak, onPress,
}: { score: number; streak: number; onPress: () => void }) {
  const c = useColors();
  const s = useMemo(() => createDailyStyles(c), [c]);
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.88}>
      <LinearGradient
        colors={["#4A3DE8", "#8B5CF6"]}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={s.banner}
      >
        <View style={s.scoreWrap}>
          <Text style={s.scoreVal}>{score}</Text>
          <Text style={s.scoreLabel}>LOVE{"\n"}WEATHER</Text>
        </View>
        <View style={s.bannerMid}>
          <Text style={s.bannerTitle}>Your daily is ready</Text>
          <Text style={s.bannerSub}>
            {streak > 1 ? `${streak}-day streak · ` : ""}prediction, ritual & today's question
          </Text>
        </View>
        <View style={s.bannerArrow}>
          <Feather name="arrow-right" size={16} color="#4A3DE8" />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

function createDailyStyles(c: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    banner:      { flexDirection: "row", alignItems: "center", gap: 14, borderRadius: 16, padding: 16, shadowColor: "#4A3DE8", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.22, shadowRadius: 12, elevation: 5 },
    scoreWrap:   { alignItems: "center", width: 50 },
    scoreVal:    { fontSize: 30, fontFamily: "PlusJakartaSans_800ExtraBold", color: "#FFFFFF", lineHeight: 32, letterSpacing: -0.8 },
    scoreLabel:  { fontSize: 7.5, fontFamily: "PlusJakartaSans_700Bold", color: "#FFFFFFCC", letterSpacing: 0.6, textAlign: "center", marginTop: 1 },
    bannerMid:   { flex: 1 },
    bannerTitle: { fontSize: 16, fontFamily: "PlusJakartaSans_800ExtraBold", color: "#FFFFFF", letterSpacing: -0.2 },
    bannerSub:   { fontSize: 12, fontFamily: "PlusJakartaSans_400Regular", color: "#FFFFFFDD", marginTop: 2, lineHeight: 17 },
    bannerArrow: { width: 30, height: 30, borderRadius: 10, backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center" },
  });
}

// ─── Swipe reads (30-second cards) ────────────────────────────────────────────

interface Read {
  kicker: string;
  tag: string;
  title: string;
  body: string;
  cta: string;
  accent: string;
  chipBg: string;
}

function SwipeReads({ reads, onOpen }: { reads: Read[]; onOpen: () => void }) {
  const c = useColors();
  const s = useMemo(() => createReadsStyles(c), [c]);
  const [idx, setIdx] = useState(0);

  return (
    <View style={{ gap: 10 }}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const i = Math.round(e.nativeEvent.contentOffset.x / PAGE_W);
          if (i !== idx) { setIdx(i); Haptics.selectionAsync(); }
        }}
      >
        {reads.map((r, i) => (
          <TouchableOpacity
            key={i}
            activeOpacity={0.9}
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onOpen(); }}
            style={[s.card, { width: PAGE_W }]}
          >
            <View style={s.top}>
              <View style={[s.chip, { backgroundColor: r.chipBg, borderColor: r.accent + "44" }]}>
                <Text style={[s.chipText, { color: r.accent }]}>{r.tag}</Text>
              </View>
              <Text style={s.kicker}>{r.kicker}</Text>
            </View>
            <Text style={s.title} numberOfLines={2}>{r.title}</Text>
            <Text style={s.body} numberOfLines={3}>{r.body}</Text>
            <View style={s.divider} />
            <View style={s.footer}>
              <Text style={[s.cta, { color: r.accent }]}>{r.cta}</Text>
              <Feather name="arrow-right" size={13} color={r.accent} />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={s.dots}>
        {reads.map((_, i) => (
          <View key={i} style={[s.dot, i === idx && s.dotActive]} />
        ))}
      </View>
    </View>
  );
}

function createReadsStyles(c: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    card:    { backgroundColor: c.card, borderRadius: 16, borderWidth: 1, borderColor: c.border, padding: 18, gap: 10, minHeight: 168, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 3 },
    top:     { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    chip:    { borderWidth: 1, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
    chipText:{ fontSize: 11, fontFamily: "PlusJakartaSans_700Bold" },
    kicker:  { fontSize: 10, fontFamily: "PlusJakartaSans_700Bold", color: c.textFaint, letterSpacing: 1.2 },
    title:   { fontSize: 19, fontFamily: "PlusJakartaSans_800ExtraBold", color: c.text, lineHeight: 25, letterSpacing: -0.3 },
    body:    { fontSize: 14, fontFamily: "PlusJakartaSans_400Regular", color: c.textBody, lineHeight: 21 },
    divider: { height: 1, backgroundColor: c.borderLight, marginTop: 2 },
    footer:  { flexDirection: "row", alignItems: "center", gap: 6 },
    cta:     { fontSize: 13, fontFamily: "PlusJakartaSans_700Bold" },
    dots:    { flexDirection: "row", justifyContent: "center", gap: 6 },
    dot:     { width: 6, height: 6, borderRadius: 3, backgroundColor: c.border },
    dotActive:{ width: 18, backgroundColor: "#4A3DE8" },
  });
}

// ─── Energy progress bars ─────────────────────────────────────────────────────

interface Metric { label: string; value: number; color: string; }

function EnergyBars({ metrics, compatPct, onPress }: {
  metrics: Metric[]; compatPct: number; onPress: () => void;
}) {
  const c = useColors();
  const s = useMemo(() => createEnergyStyles(c), [c]);
  return (
    <TouchableOpacity activeOpacity={0.85} onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onPress(); }} style={s.card}>
      <View style={s.header}>
        <Text style={s.title}>Today's energy</Text>
        <View style={s.compatPill}>
          <Text style={s.compatText}>{compatPct}% match</Text>
        </View>
      </View>
      {metrics.map((m) => (
        <View key={m.label} style={s.row}>
          <Text style={s.label}>{m.label}</Text>
          <View style={s.track}>
            <View style={[s.fill, { width: `${Math.max(4, Math.min(100, m.value))}%`, backgroundColor: m.color }]} />
          </View>
          <Text style={[s.pct, { color: m.color }]}>{Math.round(m.value)}</Text>
        </View>
      ))}
      <View style={s.footer}>
        <Text style={s.footerText}>See what's driving today</Text>
        <Feather name="arrow-right" size={13} color={c.textFaint} />
      </View>
    </TouchableOpacity>
  );
}

function createEnergyStyles(c: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    card:       { backgroundColor: c.card, borderRadius: 16, borderWidth: 1, borderColor: c.border, padding: 16, gap: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
    header:     { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    title:      { fontSize: 15, fontFamily: "PlusJakartaSans_700Bold", color: c.text },
    compatPill: { backgroundColor: c.primaryLight, borderWidth: 1, borderColor: c.primaryBorder, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
    compatText: { fontSize: 11, fontFamily: "PlusJakartaSans_700Bold", color: "#4A3DE8" },
    row:        { flexDirection: "row", alignItems: "center", gap: 10 },
    label:      { width: 96, fontSize: 12, fontFamily: "PlusJakartaSans_600SemiBold", color: c.textBody },
    track:      { flex: 1, height: 8, borderRadius: 6, backgroundColor: c.borderLight, overflow: "hidden" },
    fill:       { height: "100%", borderRadius: 6 },
    pct:        { width: 26, textAlign: "right", fontSize: 12, fontFamily: "PlusJakartaSans_800ExtraBold" },
    footer:     { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 2 },
    footerText: { fontSize: 12, fontFamily: "PlusJakartaSans_600SemiBold", color: c.textFaint },
  });
}

// ─── Today's Luck row ────────────────────────────────────────────────────────

function LuckyRow({ features, onPress }: { features: LuckyFeatures; onPress: (focus: "number" | "color") => void }) {
  const c = useColors();
  const s = useMemo(() => createLuckyStyles(c), [c]);
  return (
    <View style={s.luckyRow}>
      {/* Lucky Number card */}
      <TouchableOpacity onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onPress("number"); }} activeOpacity={0.82} style={s.luckyCard}>
        <Text style={s.luckyCardLabel}>TODAY'S NUMBER</Text>
        <Text style={s.luckyNumber}>{features.number}</Text>
        <Text style={s.luckyArchetype}>{features.archetype}</Text>
        <View style={s.luckyTapRow}>
          <Text style={s.luckyTap}>Reveal meaning</Text>
          <Feather name="arrow-right" size={11} color="#4A3DE8" />
        </View>
      </TouchableOpacity>

      {/* Lucky Color card */}
      <TouchableOpacity onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onPress("color"); }} activeOpacity={0.82} style={s.luckyCard}>
        <Text style={s.luckyCardLabel}>TODAY'S COLOR</Text>
        <LinearGradient
          colors={features.color.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={s.colorSwatch}
        />
        <Text style={s.luckyArchetype}>{features.color.name}</Text>
        <View style={s.luckyTapRow}>
          <Text style={s.luckyTap}>See meaning</Text>
          <Feather name="arrow-right" size={11} color="#4A3DE8" />
        </View>
      </TouchableOpacity>
    </View>
  );
}

function createLuckyStyles(c: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    luckyRow:       { flexDirection: "row", gap: 12 },
    luckyCard:      { flex: 1, backgroundColor: c.card, borderRadius: 16, borderWidth: 1, borderColor: c.border, padding: 14, gap: 6, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
    luckyCardLabel: { fontSize: 9, fontFamily: "PlusJakartaSans_700Bold", color: c.textFaint, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 2 },
    luckyNumber:    { fontSize: 46, fontFamily: "PlusJakartaSans_800ExtraBold", color: "#4A3DE8", lineHeight: 52, letterSpacing: -1 },
    luckyArchetype: { fontSize: 14, fontFamily: "PlusJakartaSans_700Bold", color: c.text },
    luckyTapRow:    { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 },
    luckyTap:       { fontSize: 11, fontFamily: "PlusJakartaSans_700Bold", color: "#4A3DE8" },
    colorSwatch:    { height: 40, borderRadius: 10, marginBottom: 2 },
  });
}

// ─── Quick access grid (trimmed) ──────────────────────────────────────────────

type NavItem = {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  sublabel: string;
  color: string;
  bg: string;
  route: string;
};

function QuickAccessGrid({ compatPct, onPress }: { compatPct: number; onPress: (route: string) => void }) {
  const c = useColors();
  const s = useMemo(() => createGridStyles(c), [c]);

  const items: NavItem[] = [
    { icon: "heart",          label: "Us",         sublabel: `${compatPct}% compatibility`, color: "#4A3DE8", bg: c.primaryLight, route: "/(tabs)/compatibility" },
    { icon: "zap",            label: "Insights",   sublabel: "10 things about you",          color: "#F59E0B", bg: c.goldLight,    route: "/(tabs)/features" },
    { icon: "message-circle", label: "Ask",        sublabel: "Oracle guidance",              color: "#10B981", bg: c.emeraldLight, route: "/(tabs)/guidance" },
    { icon: "user",           label: "Your Chart", sublabel: "Moon & nakshatra",             color: "#8B5CF6", bg: c.violetLight,  route: "profile-detail" },
  ];

  const rows: NavItem[][] = [];
  for (let i = 0; i < items.length; i += 2) rows.push(items.slice(i, i + 2));

  return (
    <View style={s.gridWrap}>
      {rows.map((row, ri) => (
        <View key={ri} style={s.gridRow}>
          {row.map((item) => (
            <TouchableOpacity
              key={item.label}
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onPress(item.route); }}
              activeOpacity={0.8}
              style={s.gridCard}
            >
              <View style={[s.gridIconBox, { backgroundColor: item.bg }]}>
                <Feather name={item.icon} size={20} color={item.color} />
              </View>
              <View style={s.gridTextBlock}>
                <Text style={s.gridLabel}>{item.label}</Text>
                <Text style={s.gridSublabel}>{item.sublabel}</Text>
              </View>
              <Feather name="chevron-right" size={14} color={c.borderLight} />
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
}

function createGridStyles(c: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    gridWrap: { gap: 10 },
    gridRow:  { flexDirection: "row", gap: 10 },
    gridCard: { flex: 1, flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: c.card, borderRadius: 16, borderWidth: 1, borderColor: c.border, padding: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
    gridIconBox:   { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center", flexShrink: 0 },
    gridTextBlock: { flex: 1 },
    gridLabel:     { fontSize: 13, fontFamily: "PlusJakartaSans_700Bold", color: c.text },
    gridSublabel:  { fontSize: 11, fontFamily: "PlusJakartaSans_400Regular", color: c.textFaint, marginTop: 1 },
  });
}

// ─── Home screen ──────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const insets  = useSafeAreaInsets();
  const router  = useRouter();
  const { user, partner, challenges } = useApp();
  const c = useColors();
  const s = useMemo(() => createStyles(c), [c]);

  const reading = useMemo(() => {
    if (!user || !partner) return null;
    return getAstrologyReading(user.name, user.birthDate, partner.name, partner.birthDate, user.birthTime);
  }, [user?.birthDate, user?.name, user?.birthTime, partner?.birthDate, partner?.name]);

  const [dbContent, setDbContent] = useState<DailyContent | null>(null);
  useEffect(() => {
    if (!reading || !partner) return;
    const attrs = extractKundliAttributes(reading, partner.relationshipType ?? "relationship");
    const tags  = Object.entries(attrs).map(([k, v]) => `${k}:${v}`).filter(Boolean);
    fetchDailyContent(tags).then((d) => { if (d) setDbContent(d); });
  }, [reading]);

  const [streak, setStreak] = useState<StreakState | null>(null);
  useEffect(() => {
    recordDailyOpen().then(setStreak).catch(() => {});
    ensureDailyNotifications().catch(() => {});
  }, []);

  if (!user || !partner || !reading) return null;

  const hero      = getPersonalizedHero(user.name, partner.name, reading, partner.relationshipType);
  const rightNow  = getTodayBetweenYou(reading, partner.relationshipType, user.name, partner.name);
  const energy    = getDailyEnergyPersonalized(reading, reading.user.dasha.current);

  const uRashi        = RASHIS[reading.user.moonRashi];
  const luckyFeatures = getLuckyFeatures(user.birthDate, uRashi.element);

  const compatPct  = Math.round((reading.guna.total / 36) * 100);
  const dailyMsg   = dbContent?.message?.body ?? null;
  const prediction = getDailyPrediction(reading, partner.relationshipType);

  const hour     = new Date().getHours();
  const greeting = hour < 12 ? "Good morning," : hour < 18 ? "Good afternoon," : "Good evening,";

  const haptic = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  const navigate = (route: string) => router.push(route as any);

  const openReading = () => {
    haptic();
    router.push({
      pathname: "/reading-detail",
      params: { headline: hero.headline, insight: hero.insight, action: hero.action, moonTag: hero.moonTag },
    });
  };

  const reads: Read[] = [
    { kicker: "TODAY'S FOCUS", tag: hero.moonTag, title: hero.headline, body: dailyMsg ?? hero.insight, cta: "Read the full insight", accent: "#4A3DE8", chipBg: c.primaryLight },
    { kicker: "RIGHT NOW", tag: user.name, title: "Where you are today", body: rightNow.userMoment, cta: "See what's between you", accent: "#10B981", chipBg: c.emeraldLight },
    { kicker: "RIGHT NOW", tag: partner.name, title: `Where ${partner.name} is today`, body: rightNow.partnerSignal, cta: "See what's between you", accent: "#F43F5E", chipBg: c.roseLight },
  ];

  const metrics: Metric[] = [
    { label: "Closeness",     value: energy.closeness,     color: "#F43F5E" },
    { label: "Communication", value: energy.communication, color: "#4A3DE8" },
    { label: "Attraction",    value: energy.attraction,    color: "#F59E0B" },
    { label: "Trust",         value: energy.trust,         color: "#10B981" },
  ];

  return (
    <View style={s.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={Platform.OS === "web" ? s.webScroll : undefined}
        contentContainerStyle={[s.scroll, {
          paddingTop:    insets.top + (Platform.OS === "web" ? 67 : 20),
          paddingBottom: insets.bottom + 100,
        }]}
      >

        {/* ── Header ── */}
        <View style={s.header}>
          <View>
            <Text style={s.greeting}>{greeting}</Text>
            <Text style={s.userName}>{user.name}</Text>
          </View>
          <View style={s.headerRight}>
            <StreakChip streak={streak?.current ?? 1} />
            <TouchableOpacity
              onPress={() => { haptic(); router.push("/profile"); }}
              activeOpacity={0.75}
              style={s.avatarWrap}
            >
              <View style={s.avatar}>
                <Text style={s.avatarInitial}>{user.name.charAt(0)?.toUpperCase() || "?"}</Text>
              </View>
              <View style={s.avatarChevron}>
                <Feather name="chevron-right" size={8} color="#4A3DE8" />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Daily loop banner ── */}
        <DailyBanner
          score={prediction.score}
          streak={streak?.current ?? 1}
          onPress={() => { haptic(); router.push("/(tabs)/together" as any); }}
        />

        {/* ── Swipe reads ── */}
        <View style={s.section}>
          <Text style={s.sectionLabel}>SWIPE TODAY'S READS</Text>
          <SwipeReads reads={reads} onOpen={openReading} />
        </View>

        {/* ── Energy progress ── */}
        <EnergyBars metrics={metrics} compatPct={compatPct} onPress={() => navigate("/energy-detail")} />

        {/* ── Today's Luck ── */}
        <View style={s.section}>
          <Text style={s.sectionLabel}>TODAY'S LUCK</Text>
          <LuckyRow features={luckyFeatures} onPress={(focus) => { haptic(); router.push({ pathname: "/lucky-detail", params: { focus } } as any); }} />
        </View>

        {/* ── Explore ── */}
        <View style={s.section}>
          <Text style={s.sectionLabel}>EXPLORE</Text>
          <QuickAccessGrid compatPct={compatPct} onPress={navigate} />
        </View>

      </ScrollView>
    </View>
  );
}

function createStyles(c: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    root:     { flex: 1, backgroundColor: c.background },
    webScroll:{ maxWidth: 640, alignSelf: "center", width: "100%" },
    scroll:   { paddingHorizontal: 18, gap: 16 },

    // Header
    header:        { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    headerRight:   { flexDirection: "row", alignItems: "center", gap: 10 },
    greeting:      { fontSize: 12, fontFamily: "PlusJakartaSans_400Regular", color: c.textFaint },
    userName:      { fontSize: 28, fontFamily: "PlusJakartaSans_800ExtraBold", color: c.text, letterSpacing: -0.5 },
    avatarWrap:    { position: "relative" },
    avatar:        { width: 46, height: 46, borderRadius: 23, backgroundColor: "#4A3DE8", alignItems: "center", justifyContent: "center" },
    avatarInitial: { fontSize: 18, fontFamily: "PlusJakartaSans_700Bold", color: "#FFFFFF" },
    avatarChevron: { position: "absolute", bottom: 0, right: 0, width: 16, height: 16, borderRadius: 8, backgroundColor: c.card, borderWidth: 1.5, borderColor: c.border, alignItems: "center", justifyContent: "center" },

    // Section wrapper
    section:      { gap: 10 },
    sectionLabel: { fontSize: 11, fontFamily: "PlusJakartaSans_700Bold", color: c.textFaint, textTransform: "uppercase", letterSpacing: 1.2 },
  });
}
