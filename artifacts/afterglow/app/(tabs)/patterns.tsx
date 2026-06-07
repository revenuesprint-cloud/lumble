import { GlowCard } from "@/components/GlowCard";
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
  mild:     "#52C8B8",
  moderate: "#F5A623",
  severe:   "#E85C7A",
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
    <TouchableOpacity onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onPress(); }} activeOpacity={0.8}>
      <GlowCard style={styles.card} glowColor={js ? js.color + "18" : color + "22"}>
        <LinearGradient colors={["#1A1630", "#110F1E"]} style={styles.cardInner}>
          <View style={styles.cardTop}>
            <View style={[styles.severityPill, { backgroundColor: color + "14", borderColor: color + "33" }]}>
              <View style={[styles.severityDot, { backgroundColor: color }]} />
              <Text style={[styles.severityLabel, { color }]}>{SEVERITY_DISPLAY[challenge.severity] ?? challenge.severity}</Text>
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
              {challenge.solutions?.length ?? 0} remedies to try
            </Text>
            <Feather name="chevron-right" size={16} color="rgba(240,235,248,0.3)" />
          </View>
        </LinearGradient>
      </GlowCard>
    </TouchableOpacity>
  );
}

export default function PatternsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { challenges, challengesLoading, loadChallenges } = useApp();
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORIES);
  const [activeJourneyTab, setActiveJourneyTab] = useState<typeof JOURNEY_TABS[number]>("All");
  const [journeyStates, setJourneyStates] = useState<Record<string, string>>({});
  const [refreshing, setRefreshing] = useState(false);

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

      {/* Tab-native header — no back button */}
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
          <ActivityIndicator color="#B855E0" size="large" />
          <Text style={styles.loadingText}>Identifying your patterns…</Text>
        </View>
      ) : challenges.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>✦</Text>
          <Text style={styles.emptyTitle}>No patterns loaded yet</Text>
          <Text style={styles.emptySub}>Tap below to load your personalised patterns and remedies</Text>
          <TouchableOpacity
            style={styles.fetchBtn}
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); loadChallenges(); }}
          >
            <LinearGradient colors={["#E85C7A", "#B855E0"]} style={styles.fetchBtnGradient}>
              <Text style={styles.fetchBtnText}>Load my patterns</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={Platform.OS === "web" ? { maxWidth: 640, alignSelf: "center", width: "100%" } : undefined}
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

          {/* Journey filter tabs */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
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
              horizontal
              showsHorizontalScrollIndicator={false}
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
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 4,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(240,235,248,0.07)",
  },
  screenTitle: {
    fontSize: 32,
    fontFamily: "Nunito_700Bold",
    color: "#F0EBF8",
  },
  screenSub: {
    fontSize: 14,
    fontFamily: "Nunito_400Regular",
    color: "rgba(240,235,248,0.42)",
  },
  loadingContainer: { flex: 1, alignItems: "center", justifyContent: "center", gap: 18 },
  loadingText: { fontSize: 15, fontFamily: "Nunito_400Regular", color: "rgba(240,235,248,0.48)" },
  emptyContainer: { flex: 1, alignItems: "center", justifyContent: "center", gap: 14, paddingHorizontal: 40 },
  emptyIcon: { fontSize: 44, color: "#B855E0" },
  emptyTitle: { fontSize: 20, fontFamily: "Nunito_700Bold", color: "#F0EBF8" },
  emptySub: { fontSize: 14, fontFamily: "Nunito_400Regular", color: "rgba(240,235,248,0.42)", textAlign: "center", lineHeight: 22 },
  fetchBtn: { marginTop: 10, borderRadius: 26, overflow: "hidden" },
  fetchBtnGradient: { paddingHorizontal: 32, paddingVertical: 16 },
  fetchBtnText: { fontSize: 16, fontFamily: "Nunito_700Bold", color: "#fff" },

  scroll: { paddingTop: 18, gap: 13 },

  journeyBanner: {
    marginHorizontal: 20,
    backgroundColor: "rgba(184,85,224,0.08)",
    borderWidth: 1,
    borderColor: "rgba(184,85,224,0.2)",
    borderRadius: 18,
    padding: 16,
    gap: 12,
  },
  journeyBannerRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  journeyBannerTitle: { fontSize: 14, fontFamily: "Nunito_600SemiBold", color: "#B855E0" },
  journeyStats: { flexDirection: "row", alignItems: "center" },
  journeyStatItem: { flex: 1, alignItems: "center", gap: 3 },
  journeyStatNum: { fontSize: 22, fontFamily: "Nunito_700Bold" },
  journeyStatLabel: { fontSize: 11, fontFamily: "Nunito_500Medium", color: "rgba(240,235,248,0.42)", textTransform: "capitalize" },
  journeyDivider: { width: 1, height: 30, backgroundColor: "rgba(240,235,248,0.09)" },

  chips: { marginBottom: 4 },
  chip: {
    backgroundColor: "rgba(240,235,248,0.06)",
    borderWidth: 1,
    borderColor: "rgba(240,235,248,0.1)",
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  chipActive: { backgroundColor: "rgba(184,85,224,0.18)", borderColor: "rgba(184,85,224,0.45)" },
  chipSmall: { paddingHorizontal: 11, paddingVertical: 6 },
  chipText: { fontSize: 13, fontFamily: "Nunito_500Medium", color: "rgba(240,235,248,0.48)" },
  chipTextActive: { color: "#B855E0" },

  statsRow: { flexDirection: "row", gap: 12, paddingHorizontal: 20, marginBottom: 4 },
  statItem: { flex: 1, alignItems: "center", gap: 3 },
  statCount: { fontSize: 26, fontFamily: "Nunito_700Bold" },
  statLabel: { fontSize: 11, fontFamily: "Nunito_500Medium", color: "rgba(240,235,248,0.42)", textTransform: "capitalize", letterSpacing: 0.5 },

  card: { borderRadius: 20, marginHorizontal: 20 },
  cardInner: { borderRadius: 20, padding: 20, gap: 12 },
  cardTop: { flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" },
  severityPill: { flexDirection: "row", alignItems: "center", gap: 6, borderWidth: 1, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 },
  severityDot: { width: 7, height: 7, borderRadius: 4 },
  severityLabel: { fontSize: 12, fontFamily: "Nunito_600SemiBold", textTransform: "capitalize", letterSpacing: 0.3 },
  severityMeaning: { fontSize: 11, fontFamily: "Nunito_400Regular", color: "rgba(240,235,248,0.38)", flex: 1 },
  categoryPill: {
    marginLeft: "auto",
    backgroundColor: "rgba(124,82,200,0.12)",
    borderWidth: 1,
    borderColor: "rgba(124,82,200,0.28)",
    borderRadius: 12,
    paddingHorizontal: 11,
    paddingVertical: 4,
  },
  categoryText: { fontSize: 11, fontFamily: "Nunito_500Medium", color: "rgba(124,82,200,0.9)" },
  journeyBadge: { flexDirection: "row", alignItems: "center", gap: 4, borderWidth: 1, borderRadius: 11, paddingHorizontal: 8, paddingVertical: 3 },
  journeyBadgeText: { fontSize: 10, fontFamily: "Nunito_600SemiBold", letterSpacing: 0.3 },
  cardTitle: { fontSize: 17, fontFamily: "Nunito_700Bold", color: "#F0EBF8", lineHeight: 24 },
  cardDesc: { fontSize: 14, fontFamily: "Nunito_400Regular", color: "rgba(240,235,248,0.55)", lineHeight: 21 },
  cardFooter: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 2 },
  solutionsHint: { fontSize: 13, fontFamily: "Nunito_500Medium", color: "rgba(240,235,248,0.32)" },

  emptyJourney: { alignItems: "center", justifyContent: "center", padding: 40, gap: 12 },
  emptyJourneyIcon: { fontSize: 36, color: "rgba(184,85,224,0.42)" },
  emptyJourneyTitle: { fontSize: 18, fontFamily: "Nunito_700Bold", color: "rgba(240,235,248,0.5)" },
  emptyJourneySub: { fontSize: 14, fontFamily: "Nunito_400Regular", color: "rgba(240,235,248,0.32)", textAlign: "center", lineHeight: 21 },
});
