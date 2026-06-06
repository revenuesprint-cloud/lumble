import { GlowCard } from "@/components/GlowCard";
import { useApp } from "@/context/AppContext";
import { getAstrologyReading } from "@/utils/astrology";
import {
  getDailyEnergyPersonalized,
  getPersonalizedFocus,
  getPersonalizedQuoteCategory,
  getPersonalizedHero,
  getTodayBetweenYou,
} from "@/utils/personalization";
import { getQuoteByCategory } from "@/utils/quotes";
import { fetchDailyContent, type DailyContent } from "@/utils/dbContent";
import { extractKundliAttributes } from "@/utils/challenges";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
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
    <Animated.View style={{ opacity: opacityAnim, gap: 5 }}>
      <Text style={styles.barLabel}>{label}</Text>
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

// ─── Right Now Card ───────────────────────────────────────────────────────────

function RightNowCard({
  userMoment,
  partnerSignal,
  userName,
  partnerName,
}: {
  userMoment: string;
  partnerSignal: string;
  userName: string;
  partnerName: string;
}) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, delay: 200, useNativeDriver: true }).start();
  }, []);

  return (
    <Animated.View style={[rnStyles.card, { opacity: fadeAnim }]}>
      <View style={rnStyles.header}>
        <View style={rnStyles.livePip} />
        <Text style={rnStyles.headerLabel}>RIGHT NOW</Text>
      </View>
      <View style={rnStyles.section}>
        <Text style={rnStyles.personLabel}>{userName}</Text>
        <Text style={rnStyles.body}>{userMoment}</Text>
      </View>
      <View style={rnStyles.divider} />
      <View style={rnStyles.section}>
        <Text style={rnStyles.personLabel}>{partnerName}</Text>
        <Text style={rnStyles.body}>{partnerSignal}</Text>
      </View>
    </Animated.View>
  );
}

const rnStyles = StyleSheet.create({
  card:        { backgroundColor: "#0C0A18", borderRadius: 20, borderWidth: 1, borderColor: "rgba(240,235,248,0.07)", padding: 20, gap: 14 },
  header:      { flexDirection: "row", alignItems: "center", gap: 7 },
  livePip:     { width: 7, height: 7, borderRadius: 4, backgroundColor: "#E85C7A" },
  headerLabel: { fontSize: 10, fontFamily: "Nunito_700Bold", color: "rgba(232,92,122,0.7)", letterSpacing: 1.5 },
  section:     { gap: 6 },
  personLabel: { fontSize: 11, fontFamily: "Nunito_600SemiBold", color: "rgba(240,235,248,0.3)", letterSpacing: 0.8, textTransform: "uppercase" },
  body:        { fontSize: 15, fontFamily: "Nunito_400Regular", color: "rgba(240,235,248,0.82)", lineHeight: 24 },
  divider:     { height: 1, backgroundColor: "rgba(240,235,248,0.06)" },
});

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, partner } = useApp();

  const reading = useMemo(() => {
    if (!user || !partner) return null;
    return getAstrologyReading(user.name, user.birthDate, partner.name, partner.birthDate, user.birthTime);
  }, [user?.birthDate, user?.name, user?.birthTime, partner?.birthDate, partner?.name]);

  const [dbContent, setDbContent] = useState<DailyContent | null>(null);

  useEffect(() => {
    if (!reading) return;
    const attrs = extractKundliAttributes(reading, partner?.relationshipType ?? "relationship");
    const tags = Object.entries(attrs).map(([k, v]) => `${k}:${v}`).filter(Boolean);
    fetchDailyContent(tags).then((data) => { if (data) setDbContent(data); });
  }, [reading]);

  if (!user || !partner || !reading) return null;

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
  const dailyMsgBody  = dbContent?.message?.body ?? null;

  const hero = getPersonalizedHero(user.name, partner.name, reading, partner.relationshipType);
  const rightNow = getTodayBetweenYou(reading, partner.relationshipType, user.name, partner.name);

  const greetingHour = new Date().getHours();
  const greeting =
    greetingHour < 12 ? "Good morning," :
    greetingHour < 18 ? "Good afternoon," :
                        "Good evening,";

  const energyBars = [
    { label: "Emotional closeness", value: energy.closeness, color: "#E85C7A" },
    { label: "Communication energy", value: energy.communication, color: "#7C52C8" },
    { label: "Emotional tension", value: energy.tension, color: "#52C8B8" },
  ];

  return (
    <LinearGradient
      colors={["#080611", "#0D0A1E"]}
      style={{ flex: 1 }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={Platform.OS === "web" ? { maxWidth: 640, alignSelf: "center", width: "100%" } : undefined}
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
            <Text style={styles.greeting}>{greeting}</Text>
            <Text style={styles.userName}>{user.name}</Text>
          </View>
          <TouchableOpacity
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push("/profile"); }}
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

        {/* Today's Read — hero card */}
        <GlowCard style={styles.heroCard} glowColor="rgba(232,92,122,0.18)">
          <LinearGradient colors={["#1E0D2B", "#110F1E"]} style={styles.heroInner}>
            <View style={styles.heroTopRow}>
              <View style={styles.heroMoonTag}>
                <Text style={styles.heroMoonTagText}>{hero.moonTag}</Text>
              </View>
              <Text style={styles.heroStarDeco}>✦</Text>
            </View>
            <Text style={styles.heroHeadline}>{hero.headline}</Text>
            <Text style={styles.heroInsight}>{hero.insight}</Text>
            <View style={styles.heroDivider} />
            <View style={styles.heroActionRow}>
              <Feather name="sun" size={13} color="#F5A623" />
              <Text style={styles.heroActionText}>{hero.action}</Text>
            </View>
          </LinearGradient>
        </GlowCard>

        {/* Right Now — hyper-specific daily insight */}
        <RightNowCard
          userMoment={rightNow.userMoment}
          partnerSignal={rightNow.partnerSignal}
          userName={user.name}
          partnerName={partner.name}
        />

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
              <Text style={styles.quoteAuthor}>by {quoteAuthor}</Text>
            ) : null}
            <View style={styles.quoteDivider} />
            <View style={styles.focusRow}>
              <Feather name="sun" size={13} color="#F5A623" />
              <Text style={styles.focusText}>{dailyMsgBody ?? dailyFocus}</Text>
            </View>
          </LinearGradient>
        </GlowCard>

        {/* Daily energy card */}
        <GlowCard style={styles.dailyCard} intensity="high" glowColor="rgba(232,92,122,0.2)">
          <LinearGradient
            colors={["#1E1030", "#110F1E"]}
            style={styles.dailyCardInner}
          >
            <View style={styles.dailyHeader}>
              <Text style={styles.dailyTitle}>Daily Relationship Energy</Text>
              <Text style={styles.dailyDate}>{energy.date}</Text>
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

        {/* Guidance teaser */}
        <TouchableOpacity
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push("/(tabs)/guidance"); }}
          activeOpacity={0.8}
          style={styles.guidanceTeaser}
        >
          <LinearGradient
            colors={["rgba(124,82,200,0.15)", "rgba(184,85,224,0.08)"]}
            style={styles.guidanceTeaserInner}
          >
            <Text style={styles.guidanceTeaserTitle}>The question you keep not asking</Text>
            <Text style={styles.guidanceTeaserSub}>Say it out loud. Get an honest answer.</Text>
            <View style={styles.guidanceSuggestions}>
              {[
                partner.relationshipType === "ex"
                  ? `Do they actually miss me or just the comfort?`
                  : partner.relationshipType === "situationship"
                  ? `Why am I always the one who wants more?`
                  : partner.relationshipType === "crush"
                  ? `Am I misreading this or do they feel it too?`
                  : `Why do I feel like I care more than they do?`,
                partner.relationshipType === "ex"
                  ? `Why can I not let go even when I know I should?`
                  : partner.relationshipType === "situationship"
                  ? `Am I just convenient for them right now?`
                  : partner.relationshipType === "crush"
                  ? `What if I say something and it ruins everything?`
                  : `Do they actually want to be with me?`,
              ].map((q, i) => (
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
    gap: 18,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  profileBtn: {
    borderRadius: 22,
    overflow: "hidden",
  },
  profileBtnGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  profileBtnInitial: {
    fontSize: 18,
    fontFamily: "Nunito_700Bold",
    color: "#fff",
  },
  greeting: {
    fontSize: 15,
    fontFamily: "Nunito_400Regular",
    color: "rgba(240,235,248,0.5)",
  },
  userName: {
    fontSize: 32,
    fontFamily: "Nunito_700Bold",
    color: "#F0EBF8",
  },
  quoteCard: { borderRadius: 22 },
  quoteInner: { borderRadius: 22, padding: 24, gap: 14 },
  quoteTopRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  quoteCategoryLabel: {
    fontSize: 11, fontFamily: "Nunito_600SemiBold", letterSpacing: 1.5,
    textTransform: "uppercase", color: "#B855E0",
  },
  quoteStar: { fontSize: 16, color: "rgba(184,85,224,0.5)" },
  quoteText: {
    fontSize: 19, fontFamily: "Nunito_400Regular", color: "rgba(240,235,248,0.92)",
    lineHeight: 29, fontStyle: "italic",
  },
  quoteAuthor: {
    fontSize: 13, fontFamily: "Nunito_500Medium", color: "rgba(240,235,248,0.4)",
  },
  quoteDivider: { height: 1, backgroundColor: "rgba(240,235,248,0.08)" },
  focusRow: { flexDirection: "row", alignItems: "flex-start", gap: 8 },
  focusText: {
    flex: 1, fontSize: 14, fontFamily: "Nunito_400Regular",
    color: "rgba(240,235,248,0.55)", lineHeight: 22,
  },

  dailyCard: {
    borderRadius: 22,
  },
  dailyCardInner: {
    borderRadius: 22,
    padding: 24,
    gap: 14,
  },
  dailyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  dailyTitle: {
    fontSize: 11,
    fontFamily: "Nunito_600SemiBold",
    color: "rgba(240,235,248,0.5)",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  dailyDate: {
    fontSize: 13,
    fontFamily: "Nunito_400Regular",
    color: "rgba(240,235,248,0.35)",
    marginTop: 3,
  },
  dailyMessage: {
    fontSize: 18,
    fontFamily: "Nunito_400Regular",
    color: "rgba(240,235,248,0.88)",
    lineHeight: 27,
    fontStyle: "italic",
  },
  withText: {
    fontSize: 13,
    fontFamily: "Nunito_400Regular",
    color: "rgba(240,235,248,0.35)",
  },
  barsContainer: {
    gap: 13,
    marginTop: 4,
  },
  barLabel: {
    fontSize: 13,
    fontFamily: "Nunito_400Regular",
    color: "rgba(240,235,248,0.55)",
  },
  barTrack: {
    height: 6,
    backgroundColor: "rgba(240,235,248,0.08)",
    borderRadius: 4,
    overflow: "hidden",
  },
  guidanceTeaser: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(124,82,200,0.25)",
    overflow: "hidden",
    marginTop: 4,
  },
  guidanceTeaserInner: {
    padding: 22,
    gap: 8,
  },
  guidanceTeaserTitle: {
    fontSize: 21,
    fontFamily: "Nunito_700Bold",
    color: "#F0EBF8",
    lineHeight: 28,
  },
  guidanceTeaserSub: {
    fontSize: 15,
    fontFamily: "Nunito_400Regular",
    color: "rgba(240,235,248,0.5)",
  },
  guidanceSuggestions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 10,
    flexWrap: "wrap",
  },
  suggestionChip: {
    backgroundColor: "rgba(124,82,200,0.15)",
    borderWidth: 1,
    borderColor: "rgba(124,82,200,0.3)",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  suggestionText: {
    fontSize: 13,
    fontFamily: "Nunito_400Regular",
    color: "rgba(240,235,248,0.75)",
  },
  heroCard: { borderRadius: 22 },
  heroInner: { borderRadius: 22, padding: 24, gap: 14 },
  heroTopRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  heroMoonTag: {
    backgroundColor: "rgba(232,92,122,0.12)",
    borderWidth: 1,
    borderColor: "rgba(232,92,122,0.28)",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  heroMoonTagText: {
    fontSize: 11,
    fontFamily: "Nunito_600SemiBold",
    color: "#E85C7A",
    letterSpacing: 0.5,
  },
  heroStarDeco: { fontSize: 16, color: "rgba(232,92,122,0.45)" },
  heroHeadline: {
    fontSize: 23,
    fontFamily: "Nunito_700Bold",
    color: "#F0EBF8",
    lineHeight: 31,
  },
  heroInsight: {
    fontSize: 16,
    fontFamily: "Nunito_400Regular",
    color: "rgba(240,235,248,0.85)",
    lineHeight: 25,
  },
  heroDivider: { height: 1, backgroundColor: "rgba(240,235,248,0.08)" },
  heroActionRow: { flexDirection: "row", alignItems: "flex-start", gap: 8 },
  heroActionText: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Nunito_600SemiBold",
    color: "#F5A623",
    lineHeight: 21,
  },
});
