import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import { getLocalStates } from "@/utils/dbContent";
import type { Challenge } from "@/utils/challenges";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SEV_COLOR: Record<string, string> = {
  mild:     "#10B981",
  moderate: "#F59E0B",
  severe:   "#F43F5E",
};
const SEV_BG: Record<string, string> = {
  mild:     "#ECFDF5",
  moderate: "#FFFBEB",
  severe:   "#FFF1F2",
};
const SEV_LABEL: Record<string, string> = {
  mild:     "Worth knowing",
  moderate: "Actively present",
  severe:   "At the core",
};
const SEV_ICON: Record<string, string> = {
  mild:     "🌱",
  moderate: "⚡",
  severe:   "🔥",
};

const JOURNEY_TABS = ["All", "My Journey", "Working On", "Resolved"] as const;
const JOURNEY_META: Record<string, { icon: keyof typeof Feather.glyphMap; color: string; bg: string; label: string }> = {
  resonates:  { icon: "heart",        color: "#F43F5E", bg: "#FFF1F2", label: "Resonates" },
  working_on: { icon: "activity",     color: "#F59E0B", bg: "#FFFBEB", label: "Working on" },
  resolved:   { icon: "check-circle", color: "#10B981", bg: "#ECFDF5", label: "Resolved" },
};

// ─── Challenge card ───────────────────────────────────────────────────────────

function ChallengeCard({ challenge, journeyState, onPress }: {
  challenge: Challenge; journeyState: string | null; onPress: () => void;
}) {
  const c = useColors();
  const cStylesMemo = useMemo(() => createChallengeCardStyles(c), [c]);
  const color   = SEV_COLOR[challenge.severity] ?? "#4A3DE8";
  const colorBg = SEV_BG[challenge.severity]   ?? c.primaryLight;
  const icon    = SEV_ICON[challenge.severity]  ?? "◦";
  const js      = journeyState ? JOURNEY_META[journeyState] : null;

  return (
    <TouchableOpacity
      onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onPress(); }}
      activeOpacity={0.8}
      style={cStylesMemo.card}
    >
      <View style={cStylesMemo.row}>
        <View style={[cStylesMemo.iconBox, { backgroundColor: colorBg }]}>
          <Text style={{ fontSize: 18 }}>{icon}</Text>
        </View>
        <View style={cStylesMemo.mid}>
          <Text style={cStylesMemo.title} numberOfLines={1}>{challenge.title}</Text>
          <View style={cStylesMemo.metaRow}>
            <View style={cStylesMemo.categoryPill}>
              <Text style={cStylesMemo.categoryText}>{challenge.category}</Text>
            </View>
            {js && (
              <View style={[cStylesMemo.journeyBadge, { backgroundColor: js.bg, borderColor: js.color + "44" }]}>
                <Feather name={js.icon} size={9} color={js.color} />
                <Text style={[cStylesMemo.journeyBadgeText, { color: js.color }]}>{js.label}</Text>
              </View>
            )}
            <Text style={cStylesMemo.remediesHint}>{challenge.solutions?.length ?? 0} steps to try</Text>
          </View>
        </View>
        <View style={[cStylesMemo.sevBadge, { backgroundColor: colorBg, borderColor: color + "44" }]}>
          <Text style={[cStylesMemo.sevBadgeText, { color }]}>{SEV_LABEL[challenge.severity]}</Text>
        </View>
        <Feather name="chevron-right" size={15} color={c.borderLight} />
      </View>
    </TouchableOpacity>
  );
}

function createChallengeCardStyles(c: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    card:         { backgroundColor: c.card, borderRadius: 14, borderWidth: 1, borderColor: c.border, paddingHorizontal: 14, paddingVertical: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
    row:          { flexDirection: "row", alignItems: "center", gap: 12 },
    iconBox:      { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center", flexShrink: 0 },
    mid:          { flex: 1, gap: 5 },
    title:        { fontSize: 14, fontFamily: "PlusJakartaSans_600SemiBold", color: c.text, lineHeight: 20 },
    metaRow:      { flexDirection: "row", alignItems: "center", gap: 6 },
    categoryPill: { backgroundColor: c.primaryLight, borderWidth: 1, borderColor: c.primaryBorder, borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3 },
    categoryText: { fontSize: 10, fontFamily: "PlusJakartaSans_600SemiBold", color: "#4A3DE8" },
    journeyBadge: { flexDirection: "row", alignItems: "center", gap: 3, borderWidth: 1, borderRadius: 20, paddingHorizontal: 7, paddingVertical: 3 },
    journeyBadgeText: { fontSize: 9, fontFamily: "PlusJakartaSans_600SemiBold" },
    remediesHint: { fontSize: 10, fontFamily: "PlusJakartaSans_400Regular", color: c.textFaint },
    sevBadge:     { paddingHorizontal: 9, paddingVertical: 4, borderRadius: 20, borderWidth: 1, flexShrink: 0 },
    sevBadgeText: { fontSize: 10, fontFamily: "PlusJakartaSans_700Bold" },
  });
}

// ─── Patterns screen ──────────────────────────────────────────────────────────

export default function PatternsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { challenges, challengesLoading, loadChallenges } = useApp();
  const c = useColors();
  const styles = useMemo(() => createStyles(c), [c]);
  const [activeJourneyTab, setActiveJourneyTab] = useState<typeof JOURNEY_TABS[number]>("All");
  const [journeyStates,    setJourneyStates]    = useState<Record<string, string>>({});
  const [refreshing,       setRefreshing]       = useState(false);

  const refreshStates = useCallback(() => { getLocalStates().then(setJourneyStates); }, []);
  useEffect(() => { refreshStates(); }, []);
  useFocusEffect(useCallback(() => { refreshStates(); }, [refreshStates]));

  const filtered = useMemo(() => {
    let base = [...challenges];
    if (activeJourneyTab === "My Journey")  base = base.filter((c) => !!journeyStates[c.id]);
    else if (activeJourneyTab === "Working On") base = base.filter((c) => journeyStates[c.id] === "working_on");
    else if (activeJourneyTab === "Resolved")   base = base.filter((c) => journeyStates[c.id] === "resolved");
    const severe   = base.filter((c) => c.severity === "severe");
    const moderate = base.filter((c) => c.severity === "moderate");
    const mild     = base.filter((c) => c.severity === "mild");
    return [...severe, ...moderate, ...mild];
  }, [challenges, activeJourneyTab, journeyStates]);

  const journeyCount = useMemo(() => ({
    total:      Object.keys(journeyStates).length,
    working_on: Object.values(journeyStates).filter((s) => s === "working_on").length,
    resolved:   Object.values(journeyStates).filter((s) => s === "resolved").length,
  }), [journeyStates]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadChallenges();
    await refreshStates();
    setRefreshing(false);
  };

  useEffect(() => { if (challenges.length === 0) loadChallenges(); }, []);

  return (
    <View style={styles.root}>
      {/* Fixed header */}
      <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === "web" ? 67 : 18) }]}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.screenTitle}>Your Patterns</Text>
            <Text style={styles.screenSub}>
              {challenges.length > 0
                ? `${challenges.length} patterns identified, each with steps you can try`
                : "What keeps repeating between you two"}
            </Text>
          </View>
          {challenges.length > 0 && (
            <View style={styles.totalBadge}>
              <Text style={styles.totalBadgeNum}>{challenges.length}</Text>
              <Text style={styles.totalBadgeLabel}>total</Text>
            </View>
          )}
        </View>
      </View>

      {challengesLoading && challenges.length === 0 ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator color="#4A3DE8" size="large" />
          <Text style={styles.loadingText}>Reading your birth charts and finding your patterns...</Text>
        </View>
      ) : challenges.length === 0 ? (
        <View style={styles.emptyBox}>
          <View style={styles.emptyIcon}>
            <Feather name="layers" size={28} color="#4A3DE8" />
          </View>
          <Text style={styles.emptyTitle}>See what keeps repeating</Text>
          <Text style={styles.emptySub}>Your personalised patterns come from your birth charts. Each one comes with practical steps to try, not just descriptions of the problem.</Text>
          <TouchableOpacity
            style={styles.loadBtn}
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); loadChallenges(); }}
            activeOpacity={0.85}
          >
            <Text style={styles.loadBtnText}>Show my patterns</Text>
            <View style={styles.loadBtnArrow}>
              <Feather name="arrow-right" size={15} color={c.ctaForeground} />
            </View>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={Platform.OS === "web" ? styles.webScroll : undefined}
          contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 100 }]}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4A3DE8" />}
        >

          {/* Journey stats strip */}
          {journeyCount.total > 0 && (
            <View style={styles.journeyStrip}>
              <View style={styles.journeyStripItem}>
                <Text style={[styles.journeyStripNum, { color: "#F43F5E" }]}>{journeyCount.total}</Text>
                <Text style={styles.journeyStripLabel}>Acknowledged</Text>
              </View>
              <View style={styles.journeyStripDiv} />
              <View style={styles.journeyStripItem}>
                <Text style={[styles.journeyStripNum, { color: "#F59E0B" }]}>{journeyCount.working_on}</Text>
                <Text style={styles.journeyStripLabel}>Working On</Text>
              </View>
              <View style={styles.journeyStripDiv} />
              <View style={styles.journeyStripItem}>
                <Text style={[styles.journeyStripNum, { color: "#10B981" }]}>{journeyCount.resolved}</Text>
                <Text style={styles.journeyStripLabel}>Resolved</Text>
              </View>
            </View>
          )}

          {/* Journey tabs */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsRow}
          >
            {JOURNEY_TABS.map((tab) => (
              <Pressable
                key={tab}
                onPress={() => { Haptics.selectionAsync(); setActiveJourneyTab(tab); }}
                style={[styles.tab, activeJourneyTab === tab && styles.tabActive]}
              >
                <Text style={[styles.tabText, activeJourneyTab === tab && styles.tabTextActive]}>{tab}</Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* Section label */}
          <Text style={styles.sectionLabel}>
            {activeJourneyTab === "All" ? "ALL PATTERNS" : activeJourneyTab.toUpperCase()}
            {"  "}{filtered.length}
          </Text>

          {/* Empty journey state */}
          {filtered.length === 0 && activeJourneyTab !== "All" && (
            <View style={styles.emptyJourneyBox}>
              <Text style={styles.emptyJourneyTitle}>
                {activeJourneyTab === "Resolved" ? "Nothing resolved yet" : "Nothing here yet"}
              </Text>
              <Text style={styles.emptyJourneySub}>
                {activeJourneyTab === "Resolved"
                  ? "When you work through a pattern and mark it resolved, it will show up here."
                  : "Open any pattern below and tap Yes, this is me to start tracking it."}
              </Text>
            </View>
          )}

          {/* Pattern cards */}
          {filtered.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              journeyState={journeyStates[challenge.id] ?? null}
              onPress={() => {
                refreshStates();
                router.push({ pathname: "/challenge-detail", params: { id: challenge.id, data: JSON.stringify(challenge) } });
              }}
            />
          ))}

        </ScrollView>
      )}
    </View>
  );
}

function createStyles(c: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    root:     { flex: 1, backgroundColor: c.background },
    webScroll:{ maxWidth: 640, alignSelf: "center", width: "100%" },

    header:    { paddingHorizontal: 18, paddingBottom: 14, backgroundColor: c.background, borderBottomWidth: 1, borderBottomColor: c.border },
    headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
    screenTitle:{ fontSize: 26, fontFamily: "PlusJakartaSans_800ExtraBold", color: c.text, letterSpacing: -0.4 },
    screenSub:  { fontSize: 13, fontFamily: "PlusJakartaSans_400Regular", color: c.textMuted, marginTop: 3 },
    totalBadge: { alignItems: "center", backgroundColor: c.card, borderRadius: 12, borderWidth: 1, borderColor: c.border, paddingHorizontal: 12, paddingVertical: 8 },
    totalBadgeNum:  { fontSize: 20, fontFamily: "PlusJakartaSans_800ExtraBold", color: c.text, lineHeight: 24 },
    totalBadgeLabel:{ fontSize: 10, fontFamily: "PlusJakartaSans_500Medium", color: c.textFaint, textTransform: "uppercase", letterSpacing: 0.5 },

    loadingBox: { flex: 1, alignItems: "center", justifyContent: "center", gap: 16 },
    loadingText:{ fontSize: 15, fontFamily: "PlusJakartaSans_400Regular", color: c.textMuted },

    emptyBox: { flex: 1, alignItems: "center", justifyContent: "center", gap: 14, paddingHorizontal: 40 },
    emptyIcon:{ width: 72, height: 72, borderRadius: 22, backgroundColor: c.primaryLight, alignItems: "center", justifyContent: "center" },
    emptyTitle:{ fontSize: 20, fontFamily: "PlusJakartaSans_700Bold", color: c.text },
    emptySub: { fontSize: 14, fontFamily: "PlusJakartaSans_400Regular", color: c.textMuted, textAlign: "center", lineHeight: 22 },
    loadBtn:  { flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: c.cta, borderRadius: 16, paddingVertical: 16, paddingLeft: 22, paddingRight: 8, marginTop: 8, width: 240 },
    loadBtnText:{ fontSize: 15, fontFamily: "PlusJakartaSans_700Bold", color: c.ctaForeground },
    loadBtnArrow:{ width: 36, height: 36, borderRadius: 10, backgroundColor: c.card, alignItems: "center", justifyContent: "center" },

    scroll: { paddingHorizontal: 18, paddingTop: 12, gap: 10 },

    journeyStrip:     { flexDirection: "row", backgroundColor: c.card, borderRadius: 16, borderWidth: 1, borderColor: c.border, overflow: "hidden", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
    journeyStripItem: { flex: 1, alignItems: "center", paddingVertical: 12 },
    journeyStripDiv:  { width: 1, backgroundColor: c.borderLight },
    journeyStripNum:  { fontSize: 20, fontFamily: "PlusJakartaSans_800ExtraBold", lineHeight: 26 },
    journeyStripLabel:{ fontSize: 10, fontFamily: "PlusJakartaSans_500Medium", color: c.textFaint, textTransform: "uppercase", letterSpacing: 0.5, marginTop: 1 },

    tabsRow:    { gap: 8, paddingVertical: 2, paddingHorizontal: 18 },
    tab:        { backgroundColor: c.card, borderWidth: 1, borderColor: c.border, borderRadius: 22, paddingHorizontal: 16, paddingVertical: 8 },
    tabActive:  { backgroundColor: c.cta, borderColor: c.cta },
    tabText:    { fontSize: 13, fontFamily: "PlusJakartaSans_500Medium", color: c.textMuted },
    tabTextActive:{ color: c.ctaForeground, fontFamily: "PlusJakartaSans_600SemiBold" },

    sectionLabel: { fontSize: 11, fontFamily: "PlusJakartaSans_700Bold", color: c.textFaint, letterSpacing: 1.2, marginTop: 2 },

    emptyJourneyBox:  { alignItems: "center", padding: 32, gap: 10 },
    emptyJourneyTitle:{ fontSize: 17, fontFamily: "PlusJakartaSans_700Bold", color: c.textMuted },
    emptyJourneySub:  { fontSize: 13, fontFamily: "PlusJakartaSans_400Regular", color: c.textFaint, textAlign: "center", lineHeight: 20 },
  });
}
