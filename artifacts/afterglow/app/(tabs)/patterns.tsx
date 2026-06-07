import { useApp } from "@/context/AppContext";
import { getLocalStates } from "@/utils/dbContent";
import type { Challenge } from "@/utils/challenges";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
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

const SEVERITY_COLOR: Record<string, string> = {
  mild:     "#10B981",
  moderate: "#F59E0B",
  severe:   "#F43F5E",
};

const SEVERITY_BG: Record<string, string> = {
  mild:     "#ECFDF5",
  moderate: "#FFFBEB",
  severe:   "#FFF1F2",
};

const SEVERITY_DISPLAY: Record<string, string> = {
  mild:     "low key",
  moderate: "ongoing",
  severe:   "front and center",
};

const SEVERITY_MEANING: Record<string, string> = {
  mild:     "Good to be aware of",
  moderate: "This one's showing up a lot",
  severe:   "The main thing between you",
};

const ALL_CATEGORIES = "All";
const JOURNEY_TABS = ["All", "My Journey", "Working On", "Resolved"] as const;

const JOURNEY_STATE_META: Record<string, { icon: string; color: string; bg: string; label: string }> = {
  resonates:  { icon: "heart",        color: "#F43F5E", bg: "#FFF1F2", label: "Resonates" },
  working_on: { icon: "activity",     color: "#F59E0B", bg: "#FFFBEB", label: "Working on" },
  resolved:   { icon: "check-circle", color: "#10B981", bg: "#ECFDF5", label: "Resolved" },
};

function ChallengeCard({
  challenge, journeyState, onPress,
}: {
  challenge: Challenge; journeyState: string | null; onPress: () => void;
}) {
  const color   = SEVERITY_COLOR[challenge.severity] ?? "#5B4CE8";
  const colorBg = SEVERITY_BG[challenge.severity] ?? "#EEF2FF";
  const js      = journeyState ? JOURNEY_STATE_META[journeyState] : null;

  return (
    <TouchableOpacity onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onPress(); }} activeOpacity={0.8}>
      <View style={styles.card}>
        <View style={[styles.cardAccentBar, { backgroundColor: color }]} />
        <View style={styles.cardContent}>
          <View style={styles.cardTop}>
            <View style={[styles.severityPill, { backgroundColor: colorBg, borderColor: color + "44" }]}>
              <View style={[styles.severityDot, { backgroundColor: color }]} />
              <Text style={[styles.severityLabel, { color }]}>{SEVERITY_DISPLAY[challenge.severity] ?? challenge.severity}</Text>
            </View>
            <Text style={styles.severityMeaning}>{SEVERITY_MEANING[challenge.severity] ?? ""}</Text>
            <View style={styles.categoryPill}>
              <Text style={styles.categoryText}>{challenge.category}</Text>
            </View>
            {js && (
              <View style={[styles.journeyBadge, { backgroundColor: js.bg, borderColor: js.color + "44" }]}>
                <Feather name={js.icon as any} size={10} color={js.color} />
                <Text style={[styles.journeyBadgeText, { color: js.color }]}>{js.label}</Text>
              </View>
            )}
          </View>
          <Text style={styles.cardTitle}>{challenge.title}</Text>
          <Text style={styles.cardDesc} numberOfLines={2}>{challenge.description}</Text>
          <View style={styles.cardFooter}>
            <Text style={styles.solutionsHint}>{challenge.solutions?.length ?? 0} remedies to try</Text>
            <Feather name="chevron-right" size={16} color="#D1D5DB" />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function PatternsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { challenges, challengesLoading, loadChallenges } = useApp();
  const [activeCategory,   setActiveCategory]   = useState(ALL_CATEGORIES);
  const [activeJourneyTab, setActiveJourneyTab] = useState<typeof JOURNEY_TABS[number]>("All");
  const [journeyStates,    setJourneyStates]    = useState<Record<string, string>>({});
  const [refreshing,       setRefreshing]       = useState(false);

  const refreshStates = useCallback(() => {
    getLocalStates().then(setJourneyStates);
  }, []);

  useEffect(() => { refreshStates(); }, []);
  useFocusEffect(useCallback(() => { refreshStates(); }, [refreshStates]));

  const categories = useMemo(() => {
    const cats = Array.from(new Set(challenges.map((c) => c.category)));
    return [ALL_CATEGORIES, ...cats];
  }, [challenges]);

  const filtered = useMemo(() => {
    let base = activeCategory === ALL_CATEGORIES ? challenges : challenges.filter((c) => c.category === activeCategory);
    if (activeJourneyTab === "My Journey")  base = base.filter((c) => !!journeyStates[c.id]);
    else if (activeJourneyTab === "Working On") base = base.filter((c) => journeyStates[c.id] === "working_on");
    else if (activeJourneyTab === "Resolved")   base = base.filter((c) => journeyStates[c.id] === "resolved");
    return base;
  }, [challenges, activeCategory, activeJourneyTab, journeyStates]);

  const grouped = useMemo(() => {
    const severe   = filtered.filter((c) => c.severity === "severe");
    const moderate = filtered.filter((c) => c.severity === "moderate");
    const mild     = filtered.filter((c) => c.severity === "mild");
    return [...severe, ...moderate, ...mild];
  }, [filtered]);

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

  useEffect(() => {
    if (challenges.length === 0) loadChallenges();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "#F4F5F7" }}>
      <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === "web" ? 67 : 16) }]}>
        <Text style={styles.screenTitle}>What's going on</Text>
        <Text style={styles.screenSub}>
          {challenges.length > 0
            ? `${challenges.length} patterns in your connection — with ways through each one`
            : "Your patterns and what to do about them"}
        </Text>
      </View>

      {challengesLoading && challenges.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color="#5B4CE8" size="large" />
          <Text style={styles.loadingText}>Identifying your patterns…</Text>
        </View>
      ) : challenges.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <Feather name="layers" size={28} color="#5B4CE8" />
          </View>
          <Text style={styles.emptyTitle}>No patterns loaded yet</Text>
          <Text style={styles.emptySub}>Tap below to load your personalised patterns and remedies</Text>
          <TouchableOpacity
            style={styles.fetchBtn}
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); loadChallenges(); }}
          >
            <LinearGradient colors={["#5B4CE8", "#8B5CF6"]} style={styles.fetchBtnGradient}>
              <Text style={styles.fetchBtnText}>Load my patterns</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={Platform.OS === "web" ? { maxWidth: 640, alignSelf: "center", width: "100%" } : undefined}
          contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 100 }]}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#5B4CE8" />}
        >
          {/* Journey progress banner */}
          {journeyCount.total > 0 && (
            <View style={styles.journeyBanner}>
              <View style={styles.journeyBannerRow}>
                <Feather name="trending-up" size={14} color="#5B4CE8" />
                <Text style={styles.journeyBannerTitle}>Your Healing Journey</Text>
              </View>
              <View style={styles.journeyStats}>
                <View style={styles.journeyStatItem}>
                  <Text style={[styles.journeyStatNum, { color: "#F43F5E" }]}>{journeyCount.total}</Text>
                  <Text style={styles.journeyStatLabel}>acknowledged</Text>
                </View>
                <View style={styles.journeyDivider} />
                <View style={styles.journeyStatItem}>
                  <Text style={[styles.journeyStatNum, { color: "#F59E0B" }]}>{journeyCount.working_on}</Text>
                  <Text style={styles.journeyStatLabel}>working on</Text>
                </View>
                <View style={styles.journeyDivider} />
                <View style={styles.journeyStatItem}>
                  <Text style={[styles.journeyStatNum, { color: "#10B981" }]}>{journeyCount.resolved}</Text>
                  <Text style={styles.journeyStatLabel}>resolved</Text>
                </View>
              </View>
            </View>
          )}

          {/* Journey filter tabs */}
          <ScrollView
            horizontal showsHorizontalScrollIndicator={false}
            style={styles.chips}
            contentContainerStyle={{ gap: 8, paddingHorizontal: 20 }}
          >
            {JOURNEY_TABS.map((tab) => (
              <Pressable
                key={tab}
                onPress={() => { Haptics.selectionAsync(); setActiveJourneyTab(tab); }}
                style={[styles.chip, activeJourneyTab === tab && styles.chipActive]}
              >
                <Text style={[styles.chipText, activeJourneyTab === tab && styles.chipTextActive]}>{tab}</Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* Category filter */}
          {activeJourneyTab === "All" && (
            <ScrollView
              horizontal showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8, paddingHorizontal: 20 }}
            >
              {categories.map((cat) => (
                <Pressable
                  key={cat}
                  onPress={() => { Haptics.selectionAsync(); setActiveCategory(cat); }}
                  style={[styles.chip, styles.chipSmall, activeCategory === cat && styles.chipActive]}
                >
                  <Text style={[styles.chipText, activeCategory === cat && styles.chipTextActive]}>{cat}</Text>
                </Pressable>
              ))}
            </ScrollView>
          )}

          {/* Severity stats */}
          <View style={styles.statsRow}>
            {(["severe", "moderate", "mild"] as const).map((sev) => {
              const count = filtered.filter((c) => c.severity === sev).length;
              return (
                <View key={sev} style={[styles.statItem, { backgroundColor: SEVERITY_BG[sev] }]}>
                  <Text style={[styles.statCount, { color: SEVERITY_COLOR[sev] }]}>{count}</Text>
                  <Text style={[styles.statLabel, { color: SEVERITY_COLOR[sev] }]}>{sev}</Text>
                </View>
              );
            })}
          </View>

          {/* Empty journey state */}
          {grouped.length === 0 && activeJourneyTab !== "All" && (
            <View style={styles.emptyJourney}>
              <Text style={styles.emptyJourneyIcon}>{activeJourneyTab === "Resolved" ? "✦" : "◎"}</Text>
              <Text style={styles.emptyJourneyTitle}>
                {activeJourneyTab === "Resolved" ? "Nothing resolved yet" : "Nothing here yet"}
              </Text>
              <Text style={styles.emptyJourneySub}>
                {activeJourneyTab === "Resolved"
                  ? "Mark patterns as resolved from their detail screen."
                  : "Open a pattern and tap 'This is me' to start your journey."}
              </Text>
            </View>
          )}

          {/* Pattern cards */}
          {grouped.map((challenge) => (
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

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20, paddingBottom: 16, gap: 4,
    borderBottomWidth: 1, borderBottomColor: "#E5E7EB", backgroundColor: "#F4F5F7",
  },
  screenTitle: { fontSize: 30, fontFamily: "Nunito_700Bold", color: "#111827" },
  screenSub:   { fontSize: 13, fontFamily: "Nunito_400Regular", color: "#6B7280" },

  loadingContainer: { flex: 1, alignItems: "center", justifyContent: "center", gap: 16 },
  loadingText:      { fontSize: 15, fontFamily: "Nunito_400Regular", color: "#6B7280" },
  emptyContainer:   { flex: 1, alignItems: "center", justifyContent: "center", gap: 14, paddingHorizontal: 40 },
  emptyIconCircle:  { width: 72, height: 72, borderRadius: 36, backgroundColor: "#EEF2FF", alignItems: "center", justifyContent: "center" },
  emptyTitle:       { fontSize: 20, fontFamily: "Nunito_700Bold", color: "#111827" },
  emptySub:         { fontSize: 14, fontFamily: "Nunito_400Regular", color: "#6B7280", textAlign: "center", lineHeight: 22 },
  fetchBtn:         { marginTop: 10, borderRadius: 26, overflow: "hidden" },
  fetchBtnGradient: { paddingHorizontal: 32, paddingVertical: 16 },
  fetchBtnText:     { fontSize: 16, fontFamily: "Nunito_700Bold", color: "#fff" },

  scroll: { paddingTop: 16, gap: 12 },

  journeyBanner:    { marginHorizontal: 20, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#C7D2FE",
                      borderRadius: 18, padding: 16, gap: 12,
                      shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 1 },
  journeyBannerRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  journeyBannerTitle:{ fontSize: 14, fontFamily: "Nunito_600SemiBold", color: "#5B4CE8" },
  journeyStats:     { flexDirection: "row", alignItems: "center" },
  journeyStatItem:  { flex: 1, alignItems: "center", gap: 3 },
  journeyStatNum:   { fontSize: 22, fontFamily: "Nunito_700Bold" },
  journeyStatLabel: { fontSize: 11, fontFamily: "Nunito_500Medium", color: "#9CA3AF", textTransform: "capitalize" },
  journeyDivider:   { width: 1, height: 30, backgroundColor: "#E5E7EB" },

  chips:        { marginBottom: 4 },
  chip:         { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 22, paddingHorizontal: 16, paddingVertical: 8 },
  chipActive:   { backgroundColor: "#EEF2FF", borderColor: "#C7D2FE" },
  chipSmall:    { paddingHorizontal: 11, paddingVertical: 6 },
  chipText:     { fontSize: 13, fontFamily: "Nunito_500Medium", color: "#6B7280" },
  chipTextActive:{ color: "#5B4CE8", fontFamily: "Nunito_600SemiBold" },

  statsRow:  { flexDirection: "row", gap: 10, paddingHorizontal: 20, marginBottom: 2 },
  statItem:  { flex: 1, alignItems: "center", gap: 4, borderRadius: 14, paddingVertical: 12 },
  statCount: { fontSize: 24, fontFamily: "Nunito_700Bold" },
  statLabel: { fontSize: 11, fontFamily: "Nunito_600SemiBold", textTransform: "capitalize" },

  card:           { backgroundColor: "#FFFFFF", borderRadius: 20, borderWidth: 1, borderColor: "#E5E7EB",
                    flexDirection: "row", overflow: "hidden", marginHorizontal: 20,
                    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 12, elevation: 2 },
  cardAccentBar:  { width: 4 },
  cardContent:    { flex: 1, padding: 18, gap: 10 },
  cardTop:        { flexDirection: "row", alignItems: "center", gap: 7, flexWrap: "wrap" },
  severityPill:   { flexDirection: "row", alignItems: "center", gap: 5, borderWidth: 1, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 },
  severityDot:    { width: 6, height: 6, borderRadius: 3 },
  severityLabel:  { fontSize: 11, fontFamily: "Nunito_600SemiBold", textTransform: "capitalize", letterSpacing: 0.2 },
  severityMeaning:{ fontSize: 11, fontFamily: "Nunito_400Regular", color: "#9CA3AF", flex: 1 },
  categoryPill:   { marginLeft: "auto", backgroundColor: "#EEF2FF", borderWidth: 1, borderColor: "#C7D2FE", borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 },
  categoryText:   { fontSize: 11, fontFamily: "Nunito_500Medium", color: "#5B4CE8" },
  journeyBadge:   { flexDirection: "row", alignItems: "center", gap: 4, borderWidth: 1, borderRadius: 11, paddingHorizontal: 8, paddingVertical: 3 },
  journeyBadgeText:{ fontSize: 10, fontFamily: "Nunito_600SemiBold" },
  cardTitle:      { fontSize: 17, fontFamily: "Nunito_700Bold", color: "#111827", lineHeight: 24 },
  cardDesc:       { fontSize: 14, fontFamily: "Nunito_400Regular", color: "#6B7280", lineHeight: 21 },
  cardFooter:     { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  solutionsHint:  { fontSize: 13, fontFamily: "Nunito_500Medium", color: "#9CA3AF" },

  emptyJourney:      { alignItems: "center", justifyContent: "center", padding: 40, gap: 12 },
  emptyJourneyIcon:  { fontSize: 36, color: "#D1D5DB" },
  emptyJourneyTitle: { fontSize: 18, fontFamily: "Nunito_700Bold", color: "#6B7280" },
  emptyJourneySub:   { fontSize: 14, fontFamily: "Nunito_400Regular", color: "#9CA3AF", textAlign: "center", lineHeight: 21 },
});
