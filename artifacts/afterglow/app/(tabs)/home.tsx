import { GlowCard } from "@/components/GlowCard";
import { useApp } from "@/context/AppContext";
import type { Challenge } from "@/utils/challenges";
import { getAstrologyReading } from "@/utils/astrology";
import {
  getDailyEnergyPersonalized,
  getPersonalizedFocus,
  getPersonalizedQuoteCategory,
} from "@/utils/personalization";
import { getQuoteByCategory } from "@/utils/quotes";
import { fetchDailyContent, type DailyContent } from "@/utils/dbContent";
import { extractKundliAttributes } from "@/utils/challenges";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface EnergyBarProps {
  label: string;
  value: number;
  color: string;
  delay: number;
}

function EnergyBar({ label, value, color, delay }: EnergyBarProps) {
  const widthAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacityAnim, { toValue: 1, duration: 400, delay, useNativeDriver: true }),
      Animated.timing(widthAnim, { toValue: value, duration: 900, delay, useNativeDriver: false }),
    ]).start();
  }, []);

  const widthInterp = widthAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
    extrapolate: "clamp",
  });

  return (
    <Animated.View style={{ opacity: opacityAnim, gap: 6 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={styles.barLabel}>{label}</Text>
        <Text style={[styles.barValue, { color }]}>{value}</Text>
      </View>
      <View style={styles.barTrack}>
        <Animated.View style={{ width: widthInterp, height: "100%", overflow: "hidden", borderRadius: 4 }}>
          <LinearGradient
            colors={[color + "AA", color]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ flex: 1 }}
          />
        </Animated.View>
      </View>
    </Animated.View>
  );
}

function HeartPulse() {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.12, duration: 600, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 600, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={{ transform: [{ scale: pulse }] }}>
      <Text style={styles.pulse}>◉</Text>
    </Animated.View>
  );
}

const SEVERITY_COLOR: Record<string, string> = { mild: "#52C8B8", moderate: "#F5A623", severe: "#E85C7A" };

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, partner, challenges, challengesLoading, loadChallenges } = useApp();

  const reading = useMemo(() => {
    if (!user || !partner) return null;
    return getAstrologyReading(user.name, user.birthDate, partner.name, partner.birthDate, user.birthTime);
  }, [user?.birthDate, user?.name, user?.birthTime, partner?.birthDate, partner?.name]);

  const [dbContent, setDbContent] = useState<DailyContent | null>(null);

  // Fetch DB content (quote + affirmation + daily message) — enriches local fallbacks
  useEffect(() => {
    if (!reading) return;
    const attrs = extractKundliAttributes(reading, partner?.relationshipType ?? "relationship");
    const tags = Object.entries(attrs).map(([k, v]) => `${k}:${v}`).filter(Boolean);
    fetchDailyContent(tags).then((data) => { if (data) setDbContent(data); });
  }, [reading]);

  // Trigger challenge fetch once reading is ready and challenges haven't been loaded yet
  useEffect(() => {
    if (reading && challenges.length === 0 && !challengesLoading) {
      loadChallenges();
    }
  }, [reading]);

  if (!user || !partner || !reading) return null;

  const topChallenges = challenges.slice(0, 3);

  const energy     = getDailyEnergyPersonalized(reading, user ? reading.user.dasha.current : "Chandra");
  const quoteCategory = getPersonalizedQuoteCategory(reading.user.moonRashi, reading.user.dasha.current);
  const today      = new Date();
  const quoteSeed  = today.getFullYear() * 366 + today.getMonth() * 31 + today.getDate();
  const localQuote = getQuoteByCategory(quoteCategory, quoteSeed + reading.user.nakshatra);
  const dailyFocus = getPersonalizedFocus(user.name, reading.user.moonRashi, reading.user.dasha.current, partner.relationshipType);
  // DB content overrides local when available
  const quoteText   = dbContent?.quote?.body ?? `"${localQuote.text}"`;
  const quoteAuthor = dbContent?.quote?.meta?.author as string | undefined ?? localQuote.author;
  const quoteLabel  = (dbContent?.quote?.meta?.category as string | undefined) ?? localQuote.category;
  const affirmation = dbContent?.affirmation?.body ?? null;
  const dailyMsgTitle = dbContent?.message?.title ?? null;
  const dailyMsgBody  = dbContent?.message?.body ?? null;

  const energyBars = [
    { label: "Emotional closeness", value: energy.closeness, color: "#E85C7A" },
    { label: "Attraction intensity", value: energy.attraction, color: "#B855E0" },
    { label: "Communication energy", value: energy.communication, color: "#7C52C8" },
    { label: "Reconnection pull", value: energy.reconnection, color: "#F5A623" },
    { label: "Emotional tension", value: energy.tension, color: "#52C8B8" },
  ];

  const insights = [
    {
      title: "Emotional Chemistry",
      sub: "See how your energies align",
      route: "/(tabs)/compatibility",
      color: "#E85C7A",
    },
    {
      title: "Who Falls Harder?",
      sub: "The answer might surprise you",
      route: "/feature-detail",
      params: { featureKey: "falls-harder" },
      color: "#B855E0",
    },
    {
      title: "Hidden Pattern",
      sub: "What's really driving this",
      route: "/(tabs)/compatibility",
      color: "#7C52C8",
    },
  ];

  return (
    <LinearGradient
      colors={["#080611", "#0D0A1E"]}
      style={{ flex: 1 }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scroll,
          {
            paddingTop: insets.top + (Platform.OS === "web" ? 67 : 16),
            paddingBottom: insets.bottom + 100,
          },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good to see you,</Text>
            <Text style={styles.userName}>{user.name}</Text>
          </View>
          <View style={styles.headerRight}>
            <HeartPulse />
            <TouchableOpacity
              onPress={() => router.push("/profile")}
              activeOpacity={0.75}
              style={styles.profileBtn}
            >
              <LinearGradient
                colors={["#E85C7A", "#B855E0"]}
                style={styles.profileBtnGradient}
              >
                <Text style={styles.profileBtnInitial}>{user.name.charAt(0) || "?"}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Today's Reflection — content from DB with local fallback */}
        <GlowCard style={styles.quoteCard} glowColor="rgba(184,85,224,0.15)">
          <LinearGradient colors={["#1A1035", "#110F1E"]} style={styles.quoteInner}>
            <View style={styles.quoteTopRow}>
              <Text style={styles.quoteCategoryLabel}>
                {quoteLabel === "self"          ? "self-worth"
                  : quoteLabel === "communication" ? "honesty"
                  : quoteLabel === "intuition"     ? "inner knowing"
                  : quoteLabel === "patience"      ? "timing"
                  : quoteLabel === "healing"       ? "healing"
                  : quoteLabel ?? "reflection"}
              </Text>
              <Text style={styles.quoteStar}>✦</Text>
            </View>
            <Text style={styles.quoteText}>{quoteText.startsWith('"') ? quoteText : `"${quoteText}"`}</Text>
            {quoteAuthor ? (
              <Text style={styles.quoteAuthor}>— {quoteAuthor}</Text>
            ) : null}
            <View style={styles.quoteDivider} />
            <View style={styles.focusRow}>
              <Feather name="sun" size={13} color="#F5A623" />
              <Text style={styles.focusText}>{dailyMsgBody ?? dailyFocus}</Text>
            </View>
          </LinearGradient>
        </GlowCard>

        {/* Daily Affirmation — from DB */}
        {affirmation && (
          <GlowCard style={styles.affirmCard} glowColor="rgba(82,200,184,0.12)">
            <LinearGradient colors={["#0C1A17", "#110F1E"]} style={styles.affirmInner}>
              <View style={styles.affirmTopRow}>
                <Feather name="star" size={11} color="#52C8B8" />
                <Text style={styles.affirmLabel}>{dailyMsgTitle ?? "Today's Affirmation"}</Text>
              </View>
              <Text style={styles.affirmText}>{affirmation}</Text>
            </LinearGradient>
          </GlowCard>
        )}

        {/* Daily energy card */}
        <GlowCard style={styles.dailyCard} intensity="high" glowColor="rgba(232,92,122,0.2)">
          <LinearGradient
            colors={["#1E1030", "#110F1E"]}
            style={styles.dailyCardInner}
          >
            <View style={styles.dailyHeader}>
              <View>
                <Text style={styles.dailyTitle}>Daily Relationship Energy</Text>
                <Text style={styles.dailyDate}>{energy.date}</Text>
              </View>
              <View style={styles.liveTag}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>Live</Text>
              </View>
            </View>

            <Text style={styles.dailyMessage}>"{energy.message}"</Text>
            <Text style={styles.withText}>with {partner.name}</Text>

            <View style={styles.barsContainer}>
              {energyBars.map((bar, i) => (
                <EnergyBar key={bar.label} {...bar} delay={i * 80} />
              ))}
            </View>
          </LinearGradient>
        </GlowCard>

        {/* Partner info */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Connection</Text>
        </View>

        <GlowCard style={styles.connectionCard}>
          <LinearGradient
            colors={["#1A1630", "#110F1E"]}
            style={styles.connectionInner}
          >
            <View style={styles.connectionRow}>
              <View style={styles.personBubble}>
                <Text style={styles.personInitial}>{user.name.charAt(0) || "?"}</Text>
              </View>
              <View style={styles.connectionLine}>
                <LinearGradient
                  colors={["#E85C7A", "#B855E0"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.connectionLineBar}
                />
              </View>
              <View style={[styles.personBubble, { backgroundColor: "rgba(184,85,224,0.15)", borderColor: "rgba(184,85,224,0.4)" }]}>
                <Text style={styles.personInitial}>{partner.name.charAt(0) || "?"}</Text>
              </View>
            </View>
            <View style={styles.namesRow}>
              <Text style={styles.personName}>{user.name}</Text>
              <Text style={styles.relTypeBadge}>{partner.relationshipType}</Text>
              <Text style={styles.personName}>{partner.name}</Text>
            </View>
          </LinearGradient>
        </GlowCard>

        {/* Insights */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Insights</Text>
        </View>

        {insights.map((insight, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => {
              if (insight.params) {
                router.push({ pathname: insight.route as any, params: insight.params });
              } else {
                router.push(insight.route as any);
              }
            }}
            activeOpacity={0.8}
          >
            <GlowCard style={styles.insightCard}>
              <LinearGradient
                colors={["#1A1630", "#110F1E"]}
                style={styles.insightInner}
              >
                <View style={[styles.insightDot, { backgroundColor: insight.color + "33", borderColor: insight.color + "66" }]}>
                  <View style={[styles.insightDotInner, { backgroundColor: insight.color }]} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.insightTitle}>{insight.title}</Text>
                  <Text style={styles.insightSub}>{insight.sub}</Text>
                </View>
                <Feather name="chevron-right" size={18} color="rgba(240,235,248,0.3)" />
              </LinearGradient>
            </GlowCard>
          </TouchableOpacity>
        ))}

        {/* Challenges & Remedies */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Challenges & Remedies</Text>
        </View>

        <TouchableOpacity
          onPress={() => router.push("/challenges")}
          activeOpacity={0.85}
        >
          <GlowCard style={styles.challengesCard} glowColor="rgba(232,92,122,0.12)">
            <LinearGradient colors={["#1E1030", "#110F1E"]} style={styles.challengesInner}>
              <View style={styles.challengesHeader}>
                <View>
                  <Text style={styles.challengesTitle}>Your Relationship Patterns</Text>
                  <Text style={styles.challengesSub}>
                    {challenges.length > 0
                      ? `${challenges.length} patterns identified from your kundli`
                      : challengesLoading
                      ? "Analysing your birth chart…"
                      : "Tap to reveal your patterns"}
                  </Text>
                </View>
                <View style={styles.challengesArrow}>
                  <Feather name="arrow-right" size={16} color="rgba(240,235,248,0.5)" />
                </View>
              </View>

              {topChallenges.length > 0 ? (
                <View style={styles.challengesList}>
                  {topChallenges.map((c: Challenge, i: number) => {
                    const col = SEVERITY_COLOR[c.severity] ?? "#B855E0";
                    return (
                      <View key={c.id} style={styles.challengeRow}>
                        <View style={[styles.challengeDot, { backgroundColor: col }]} />
                        <Text style={styles.challengeRowText} numberOfLines={1}>{c.title}</Text>
                        <Text style={[styles.challengeSeverity, { color: col }]}>{c.severity}</Text>
                      </View>
                    );
                  })}
                  {challenges.length > 3 && (
                    <Text style={styles.challengesMore}>+{challenges.length - 3} more patterns →</Text>
                  )}
                </View>
              ) : challengesLoading ? (
                <View style={styles.challengesLoading}>
                  <View style={styles.shimmer} />
                  <View style={[styles.shimmer, { width: "75%" }]} />
                  <View style={[styles.shimmer, { width: "60%" }]} />
                </View>
              ) : null}
            </LinearGradient>
          </GlowCard>
        </TouchableOpacity>

        {/* Guidance teaser */}
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/guidance")}
          activeOpacity={0.8}
          style={styles.guidanceTeaser}
        >
          <LinearGradient
            colors={["rgba(124,82,200,0.15)", "rgba(184,85,224,0.08)"]}
            style={styles.guidanceTeaserInner}
          >
            <Text style={styles.guidanceTeaserTitle}>Something on your mind?</Text>
            <Text style={styles.guidanceTeaserSub}>Ask about this connection</Text>
            <View style={styles.guidanceSuggestions}>
              {["Why did they pull away?", "Why can't I move on?"].map((q, i) => (
                <View key={i} style={styles.suggestionChip}>
                  <Text style={styles.suggestionText}>{q}</Text>
                </View>
              ))}
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: 20,
    gap: 14,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  profileBtn: {
    borderRadius: 20,
    overflow: "hidden",
  },
  profileBtnGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  profileBtnInitial: {
    fontSize: 17,
    fontFamily: "Nunito_700Bold",
    color: "#fff",
  },
  greeting: {
    fontSize: 14,
    fontFamily: "Nunito_400Regular",
    color: "rgba(240,235,248,0.45)",
  },
  userName: {
    fontSize: 26,
    fontFamily: "Nunito_700Bold",
    color: "#F0EBF8",
  },
  pulse: {
    fontSize: 28,
    color: "#E85C7A",
  },
  quoteCard: { borderRadius: 20 },
  quoteInner: { borderRadius: 20, padding: 20, gap: 12 },
  quoteTopRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  quoteCategoryLabel: {
    fontSize: 10, fontFamily: "Nunito_600SemiBold", letterSpacing: 1.5,
    textTransform: "uppercase", color: "#B855E0",
  },
  quoteStar: { fontSize: 14, color: "rgba(184,85,224,0.5)" },
  quoteText: {
    fontSize: 17, fontFamily: "Nunito_400Regular", color: "rgba(240,235,248,0.9)",
    lineHeight: 26, fontStyle: "italic",
  },
  quoteAuthor: {
    fontSize: 12, fontFamily: "Nunito_500Medium", color: "rgba(240,235,248,0.35)",
  },
  quoteDivider: { height: 1, backgroundColor: "rgba(240,235,248,0.06)" },
  focusRow: { flexDirection: "row", alignItems: "flex-start", gap: 8 },
  focusText: {
    flex: 1, fontSize: 13, fontFamily: "Nunito_400Regular",
    color: "rgba(240,235,248,0.5)", lineHeight: 20,
  },

  dailyCard: {
    borderRadius: 20,
  },
  dailyCardInner: {
    borderRadius: 20,
    padding: 20,
    gap: 14,
  },
  dailyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  dailyTitle: {
    fontSize: 13,
    fontFamily: "Nunito_600SemiBold",
    color: "rgba(240,235,248,0.55)",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  dailyDate: {
    fontSize: 12,
    fontFamily: "Nunito_400Regular",
    color: "rgba(240,235,248,0.3)",
    marginTop: 2,
  },
  liveTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(232,92,122,0.12)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#E85C7A",
  },
  liveText: {
    fontSize: 11,
    fontFamily: "Nunito_600SemiBold",
    color: "#E85C7A",
  },
  dailyMessage: {
    fontSize: 16,
    fontFamily: "Nunito_400Regular",
    color: "rgba(240,235,248,0.85)",
    lineHeight: 24,
    fontStyle: "italic",
  },
  withText: {
    fontSize: 12,
    fontFamily: "Nunito_400Regular",
    color: "rgba(240,235,248,0.3)",
  },
  barsContainer: {
    gap: 12,
    marginTop: 4,
  },
  barLabel: {
    fontSize: 12,
    fontFamily: "Nunito_400Regular",
    color: "rgba(240,235,248,0.5)",
  },
  barValue: {
    fontSize: 12,
    fontFamily: "Nunito_600SemiBold",
  },
  barTrack: {
    height: 5,
    backgroundColor: "rgba(240,235,248,0.07)",
    borderRadius: 4,
    overflow: "hidden",
  },
  sectionHeader: {
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: "Nunito_600SemiBold",
    color: "rgba(240,235,248,0.4)",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  connectionCard: {
    borderRadius: 20,
  },
  connectionInner: {
    borderRadius: 20,
    padding: 20,
    gap: 12,
    alignItems: "center",
  },
  connectionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 0,
    width: "100%",
    justifyContent: "center",
  },
  personBubble: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "rgba(232,92,122,0.15)",
    borderWidth: 1.5,
    borderColor: "rgba(232,92,122,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  personInitial: {
    fontSize: 22,
    fontFamily: "Nunito_700Bold",
    color: "#F0EBF8",
  },
  connectionLine: {
    flex: 1,
    height: 2,
    marginHorizontal: -2,
  },
  connectionLineBar: {
    flex: 1,
  },
  namesRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  personName: {
    fontSize: 14,
    fontFamily: "Nunito_600SemiBold",
    color: "#F0EBF8",
  },
  relTypeBadge: {
    fontSize: 11,
    fontFamily: "Nunito_500Medium",
    color: "rgba(232,92,122,0.8)",
    backgroundColor: "rgba(232,92,122,0.1)",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    textTransform: "capitalize",
  },
  insightCard: {
    borderRadius: 16,
  },
  insightInner: {
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  insightDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  insightDotInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  insightTitle: {
    fontSize: 15,
    fontFamily: "Nunito_600SemiBold",
    color: "#F0EBF8",
  },
  insightSub: {
    fontSize: 12,
    fontFamily: "Nunito_400Regular",
    color: "rgba(240,235,248,0.4)",
    marginTop: 2,
  },
  guidanceTeaser: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(124,82,200,0.2)",
    overflow: "hidden",
    marginTop: 4,
  },
  guidanceTeaserInner: {
    padding: 20,
    gap: 6,
  },
  guidanceTeaserTitle: {
    fontSize: 17,
    fontFamily: "Nunito_700Bold",
    color: "#F0EBF8",
  },
  guidanceTeaserSub: {
    fontSize: 13,
    fontFamily: "Nunito_400Regular",
    color: "rgba(240,235,248,0.45)",
  },
  guidanceSuggestions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
    flexWrap: "wrap",
  },
  suggestionChip: {
    backgroundColor: "rgba(124,82,200,0.15)",
    borderWidth: 1,
    borderColor: "rgba(124,82,200,0.3)",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  suggestionText: {
    fontSize: 12,
    fontFamily: "Nunito_400Regular",
    color: "rgba(240,235,248,0.7)",
  },
  affirmCard: { borderRadius: 16 },
  affirmInner: { borderRadius: 16, padding: 16, gap: 8 },
  affirmTopRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  affirmLabel: { fontSize: 10, fontFamily: "Nunito_600SemiBold", color: "#52C8B8", letterSpacing: 1, textTransform: "uppercase" },
  affirmText: { fontSize: 15, fontFamily: "Nunito_600SemiBold", color: "rgba(240,235,248,0.85)", lineHeight: 23, fontStyle: "italic" },
  challengesCard: { borderRadius: 20 },
  challengesInner: { borderRadius: 20, padding: 18, gap: 14 },
  challengesHeader: { flexDirection: "row", alignItems: "flex-start" },
  challengesTitle: { fontSize: 15, fontFamily: "Nunito_700Bold", color: "#F0EBF8" },
  challengesSub: { fontSize: 12, fontFamily: "Nunito_400Regular", color: "rgba(240,235,248,0.4)", marginTop: 3 },
  challengesArrow: {
    marginLeft: "auto",
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: "rgba(240,235,248,0.06)",
    alignItems: "center", justifyContent: "center",
  },
  challengesList: { gap: 9 },
  challengeRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  challengeDot: { width: 7, height: 7, borderRadius: 4, flexShrink: 0 },
  challengeRowText: { flex: 1, fontSize: 13, fontFamily: "Nunito_400Regular", color: "rgba(240,235,248,0.65)" },
  challengeSeverity: { fontSize: 10, fontFamily: "Nunito_600SemiBold", textTransform: "capitalize", letterSpacing: 0.3 },
  challengesMore: { fontSize: 12, fontFamily: "Nunito_500Medium", color: "rgba(184,85,224,0.7)", marginTop: 2 },
  challengesLoading: { gap: 8 },
  shimmer: { height: 12, borderRadius: 6, backgroundColor: "rgba(240,235,248,0.06)", width: "100%" },
});
