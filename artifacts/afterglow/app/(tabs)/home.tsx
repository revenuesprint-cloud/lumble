import { useApp } from "@/context/AppContext";
import { getAstrologyReading, RASHIS } from "@/utils/astrology";
import {
  getDailyEnergyPersonalized,
  getPersonalizedFocus,
  getPersonalizedQuoteCategory,
  getPersonalizedHero,
  getTodayBetweenYou,
} from "@/utils/personalization";
import { getQuoteByCategory } from "@/utils/quotes";
import { fetchDailyContent, getContentBundle, type DailyContent } from "@/utils/dbContent";
import { MOON_PROFILES_DEEP } from "@/utils/content-library";
import { extractKundliAttributes } from "@/utils/challenges";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Platform,
  Easing,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ─── DB-first resolver ────────────────────────────────────────────────────────

function resolveMoonProfile(rashiIdx: number) {
  const local = MOON_PROFILES_DEEP[rashiIdx] ?? MOON_PROFILES_DEEP[0];
  try {
    const b = getContentBundle();
    const item = b?.moonProfiles?.find((i: any) => i?.meta?.moonRashiIdx === rashiIdx);
    if (item?.meta?.insight) return item.meta;
  } catch {}
  return local;
}

// ─── Profile Teaser Card ──────────────────────────────────────────────────────

function ProfileTeaserCard({
  label, moonSignName, moonElement, moonColor, oneLiner, onPress,
}: {
  label: string; moonSignName: string;
  moonElement: string; moonColor: string; oneLiner: string; onPress: () => void;
}) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 200, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();
  }, []);

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        <View style={ptStyles.card}>
          <View style={[ptStyles.accentBar, { backgroundColor: moonColor }]} />
          <View style={ptStyles.content}>
            <View style={ptStyles.topRow}>
              <View style={[ptStyles.iconCircle, { backgroundColor: moonColor + "18" }]}>
                <Text style={[ptStyles.iconGlyph, { color: moonColor }]}>☽</Text>
              </View>
              <Text style={ptStyles.label}>{label}</Text>
              <Feather name="chevron-right" size={14} color="#D1D5DB" />
            </View>
            <Text style={ptStyles.title}>{moonSignName}</Text>
            <View style={ptStyles.tagsRow}>
              <View style={ptStyles.tag}>
                <Text style={ptStyles.tagText}>{moonElement}</Text>
              </View>
              <View style={[ptStyles.tag, { backgroundColor: moonColor + "12", borderColor: moonColor + "30" }]}>
                <Text style={[ptStyles.tagText, { color: moonColor }]}>Moon sign</Text>
              </View>
            </View>
            <Text style={ptStyles.preview} numberOfLines={2}>{oneLiner}</Text>
            <View style={ptStyles.footer}>
              <View style={[ptStyles.ctaBtn, { backgroundColor: moonColor + "10", borderColor: moonColor + "30" }]}>
                <Text style={[ptStyles.ctaBtnText, { color: moonColor }]}>See full profile</Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const ptStyles = StyleSheet.create({
  card:       { backgroundColor: "#FFFFFF", borderRadius: 20, borderWidth: 1, borderColor: "#E5E7EB",
                flexDirection: "row", overflow: "hidden",
                shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 3 },
  accentBar:  { width: 4 },
  content:    { flex: 1, padding: 18, gap: 12 },
  topRow:     { flexDirection: "row", alignItems: "center", gap: 10 },
  iconCircle: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  iconGlyph:  { fontSize: 15 },
  label:      { flex: 1, fontSize: 12, fontFamily: "Nunito_500Medium", color: "#9CA3AF" },
  title:      { fontSize: 22, fontFamily: "Nunito_700Bold", color: "#111827", lineHeight: 28 },
  tagsRow:    { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  tag:        { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, borderWidth: 1,
                borderColor: "#E5E7EB", backgroundColor: "#F9FAFB" },
  tagText:    { fontSize: 12, fontFamily: "Nunito_500Medium", color: "#6B7280" },
  preview:    { fontSize: 14, fontFamily: "Nunito_400Regular", color: "#6B7280", lineHeight: 21, fontStyle: "italic" },
  footer:     { flexDirection: "row", justifyContent: "flex-end" },
  ctaBtn:     { paddingHorizontal: 16, paddingVertical: 7, borderRadius: 24, borderWidth: 1 },
  ctaBtnText: { fontSize: 12, fontFamily: "Nunito_600SemiBold" },
});

// ─── Interaction Teaser Card ──────────────────────────────────────────────────

function InteractionTeaserCard({
  userName, partnerName, userElement, partnerElement,
  userMoonColor, partnerMoonColor, gunaTotal, onPress,
}: {
  userName: string; partnerName: string; userElement: string; partnerElement: string;
  userMoonColor: string; partnerMoonColor: string; gunaTotal: number; onPress: () => void;
}) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 200, delay: 60, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();
  }, []);

  const pct     = Math.round((gunaTotal / 36) * 100);
  const color   = gunaTotal >= 28 ? "#10B981" : gunaTotal >= 21 ? "#F59E0B" : "#F43F5E";
  const colorBg = gunaTotal >= 28 ? "#ECFDF5" : gunaTotal >= 21 ? "#FFFBEB" : "#FFF1F2";
  const verdict = gunaTotal >= 28 ? "strong match" : gunaTotal >= 21 ? "good foundation" : gunaTotal >= 18 ? "workable" : "challenging";

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.82}>
        <View style={itStyles.card}>
          <View style={itStyles.topRow}>
            <View style={itStyles.iconCircle}>
              <Text style={itStyles.iconGlyph}>♡</Text>
            </View>
            <Text style={itStyles.label}>Compatibility</Text>
            <View style={[itStyles.scorePill, { backgroundColor: colorBg, borderColor: color + "44" }]}>
              <Text style={[itStyles.scoreText, { color }]}>{pct}% · {verdict}</Text>
            </View>
          </View>
          <Text style={itStyles.title}>{userName} & {partnerName}</Text>
          <View style={itStyles.tagsRow}>
            <View style={[itStyles.tag, { backgroundColor: userMoonColor + "10", borderColor: userMoonColor + "30" }]}>
              <Text style={[itStyles.tagText, { color: userMoonColor }]}>{userName} · {userElement}</Text>
            </View>
            <View style={[itStyles.tag, { backgroundColor: partnerMoonColor + "10", borderColor: partnerMoonColor + "30" }]}>
              <Text style={[itStyles.tagText, { color: partnerMoonColor }]}>{partnerName} · {partnerElement}</Text>
            </View>
          </View>
          <View style={itStyles.footer}>
            <Text style={[itStyles.verdictLabel, { color }]}>{verdict}</Text>
            <View style={itStyles.ctaBtn}>
              <Text style={itStyles.ctaBtnText}>Full breakdown</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const itStyles = StyleSheet.create({
  card:       { backgroundColor: "#FFFFFF", borderRadius: 20, borderWidth: 1, borderColor: "#E5E7EB",
                padding: 18, gap: 13, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 3 },
  topRow:     { flexDirection: "row", alignItems: "center", gap: 10 },
  iconCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#EEF2FF", alignItems: "center", justifyContent: "center" },
  iconGlyph:  { fontSize: 15, color: "#5B4CE8" },
  label:      { flex: 1, fontSize: 12, fontFamily: "Nunito_500Medium", color: "#9CA3AF" },
  scorePill:  { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, borderWidth: 1 },
  scoreText:  { fontSize: 11, fontFamily: "Nunito_700Bold" },
  title:      { fontSize: 22, fontFamily: "Nunito_700Bold", color: "#111827" },
  tagsRow:    { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  tag:        { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, borderWidth: 1 },
  tagText:    { fontSize: 12, fontFamily: "Nunito_500Medium" },
  footer:     { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  verdictLabel:{ fontSize: 14, fontFamily: "Nunito_600SemiBold" },
  ctaBtn:     { paddingHorizontal: 16, paddingVertical: 7, borderRadius: 24, borderWidth: 1,
                borderColor: "#E5E7EB", backgroundColor: "#F9FAFB" },
  ctaBtnText: { fontSize: 13, fontFamily: "Nunito_600SemiBold", color: "#374151" },
});

// ─── Right Now Card ───────────────────────────────────────────────────────────

function RightNowCard({ userMoment, partnerSignal, userName, partnerName }:
  { userMoment: string; partnerSignal: string; userName: string; partnerName: string }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => { Animated.timing(fadeAnim, { toValue: 1, duration: 250, delay: 80, easing: Easing.out(Easing.quad), useNativeDriver: true }).start(); }, []);
  return (
    <Animated.View style={[rnStyles.card, { opacity: fadeAnim }]}>
      <View style={rnStyles.header}>
        <View style={rnStyles.livePip} />
        <Text style={rnStyles.headerLabel}>Right now</Text>
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
  card:        { backgroundColor: "#FFFFFF", borderRadius: 20, borderWidth: 1, borderColor: "#E5E7EB", padding: 20, gap: 14,
                 shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 3 },
  header:      { flexDirection: "row", alignItems: "center", gap: 7 },
  livePip:     { width: 7, height: 7, borderRadius: 4, backgroundColor: "#5B4CE8" },
  headerLabel: { fontSize: 11, fontFamily: "Nunito_600SemiBold", color: "#5B4CE8", textTransform: "uppercase", letterSpacing: 0.5 },
  section:     { gap: 5 },
  personLabel: { fontSize: 12, fontFamily: "Nunito_600SemiBold", color: "#9CA3AF" },
  body:        { fontSize: 15, fontFamily: "Nunito_400Regular", color: "#374151", lineHeight: 24 },
  divider:     { height: 1, backgroundColor: "#F3F4F6" },
});

// ─── Energy Bar ───────────────────────────────────────────────────────────────

function EnergyBar({ label, value, color, delay }: { label: string; value: number; color: string; delay: number }) {
  const widthAnim   = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const [displayVal, setDisplayVal] = useState(0);

  useEffect(() => {
    const listenerId = widthAnim.addListener(({ value: v }) => setDisplayVal(Math.round(v)));
    Animated.parallel([
      Animated.timing(opacityAnim, { toValue: 1, duration: 220, delay, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.timing(widthAnim,   { toValue: value, duration: 520, delay, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
    ]).start();
    return () => widthAnim.removeListener(listenerId);
  }, [value, delay]);

  const w = widthAnim.interpolate({ inputRange: [0, 100], outputRange: ["0%", "100%"], extrapolate: "clamp" });

  return (
    <Animated.View style={{ opacity: opacityAnim, gap: 6 }}>
      <View style={styles.barLabelRow}>
        <Text style={styles.barLabel}>{label}</Text>
        <Text style={[styles.barValue, { color }]}>{displayVal}</Text>
      </View>
      <View style={styles.barTrack}>
        <Animated.View style={{ width: w, height: "100%", overflow: "hidden", borderRadius: 6 }}>
          <LinearGradient colors={[color + "88", color]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ flex: 1 }} />
        </Animated.View>
      </View>
    </Animated.View>
  );
}

// ─── Home Screen ──────────────────────────────────────────────────────────────

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
    fetchDailyContent(tags).then((d) => { if (d) setDbContent(d); });
  }, [reading]);

  if (!user || !partner || !reading) return null;

  const uRashi = RASHIS[reading.user.moonRashi];
  const pRashi = RASHIS[reading.partner.moonRashi];
  const uMP    = resolveMoonProfile(reading.user.moonRashi);
  const pMP    = resolveMoonProfile(reading.partner.moonRashi);

  const energy     = getDailyEnergyPersonalized(reading, reading.user.dasha.current);
  const qCat       = getPersonalizedQuoteCategory(reading.user.moonRashi, reading.user.dasha.current);
  const today      = new Date();
  const qSeed      = today.getFullYear() * 366 + today.getMonth() * 31 + today.getDate();
  const localQuote = getQuoteByCategory(qCat, qSeed + reading.user.nakshatra);
  const dailyFocus = getPersonalizedFocus(user.name, reading.user.moonRashi, reading.user.dasha.current, partner.relationshipType);
  const quoteText  = dbContent?.quote?.body ?? `"${localQuote.text}"`;
  const quoteAuthor = dbContent?.quote?.meta?.author as string | undefined ?? localQuote.author;
  const quoteLabel  = (dbContent?.quote?.meta?.category as string | undefined) ?? localQuote.category;
  const dailyMsg   = dbContent?.message?.body ?? null;

  const hero     = getPersonalizedHero(user.name, partner.name, reading, partner.relationshipType);
  const rightNow = getTodayBetweenYou(reading, partner.relationshipType, user.name, partner.name);

  const hour     = new Date().getHours();
  const greeting = hour < 12 ? "Good morning," : hour < 18 ? "Good afternoon," : "Good evening,";

  const energyBars = [
    { label: "❤️  Affection",     value: energy.closeness,    color: "#F43F5E" },
    { label: "🗣️  Communication",  value: energy.communication, color: "#5B4CE8" },
    { label: "🤝  Trust",          value: energy.trust,         color: "#10B981" },
    { label: "⚡  Attraction",     value: energy.attraction,    color: "#F59E0B" },
    { label: "😊  Positivity",     value: energy.positivity,    color: "#8B5CF6" },
  ];

  const haptic = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

  return (
    <View style={{ flex: 1, backgroundColor: "#F4F5F7" }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={Platform.OS === "web" ? { maxWidth: 640, alignSelf: "center", width: "100%" } : undefined}
        contentContainerStyle={[styles.scroll, {
          paddingTop: insets.top + (Platform.OS === "web" ? 67 : 20),
          paddingBottom: insets.bottom + 100,
        }]}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{greeting}</Text>
            <Text style={styles.userName}>{user.name}</Text>
          </View>
          <TouchableOpacity
            onPress={() => { haptic(); router.push("/profile"); }}
            activeOpacity={0.75}
            style={styles.profileBtn}
          >
            <LinearGradient colors={["#5B4CE8", "#8B5CF6"]} style={styles.profileBtnGradient}>
              <Text style={styles.profileBtnInitial}>{user.name.charAt(0) || "?"}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* About You */}
        <ProfileTeaserCard
          label="What we can tell about you"
          moonSignName={uRashi.en}
          moonElement={uRashi.element}
          moonColor={uRashi.color}
          oneLiner={`"${uMP.insight || uMP.needsToHear || "Your moon sign shapes how you love and attach."}"`}
          onPress={() => { haptic(); router.push({ pathname: "/profile-detail", params: { person: "user" } }); }}
        />

        {/* About Partner */}
        <ProfileTeaserCard
          label={`What we can tell about ${partner.name}`}
          moonSignName={pRashi.en}
          moonElement={pRashi.element}
          moonColor={pRashi.color}
          oneLiner={`"${pMP.insight || pMP.needsToHear || "Their moon sign shapes how they receive love."}"`}
          onPress={() => { haptic(); router.push({ pathname: "/profile-detail", params: { person: "partner" } }); }}
        />

        {/* Compatibility */}
        <InteractionTeaserCard
          userName={user.name}
          partnerName={partner.name}
          userElement={uRashi.element}
          partnerElement={pRashi.element}
          userMoonColor={uRashi.color}
          partnerMoonColor={pRashi.color}
          gunaTotal={reading.guna.total}
          onPress={() => { haptic(); router.push("/(tabs)/compatibility"); }}
        />

        {/* Today's Read */}
        <TouchableOpacity
          onPress={() => { haptic(); router.push({ pathname: "/reading-detail", params: { headline: hero.headline, insight: hero.insight, action: hero.action, moonTag: hero.moonTag } }); }}
          activeOpacity={0.85}
        >
          <View style={styles.heroCard}>
            <View style={styles.heroTopRow}>
              <View style={styles.heroMoonTag}>
                <Text style={styles.heroMoonTagText}>{hero.moonTag}</Text>
              </View>
              <Feather name="chevron-right" size={14} color="#9CA3AF" />
            </View>
            <Text style={styles.heroHeadline}>{hero.headline}</Text>
            <Text style={styles.heroInsight} numberOfLines={3}>{hero.insight}</Text>
            <View style={styles.heroDivider} />
            <View style={styles.heroActionRow}>
              <Feather name="sun" size={13} color="#F59E0B" />
              <Text style={styles.heroActionText}>{hero.action}</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Right Now */}
        <RightNowCard
          userMoment={rightNow.userMoment}
          partnerSignal={rightNow.partnerSignal}
          userName={user.name}
          partnerName={partner.name}
        />

        {/* Quote + Focus */}
        <View style={styles.quoteCard}>
          <View style={styles.quoteTopRow}>
            <Text style={styles.quoteCat}>
              {quoteLabel === "self" ? "self-worth" : quoteLabel === "communication" ? "honesty"
                : quoteLabel === "intuition" ? "inner knowing" : quoteLabel === "patience" ? "timing"
                : quoteLabel === "healing" ? "healing" : quoteLabel ?? "reflection"}
            </Text>
            <Text style={styles.quoteStar}>✦</Text>
          </View>
          <Text style={styles.quoteText}>{quoteText.startsWith('"') ? quoteText : `"${quoteText}"`}</Text>
          {quoteAuthor ? <Text style={styles.quoteAuthor}>— {quoteAuthor}</Text> : null}
          <View style={styles.quoteDivider} />
          <View style={styles.focusRow}>
            <Feather name="sun" size={13} color="#F59E0B" />
            <Text style={styles.focusText}>{dailyMsg ?? dailyFocus}</Text>
          </View>
        </View>

        {/* Energy Today */}
        <TouchableOpacity
          onPress={() => { haptic(); router.push({ pathname: "/energy-detail" }); }}
          activeOpacity={0.85}
        >
          <View style={styles.dailyCard}>
            <View style={styles.dailyHeader}>
              <Text style={styles.dailyTitle}>Your energy today</Text>
              <View style={styles.dailyHeaderRight}>
                <Text style={styles.dailyDate}>{energy.date}</Text>
                <Feather name="chevron-right" size={14} color="#9CA3AF" />
              </View>
            </View>
            <Text style={styles.dailyMessage}>"{energy.message}"</Text>
            <Text style={styles.withText}>with {partner.name}</Text>
            <View style={styles.barsContainer}>
              {energyBars.map((bar, i) => (
                <EnergyBar key={bar.label} {...bar} delay={i * 80} />
              ))}
            </View>
          </View>
        </TouchableOpacity>

        {/* Guidance teaser */}
        <TouchableOpacity
          onPress={() => { haptic(); router.push("/(tabs)/guidance"); }}
          activeOpacity={0.8}
          style={styles.guidanceTeaser}
        >
          <Text style={styles.guidanceTeaserTitle}>The question you keep not asking</Text>
          <Text style={styles.guidanceTeaserSub}>Say it out loud. Get an honest answer.</Text>
          <View style={styles.guidanceSuggestions}>
            {[
              partner.relationshipType === "ex"             ? "Do they actually miss me or just the comfort?"
              : partner.relationshipType === "situationship" ? "Why am I always the one who wants more?"
              : partner.relationshipType === "crush"         ? "Am I misreading this or do they feel it too?"
              : "Why do I feel like I care more than they do?",
              partner.relationshipType === "ex"             ? "Why can I not let go even when I know I should?"
              : partner.relationshipType === "situationship" ? "Am I just convenient for them right now?"
              : partner.relationshipType === "crush"         ? "What if I say something and it ruins everything?"
              : "Do they actually want to be with me?",
            ].map((q, i) => (
              <TouchableOpacity
                key={i}
                onPress={(e) => { e.stopPropagation?.(); haptic(); router.push({ pathname: "/(tabs)/guidance", params: { autoSend: q } }); }}
                activeOpacity={0.75}
                style={styles.suggestionChip}
              >
                <Text style={styles.suggestionText}>{q}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll:              { paddingHorizontal: 20, gap: 14 },
  header:              { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 },
  profileBtn:          { borderRadius: 22, overflow: "hidden" },
  profileBtnGradient:  { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  profileBtnInitial:   { fontSize: 18, fontFamily: "Nunito_700Bold", color: "#fff" },
  greeting:            { fontSize: 14, fontFamily: "Nunito_400Regular", color: "#9CA3AF" },
  userName:            { fontSize: 30, fontFamily: "Nunito_700Bold", color: "#111827" },

  heroCard:            { backgroundColor: "#FFFFFF", borderRadius: 20, borderWidth: 1, borderColor: "#E5E7EB", padding: 22, gap: 13,
                         shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 3 },
  heroTopRow:          { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  heroMoonTag:         { backgroundColor: "#EEF2FF", borderWidth: 1, borderColor: "#C7D2FE", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 },
  heroMoonTagText:     { fontSize: 12, fontFamily: "Nunito_600SemiBold", color: "#5B4CE8" },
  heroHeadline:        { fontSize: 22, fontFamily: "Nunito_700Bold", color: "#111827", lineHeight: 30 },
  heroInsight:         { fontSize: 15, fontFamily: "Nunito_400Regular", color: "#374151", lineHeight: 24 },
  heroDivider:         { height: 1, backgroundColor: "#F3F4F6" },
  heroActionRow:       { flexDirection: "row", alignItems: "flex-start", gap: 8 },
  heroActionText:      { flex: 1, fontSize: 14, fontFamily: "Nunito_600SemiBold", color: "#D97706", lineHeight: 21 },

  quoteCard:           { backgroundColor: "#FFFFFF", borderRadius: 20, borderWidth: 1, borderColor: "#E5E7EB", padding: 22, gap: 13,
                         shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 3 },
  quoteTopRow:         { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  quoteCat:            { fontSize: 11, fontFamily: "Nunito_700Bold", color: "#5B4CE8", textTransform: "uppercase", letterSpacing: 0.8 },
  quoteStar:           { fontSize: 14, color: "#C7D2FE" },
  quoteText:           { fontSize: 18, fontFamily: "Nunito_400Regular", color: "#111827", lineHeight: 28, fontStyle: "italic" },
  quoteAuthor:         { fontSize: 13, fontFamily: "Nunito_500Medium", color: "#9CA3AF" },
  quoteDivider:        { height: 1, backgroundColor: "#F3F4F6" },
  focusRow:            { flexDirection: "row", alignItems: "flex-start", gap: 8 },
  focusText:           { flex: 1, fontSize: 14, fontFamily: "Nunito_400Regular", color: "#6B7280", lineHeight: 22 },

  dailyCard:           { backgroundColor: "#FFFFFF", borderRadius: 20, borderWidth: 1, borderColor: "#E5E7EB", padding: 22, gap: 13,
                         shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 3 },
  dailyHeader:         { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  dailyHeaderRight:    { flexDirection: "row", alignItems: "center", gap: 6 },
  dailyTitle:          { fontSize: 13, fontFamily: "Nunito_700Bold", color: "#6B7280" },
  dailyDate:           { fontSize: 12, fontFamily: "Nunito_400Regular", color: "#9CA3AF" },
  dailyMessage:        { fontSize: 16, fontFamily: "Nunito_400Regular", color: "#374151", lineHeight: 25, fontStyle: "italic" },
  withText:            { fontSize: 13, fontFamily: "Nunito_500Medium", color: "#9CA3AF" },
  barsContainer:       { gap: 12, marginTop: 2 },
  barLabelRow:         { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  barLabel:            { fontSize: 13, fontFamily: "Nunito_500Medium", color: "#6B7280" },
  barValue:            { fontSize: 12, fontFamily: "Nunito_700Bold" },
  barTrack:            { height: 8, backgroundColor: "#F3F4F6", borderRadius: 6, overflow: "hidden" },

  guidanceTeaser:      { backgroundColor: "#FFFFFF", borderRadius: 20, borderWidth: 1, borderColor: "#C7D2FE", padding: 22, gap: 10,
                         shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 3 },
  guidanceTeaserTitle: { fontSize: 20, fontFamily: "Nunito_700Bold", color: "#111827", lineHeight: 27 },
  guidanceTeaserSub:   { fontSize: 14, fontFamily: "Nunito_400Regular", color: "#6B7280" },
  guidanceSuggestions: { flexDirection: "row", gap: 8, marginTop: 6, flexWrap: "wrap" },
  suggestionChip:      { borderWidth: 1, borderColor: "#C7D2FE", borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, backgroundColor: "#EEF2FF" },
  suggestionText:      { fontSize: 13, fontFamily: "Nunito_500Medium", color: "#5B4CE8" },
});
