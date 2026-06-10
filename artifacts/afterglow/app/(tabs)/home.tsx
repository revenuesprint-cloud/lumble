import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import { getAstrologyReading, RASHIS } from "@/utils/astrology";
import {
  getDailyEnergyPersonalized,
  getPersonalizedHero,
  getTodayBetweenYou,
} from "@/utils/personalization";
import { fetchDailyContent, type DailyContent } from "@/utils/dbContent";
import { extractKundliAttributes } from "@/utils/challenges";
import { getLuckyFeatures, type LuckyFeatures } from "@/utils/lucky";
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

// ─── Stats strip ──────────────────────────────────────────────────────────────

function StatsStrip({
  compatPct, patternCount, dasha,
}: { compatPct: number; patternCount: number; dasha: string }) {
  const c = useColors();
  const s = useMemo(() => createStatsStyles(c), [c]);
  const items = [
    { value: `${compatPct}%`, label: "Compatibility" },
    { value: String(patternCount), label: "Patterns" },
    { value: dasha, label: "Dasha Phase" },
  ];
  return (
    <View style={s.statsRow}>
      {items.map((item, i) => (
        <View key={i} style={[s.statItem, i < items.length - 1 && s.statItemBorder]}>
          <Text style={s.statValue}>{item.value}</Text>
          <Text style={s.statLabel}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
}

function createStatsStyles(c: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    statsRow:       { flexDirection: "row", backgroundColor: c.card, borderRadius: 16, borderWidth: 1, borderColor: c.border, overflow: "hidden", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
    statItem:       { flex: 1, alignItems: "center", paddingVertical: 14 },
    statItemBorder: { borderRightWidth: 1, borderRightColor: c.borderLight },
    statValue:      { fontSize: 20, fontFamily: "PlusJakartaSans_800ExtraBold", color: c.text, letterSpacing: -0.3 },
    statLabel:      { marginTop: 2, fontSize: 10, fontFamily: "PlusJakartaSans_500Medium", color: c.textFaint, textTransform: "uppercase", letterSpacing: 0.5 },
  });
}

// ─── Today's Focus hero card ──────────────────────────────────────────────────

function TodayFocusCard({
  moonTag, headline, insight, action, dailyMsg, onPress,
}: {
  moonTag: string; headline: string; insight: string;
  action: string; dailyMsg: string | null; onPress: () => void;
}) {
  const c = useColors();
  const s = useMemo(() => createFocusStyles(c), [c]);
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={s.focusCard}>
      {/* Tag row */}
      <View style={s.focusTagRow}>
        <View style={s.focusTag}>
          <Text style={s.focusTagText}>{moonTag}</Text>
        </View>
        <View style={s.liveRow}>
          <View style={s.liveDot} />
          <Text style={s.liveText}>Today</Text>
        </View>
      </View>

      {/* Headline */}
      <Text style={s.focusHeadline}>{headline}</Text>

      {/* Insight */}
      <Text style={s.focusInsight} numberOfLines={3}>{insight}</Text>

      {/* Divider + action */}
      <View style={s.focusDivider} />
      <View style={s.focusFooter}>
        <Text style={s.focusSunIcon}>☀</Text>
        <Text style={s.focusAction} numberOfLines={2}>{dailyMsg ?? action}</Text>
        <View style={s.focusArrow}>
          <Feather name="chevron-right" size={14} color="#4A3DE8" />
        </View>
      </View>
    </TouchableOpacity>
  );
}

function createFocusStyles(c: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    focusCard:    { backgroundColor: c.card, borderRadius: 16, borderWidth: 1, borderColor: c.border, padding: 18, gap: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 3 },
    focusTagRow:  { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    focusTag:     { backgroundColor: c.primaryLight, borderWidth: 1, borderColor: c.primaryBorder, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
    focusTagText: { fontSize: 11, fontFamily: "PlusJakartaSans_700Bold", color: "#4A3DE8" },
    liveRow:      { flexDirection: "row", alignItems: "center", gap: 5 },
    liveDot:      { width: 6, height: 6, borderRadius: 3, backgroundColor: "#10B981" },
    liveText:     { fontSize: 11, fontFamily: "PlusJakartaSans_600SemiBold", color: "#10B981" },
    focusHeadline:{ fontSize: 20, fontFamily: "PlusJakartaSans_800ExtraBold", color: c.text, lineHeight: 27, letterSpacing: -0.3 },
    focusInsight: { fontSize: 14, fontFamily: "PlusJakartaSans_400Regular", color: c.textBody, lineHeight: 22 },
    focusDivider: { height: 1, backgroundColor: c.borderLight },
    focusFooter:  { flexDirection: "row", alignItems: "flex-start", gap: 8 },
    focusSunIcon: { fontSize: 14, color: "#F59E0B", marginTop: 1 },
    focusAction:  { flex: 1, fontSize: 13, fontFamily: "PlusJakartaSans_600SemiBold", color: "#D97706", lineHeight: 19 },
    focusArrow:   { width: 26, height: 26, borderRadius: 8, backgroundColor: c.primaryLight, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  });
}

// ─── Right Now card ───────────────────────────────────────────────────────────

function RightNowCard({
  userName, partnerName, userMoment, partnerSignal,
}: {
  userName: string; partnerName: string;
  userMoment: string; partnerSignal: string;
}) {
  const c = useColors();
  const s = useMemo(() => createRightNowStyles(c), [c]);
  return (
    <View style={s.rightNowCard}>
      <View style={s.rightNowHeader}>
        <View style={s.rightNowPip} />
        <Text style={s.rightNowTitle}>Right Now Between You</Text>
      </View>
      <View style={s.rightNowRow}>
        <View style={s.rightNowBlock}>
          <Text style={s.rightNowName}>{userName}</Text>
          <Text style={s.rightNowBody}>{userMoment}</Text>
        </View>
        <View style={s.rightNowDivider} />
        <View style={s.rightNowBlock}>
          <Text style={s.rightNowName}>{partnerName}</Text>
          <Text style={s.rightNowBody}>{partnerSignal}</Text>
        </View>
      </View>
    </View>
  );
}

function createRightNowStyles(c: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    rightNowCard:   { backgroundColor: c.card, borderRadius: 16, borderWidth: 1, borderColor: c.border, padding: 16, gap: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
    rightNowHeader: { flexDirection: "row", alignItems: "center", gap: 7 },
    rightNowPip:    { width: 6, height: 6, borderRadius: 3, backgroundColor: "#4A3DE8" },
    rightNowTitle:  { fontSize: 11, fontFamily: "PlusJakartaSans_700Bold", color: "#4A3DE8", textTransform: "uppercase", letterSpacing: 0.8 },
    rightNowRow:    { flexDirection: "row", gap: 14 },
    rightNowBlock:  { flex: 1, gap: 4 },
    rightNowName:   { fontSize: 11, fontFamily: "PlusJakartaSans_700Bold", color: c.textFaint, textTransform: "uppercase", letterSpacing: 0.6 },
    rightNowBody:   { fontSize: 13, fontFamily: "PlusJakartaSans_400Regular", color: c.textBody, lineHeight: 19 },
    rightNowDivider:{ width: 1, backgroundColor: c.borderLight },
  });
}

// ─── Quick access grid ────────────────────────────────────────────────────────

type NavItem = {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  sublabel: string;
  color: string;
  bg: string;
  route: string;
};

function QuickAccessGrid({
  compatPct, patternCount, onPress,
}: {
  compatPct: number; patternCount: number; onPress: (route: string) => void;
}) {
  const c = useColors();
  const s = useMemo(() => createGridStyles(c), [c]);

  const items: NavItem[] = [
    {
      icon:     "heart",
      label:    "Us",
      sublabel: `${compatPct}% compatibility`,
      color:    "#4A3DE8",
      bg:       c.primaryLight,
      route:    "/(tabs)/compatibility",
    },
    {
      icon:     "layers",
      label:    "Patterns",
      sublabel: `${patternCount} detected`,
      color:    "#F43F5E",
      bg:       c.roseLight,
      route:    "/(tabs)/patterns",
    },
    {
      icon:     "zap",
      label:    "Insights",
      sublabel: "10 things about you two",
      color:    "#F59E0B",
      bg:       c.goldLight,
      route:    "/(tabs)/features",
    },
    {
      icon:     "message-circle",
      label:    "Ask",
      sublabel: "Oracle guidance",
      color:    "#10B981",
      bg:       c.emeraldLight,
      route:    "/(tabs)/guidance",
    },
    {
      icon:     "activity",
      label:    "Energy",
      sublabel: "Today's metrics",
      color:    "#8B5CF6",
      bg:       c.violetLight,
      route:    "/energy-detail",
    },
    {
      icon:     "user",
      label:    "Your Chart",
      sublabel: "Moon & nakshatra",
      color:    "#64748B",
      bg:       c.borderLight,
      route:    "profile-detail",
    },
  ];

  // render as 2-column grid
  const rows: NavItem[][] = [];
  for (let i = 0; i < items.length; i += 2) {
    rows.push(items.slice(i, i + 2));
  }

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

// ─── Today's Luck row ────────────────────────────────────────────────────────

function LuckyRow({ features, onPress }: { features: LuckyFeatures; onPress: () => void }) {
  const c = useColors();
  const s = useMemo(() => createLuckyStyles(c), [c]);
  return (
    <View style={s.luckyRow}>
      {/* Lucky Number card */}
      <TouchableOpacity onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onPress(); }} activeOpacity={0.82} style={s.luckyCard}>
        <Text style={s.luckyCardLabel}>TODAY'S NUMBER</Text>
        <Text style={s.luckyNumber}>{features.number}</Text>
        <Text style={s.luckyArchetype}>{features.archetype}</Text>
        <Text style={s.luckyEnergy} numberOfLines={1}>{features.energy}</Text>
        <View style={s.luckyTapRow}>
          <Text style={s.luckyTap}>Reveal meaning</Text>
          <Feather name="arrow-right" size={11} color="#4A3DE8" />
        </View>
      </TouchableOpacity>

      {/* Lucky Color card */}
      <TouchableOpacity onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onPress(); }} activeOpacity={0.82} style={s.luckyCard}>
        <Text style={s.luckyCardLabel}>TODAY'S COLOR</Text>
        <LinearGradient
          colors={features.color.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={s.colorSwatch}
        />
        <Text style={s.luckyArchetype}>{features.color.name}</Text>
        <Text style={s.luckyEnergy} numberOfLines={1}>♄ {features.planet}</Text>
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
    luckyNumber:    { fontSize: 52, fontFamily: "PlusJakartaSans_800ExtraBold", color: "#4A3DE8", lineHeight: 58, letterSpacing: -1 },
    luckyArchetype: { fontSize: 14, fontFamily: "PlusJakartaSans_700Bold", color: c.text },
    luckyEnergy:    { fontSize: 11, fontFamily: "PlusJakartaSans_400Regular", color: c.textFaint },
    luckyTapRow:    { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 },
    luckyTap:       { fontSize: 11, fontFamily: "PlusJakartaSans_700Bold", color: "#4A3DE8" },
    colorSwatch:    { height: 44, borderRadius: 10, marginBottom: 2 },
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

  if (!user || !partner || !reading) return null;

  const hero      = getPersonalizedHero(user.name, partner.name, reading, partner.relationshipType);
  const rightNow  = getTodayBetweenYou(reading, partner.relationshipType, user.name, partner.name);
  const energy    = getDailyEnergyPersonalized(reading, reading.user.dasha.current);

  const uRashi       = RASHIS[reading.user.moonRashi];
  const luckyFeatures = getLuckyFeatures(user.birthDate, uRashi.element);

  const compatPct    = Math.round((reading.guna.total / 36) * 100);
  const patternCount = (challenges ?? []).length;
  const dashaShort   = reading.user.dasha.current.split(" ")[0];
  const dailyMsg     = dbContent?.message?.body ?? null;

  const hour     = new Date().getHours();
  const greeting = hour < 12 ? "Good morning," : hour < 18 ? "Good afternoon," : "Good evening,";

  const haptic = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

  const navigate = (route: string) => {
    router.push(route as any);
  };

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

        {/* ── Stats strip ── */}
        <StatsStrip
          compatPct={compatPct}
          patternCount={patternCount}
          dasha={dashaShort}
        />

        {/* ── Today's Focus ── */}
        <View style={s.section}>
          <Text style={s.sectionLabel}>TODAY'S FOCUS</Text>
          <TodayFocusCard
            moonTag={hero.moonTag}
            headline={hero.headline}
            insight={hero.insight}
            action={hero.action}
            dailyMsg={dailyMsg}
            onPress={() => {
              haptic();
              router.push({
                pathname: "/reading-detail",
                params: { headline: hero.headline, insight: hero.insight, action: hero.action, moonTag: hero.moonTag },
              });
            }}
          />
        </View>

        {/* ── Right Now ── */}
        <RightNowCard
          userName={user.name}
          partnerName={partner.name}
          userMoment={rightNow.userMoment}
          partnerSignal={rightNow.partnerSignal}
        />

        {/* ── Today's Luck ── */}
        <View style={s.section}>
          <Text style={s.sectionLabel}>TODAY'S LUCK</Text>
          <LuckyRow features={luckyFeatures} onPress={() => { haptic(); navigate("/lucky-detail"); }} />
        </View>

        {/* ── Explore ── */}
        <View style={s.section}>
          <Text style={s.sectionLabel}>EXPLORE</Text>
          <QuickAccessGrid
            compatPct={compatPct}
            patternCount={patternCount}
            onPress={navigate}
          />
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
    header:        { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
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
