import { GlowCard } from "@/components/GlowCard";
import { useApp } from "@/context/AppContext";
import { getLocalStates } from "@/utils/dbContent";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
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
import type { Challenge } from "@/utils/challenges";

const SEVERITY_COLOR: Record<string, string> = {
  mild:     "#52C8B8",
  moderate: "#F5A623",
  severe:   "#E85C7A",
};

const SEVERITY_MEANING: Record<string, string> = {
  mild:     "Worth being aware of",
  moderate: "Actively affecting the dynamic",
  severe:   "The core tension in this connection",
};

const ALL_CATEGORIES = "All";
const JOURNEY_TABS = ["All", "My Journey", "Working On", "Resolved"] as const;

const JOURNEY_STATE_META: Record<string, { icon: string; color: string; label: string }> = {
  resonates:  { icon: "heart",        color: "#E85C7A", label: "Resonates" },
  working_on: { icon: "activity",     color: "#F5A623", label: "Working on" },
  resolved:   { icon: "check-circle", color: "#52C8B8", label: "Resolved" },
};

function ChallengeCard({
  challenge,
  journeyState,
  onPress,
}: {
  challenge: Challenge;
  journeyState: string | null;
  onPress: () => void;
}) {
  const color = SEVERITY_COLOR[challenge.severity] ?? "#B855E0";
  const js = journeyState ? JOURNEY_STATE_META[journeyState] : null;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <GlowCard style={styles.card} glowColor={js ? js.color + "18" : color + "22"}>
        <LinearGradient colors={["#1A1630", "#110F1E"]} style={styles.cardInner}>
          <View style={styles.cardTop}>
            <View style={[styles.severityPill, { backgroundColor: color + "14", borderColor: color + "33" }]}>
              <View style={[styles.severityDot, { backgroundColor: color }]} />
              <Text style={[styles.severityLabel, { color }]}>{challenge.severity}</Text>
            </View>
            <Text style={styles.severityMeaning}>{SEVERITY_MEANING[challenge.severity] ?? ""}</Text>
            <View style={styles.categoryPill}>
              <Text style={styles.categoryText}>{challenge.category}</Text>
            </View>
            {js && (
              <View style={[styles.journeyBadge, { backgroundColor: js.color + "14", borderColor: js.color + "33" }]}>
                <Feather name={js.icon as any} size={10} color={js.color} />
                <Text style={[styles.journeyBadgeText, { color: js.color }]}>{js.label}</Text>
              </View>
            )}
          </View>
          <Text style={styles.cardTitle}>{challenge.title}</Text>
          <Text style={styles.cardDesc} numberOfLines={2}>{challenge.description}</Text>
          <View style={styles.cardFooter}>
            <Text style={styles.solutionsHint}>
              {challenge.solutions?.length ?? 0} steps to try
            </Text>
            <Feather name="chevron-right" size={16} color="rgba(240,235,248,0.3)" />
          </View>
        </LinearGradient>
      </GlowCard>
    </TouchableOpacity>
  );
}

export default function ChallengesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { challenges, challengesLoading, loadChallenges } = useApp();
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORIES);
  const [activeJourneyTab, setActiveJourneyTab] = useState<typeof JOURNEY_TABS[number]>("All");
  const [journeyStates, setJourneyStates] = useState<Record<string, string>>({});
  const [refreshing, setRefreshing] = useState(false);

  // Load journey states from local storage
  useEffect(() => {
    getLocalStates().then(setJourneyStates);
  }, []);

  // Refresh journey states when screen is focused
  const refreshStates = () => getLocalStates().then(setJourneyStates);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(challenges.map((c) => c.category)));
    return [ALL_CATEGORIES, ...cats];
  }, [challenges]);

  const filtered = useMemo(() => {
    let base = activeCategory === ALL_CATEGORIES ? challenges : challenges.filter((c) => c.category === activeCategory);
    if (activeJourneyTab === "My Journey") base = base.filter((c) => !!journeyStates[c.id]);
    else if (activeJourneyTab === "Working On") base = base.filter((c) => journeyStates[c.id] === "working_on");
    else if (activeJourneyTab === "Resolved") base = base.filter((c) => journeyStates[c.id] === "resolved");
    return base;
  }, [challenges, activeCategory, activeJourneyTab, journeyStates]);

  const grouped = useMemo(() => {
    const severe   = filtered.filter((c) => c.severity === "severe");
    const moderate = filtered.filter((c) => c.severity === "moderate");
    const mild     = filtered.filter((c) => c.severity === "mild");
    return [...severe, ...moderate, ...mild];
  }, [filtered]);

  // Journey summary counts
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
    <LinearGradient colors={["#080611", "#0D0A1E"]} style={{ flex: 1 }}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === "web" ? 67 : 16) }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color="rgba(240,235,248,0.7)" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Patterns & What Helps</Text>
          <Text style={styles.headerSub}>
            {challenges.length > 0 ? `${challenges.length} patterns identified from your compatibility profile` : "Based on your personality and compatibility data"}
          </Text>
        </View>
      </View>

      {challengesLoading && challenges.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color="#B855E0" size="large" />
          <Text style={styles.loadingText}>Loading your compatibility patterns…</Text>
        </View>
      ) : challenges.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>✦</Text>
          <Text style={styles.emptyTitle}>No challenges loaded</Text>
          <Text style={styles.emptySub}>Tap below to load your personalised patterns</Text>
          <TouchableOpacity style={styles.fetchBtn} onPress={loadChallenges}>
            <LinearGradient colors={["#E85C7A", "#B855E0"]} style={styles.fetchBtnGradient}>
              <Text style={styles.fetchBtnText}>Load my patterns</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 100 }]}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#B855E0" />}
        >
          {/* Journey progress banner */}
          {journeyCount.total > 0 && (
            <View style={styles.journeyBanner}>
              <View style={styles.journeyBannerRow}>
                <Feather name="trending-up" size={14} color="#B855E0" />
                <Text style={styles.journeyBannerTitle}>Your Healing Journey</Text>
              </View>
              <View style={styles.journeyStats}>
                <View style={styles.journeyStatItem}>
                  <Text style={[styles.journeyStatNum, { color: "#E85C7A" }]}>{journeyCount.total}</Text>
                  <Text style={styles.journeyStatLabel}>acknowledged</Text>
                </View>
                <View style={styles.journeyDivider} />
                <View style={styles.journeyStatItem}>
                  <Text style={[styles.journeyStatNum, { color: "#F5A623" }]}>{journeyCount.working_on}</Text>
                  <Text style={styles.journeyStatLabel}>working on</Text>
                </View>
                <View style={styles.journeyDivider} />
                <View style={styles.journeyStatItem}>
                  <Text style={[styles.journeyStatNum, { color: "#52C8B8" }]}>{journeyCount.resolved}</Text>
                  <Text style={styles.journeyStatLabel}>resolved</Text>
                </View>
              </View>
            </View>
          )}

          {/* Journey tabs */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips} contentContainerStyle={{ gap: 8, paddingHorizontal: 20 }}>
            {JOURNEY_TABS.map((tab) => (
              <Pressable key={tab} onPress={() => setActiveJourneyTab(tab)} style={[styles.chip, activeJourneyTab === tab && styles.chipActive]}>
                <Text style={[styles.chipText, activeJourneyTab === tab && styles.chipTextActive]}>{tab}</Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* Category filter chips */}
          {activeJourneyTab === "All" && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingHorizontal: 20 }}>
              {categories.map((cat) => (
                <Pressable key={cat} onPress={() => setActiveCategory(cat)} style={[styles.chip, styles.chipSmall, activeCategory === cat && styles.chipActive]}>
                  <Text style={[styles.chipText, activeCategory === cat && styles.chipTextActive]}>{cat}</Text>
                </Pressable>
              ))}
            </ScrollView>
          )}

          {/* Stats row */}
          <View style={styles.statsRow}>
            {(["severe", "moderate", "mild"] as const).map((sev) => {
              const count = filtered.filter((c) => c.severity === sev).length;
              return (
                <View key={sev} style={styles.statItem}>
                  <Text style={[styles.statCount, { color: SEVERITY_COLOR[sev] }]}>{count}</Text>
                  <Text style={styles.statLabel}>{sev}</Text>
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
                  ? "Mark challenges as resolved from the detail screen."
                  : "Open a challenge and tap 'This is me' to start your journey."}
              </Text>
            </View>
          )}

          {/* Challenge cards */}
          {grouped.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              journeyState={journeyStates[challenge.id] ?? null}
              onPress={() => {
                refreshStates();
                router.push({
                  pathname: "/challenge-detail",
                  params: { id: challenge.id, data: JSON.stringify(challenge) },
                });
              }}
            />
          ))}
        </ScrollView>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(240,235,248,0.06)",
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(240,235,248,0.06)",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "Nunito_700Bold",
    color: "#F0EBF8",
  },
  headerSub: {
    fontSize: 12,
    fontFamily: "Nunito_400Regular",
    color: "rgba(240,235,248,0.4)",
    marginTop: 2,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: "Nunito_400Regular",
    color: "rgba(240,235,248,0.45)",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 40,
  },
  emptyIcon: { fontSize: 40, color: "#B855E0" },
  emptyTitle: { fontSize: 18, fontFamily: "Nunito_700Bold", color: "#F0EBF8" },
  emptySub: { fontSize: 13, fontFamily: "Nunito_400Regular", color: "rgba(240,235,248,0.4)", textAlign: "center" },
  fetchBtn: { marginTop: 8, borderRadius: 24, overflow: "hidden" },
  fetchBtnGradient: { paddingHorizontal: 28, paddingVertical: 14 },
  fetchBtnText: { fontSize: 15, fontFamily: "Nunito_700Bold", color: "#fff" },
  scroll: { paddingTop: 16, gap: 12 },
  chips: { marginBottom: 4 },
  chip: {
    backgroundColor: "rgba(240,235,248,0.06)",
    borderWidth: 1,
    borderColor: "rgba(240,235,248,0.1)",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  chipActive: {
    backgroundColor: "rgba(184,85,224,0.18)",
    borderColor: "rgba(184,85,224,0.45)",
  },
  chipText: {
    fontSize: 12,
    fontFamily: "Nunito_500Medium",
    color: "rgba(240,235,248,0.45)",
  },
  chipTextActive: { color: "#B855E0" },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
    marginBottom: 4,
  },
  statItem: { flex: 1, alignItems: "center", gap: 2 },
  statCount: { fontSize: 22, fontFamily: "Nunito_700Bold" },
  statLabel: { fontSize: 10, fontFamily: "Nunito_500Medium", color: "rgba(240,235,248,0.4)", textTransform: "capitalize", letterSpacing: 0.5 },
  card: { borderRadius: 16, marginHorizontal: 20 },
  cardInner: { borderRadius: 16, padding: 16, gap: 10 },
  cardTop: { flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" },
  severityPill: { flexDirection: "row", alignItems: "center", gap: 5, borderWidth: 1, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 },
  severityDot: { width: 7, height: 7, borderRadius: 4 },
  severityLabel: { fontSize: 11, fontFamily: "Nunito_600SemiBold", textTransform: "capitalize", letterSpacing: 0.3 },
  severityMeaning: { fontSize: 10, fontFamily: "Nunito_400Regular", color: "rgba(240,235,248,0.35)", flex: 1 },
  categoryPill: {
    marginLeft: "auto",
    backgroundColor: "rgba(124,82,200,0.12)",
    borderWidth: 1,
    borderColor: "rgba(124,82,200,0.25)",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  categoryText: { fontSize: 10, fontFamily: "Nunito_500Medium", color: "rgba(124,82,200,0.9)" },
  cardTitle: { fontSize: 15, fontFamily: "Nunito_700Bold", color: "#F0EBF8", lineHeight: 21 },
  cardDesc: { fontSize: 13, fontFamily: "Nunito_400Regular", color: "rgba(240,235,248,0.5)", lineHeight: 19 },
  cardFooter: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 2 },
  solutionsHint: { fontSize: 12, fontFamily: "Nunito_500Medium", color: "rgba(240,235,248,0.3)" },
  // Journey
  journeyBadge: { flexDirection: "row", alignItems: "center", gap: 4, borderWidth: 1, borderRadius: 10, paddingHorizontal: 7, paddingVertical: 2 },
  journeyBadgeText: { fontSize: 9, fontFamily: "Nunito_600SemiBold", letterSpacing: 0.3 },
  journeyBanner: { marginHorizontal: 20, backgroundColor: "rgba(184,85,224,0.07)", borderWidth: 1, borderColor: "rgba(184,85,224,0.18)", borderRadius: 16, padding: 14, gap: 10 },
  journeyBannerRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  journeyBannerTitle: { fontSize: 13, fontFamily: "Nunito_600SemiBold", color: "#B855E0" },
  journeyStats: { flexDirection: "row", alignItems: "center" },
  journeyStatItem: { flex: 1, alignItems: "center", gap: 2 },
  journeyStatNum: { fontSize: 20, fontFamily: "Nunito_700Bold" },
  journeyStatLabel: { fontSize: 10, fontFamily: "Nunito_500Medium", color: "rgba(240,235,248,0.4)", textTransform: "capitalize" },
  journeyDivider: { width: 1, height: 28, backgroundColor: "rgba(240,235,248,0.08)" },
  chipSmall: { paddingHorizontal: 10, paddingVertical: 5 },
  emptyJourney: { alignItems: "center", justifyContent: "center", padding: 40, gap: 10 },
  emptyJourneyIcon: { fontSize: 32, color: "rgba(184,85,224,0.4)" },
  emptyJourneyTitle: { fontSize: 16, fontFamily: "Nunito_700Bold", color: "rgba(240,235,248,0.5)" },
  emptyJourneySub: { fontSize: 13, fontFamily: "Nunito_400Regular", color: "rgba(240,235,248,0.3)", textAlign: "center", lineHeight: 19 },
});
