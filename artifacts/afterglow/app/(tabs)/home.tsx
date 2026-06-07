import { GlowCard } from "@/components/GlowCard";
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
import {
  MOON_PROFILES_DEEP,
  NAKSHATRA_PROFILES,
  DASHA_CHAPTERS,
  KOOTA_NARRATIVES,
} from "@/utils/content-library";
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

// ─── DB-first resolvers ───────────────────────────────────────────────────────

function resolveMoonProfile(rashiIdx: number) {
  const b = getContentBundle();
  if (b?.moonProfiles?.length) {
    const item = b.moonProfiles.find((i) => (i.meta as any)?.moonRashiIdx === rashiIdx);
    if (item) return item.meta as any;
  }
  return MOON_PROFILES_DEEP[rashiIdx] ?? MOON_PROFILES_DEEP[0];
}

function resolveNakProfile(nakIdx: number) {
  const b = getContentBundle();
  if (b?.nakshatraProfiles?.length) {
    const item = b.nakshatraProfiles.find((i) => (i.meta as any)?.nakshatraIdx === nakIdx);
    if (item) return item.meta as any;
  }
  return NAKSHATRA_PROFILES[nakIdx] ?? NAKSHATRA_PROFILES[0];
}

function resolveKoota(name: string) {
  const b = getContentBundle();
  if (b?.kootaNarratives?.length) {
    const item = b.kootaNarratives.find((i) => (i.meta as any)?.kootaName === name);
    if (item) return item.meta as any;
  }
  return KOOTA_NARRATIVES[name];
}


// ─── Teaser: Profile Snippet Card ─────────────────────────────────────────────

function ProfileTeaserCard({
  label, name, moonSignName, moonElement, moonColor, oneLiner, onPress,
}: {
  label: string; name: string; moonSignName: string;
  moonElement: string; moonColor: string; oneLiner: string; onPress: () => void;
}) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 450, useNativeDriver: true }).start();
  }, []);

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.82}>
        <View style={[ptStyles.card, { borderColor: moonColor + "28" }]}>
          <LinearGradient colors={[moonColor + "10", "transparent"]} style={ptStyles.inner}>
            <View style={ptStyles.topRow}>
              <Text style={ptStyles.label}>{label}</Text>
              <View style={[ptStyles.chip, { backgroundColor: moonColor + "18", borderColor: moonColor + "44" }]}>
                <Text style={[ptStyles.chipText, { color: moonColor }]}>{moonSignName} · {moonElement}</Text>
              </View>
            </View>
            <Text style={ptStyles.oneLiner} numberOfLines={3}>{oneLiner}</Text>
            <View style={ptStyles.cta}>
              <Text style={[ptStyles.ctaText, { color: moonColor }]}>See what we know about {name}</Text>
              <Feather name="arrow-right" size={13} color={moonColor} />
            </View>
          </LinearGradient>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const ptStyles = StyleSheet.create({
  card:     { borderRadius: 20, borderWidth: 1, overflow: "hidden" },
  inner:    { padding: 20, gap: 12 },
  topRow:   { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 10 },
  label:    { fontSize: 12, fontFamily: "Nunito_500Medium", color: "rgba(240,235,248,0.4)", flex: 1 },
  chip:     { borderRadius: 20, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 4, flexShrink: 0 },
  chipText: { fontSize: 11, fontFamily: "Nunito_600SemiBold" },
  oneLiner: { fontSize: 15, fontFamily: "Nunito_400Regular", color: "rgba(240,235,248,0.82)", lineHeight: 23, fontStyle: "italic" },
  cta:      { flexDirection: "row", alignItems: "center", gap: 5 },
  ctaText:  { fontSize: 12, fontFamily: "Nunito_600SemiBold" },
});

// ─── Teaser: Interaction Snippet Card ─────────────────────────────────────────

function InteractionTeaserCard({
  userName, partnerName, userElement, partnerElement,
  userMoonColor, partnerMoonColor, gunaTotal, onPress,
}: {
  userName: string; partnerName: string; userElement: string; partnerElement: string;
  userMoonColor: string; partnerMoonColor: string; gunaTotal: number; onPress: () => void;
}) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 450, delay: 100, useNativeDriver: true }).start();
  }, []);

  const pct     = Math.round((gunaTotal / 36) * 100);
  const color   = gunaTotal >= 28 ? "#52C8B8" : gunaTotal >= 21 ? "#F5A623" : "#E85C7A";
  const verdict = gunaTotal >= 28 ? "strong match" : gunaTotal >= 21 ? "good foundation" : gunaTotal >= 18 ? "workable" : "challenging";

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.82}>
        <View style={[itStyles.card, { borderColor: "rgba(124,82,200,0.22)" }]}>
          <LinearGradient colors={["rgba(124,82,200,0.1)","transparent"]} style={itStyles.inner}>
            <View style={itStyles.topRow}>
              <Text style={itStyles.label}>How you both interact</Text>
              <View style={[itStyles.scorePill, { backgroundColor: color + "18", borderColor: color + "44" }]}>
                <Text style={[itStyles.scoreText, { color }]}>{pct}% · {verdict}</Text>
              </View>
            </View>
            <View style={itStyles.elemRow}>
              <View style={[itStyles.elemChip, { backgroundColor: userMoonColor + "15", borderColor: userMoonColor + "33" }]}>
                <Text style={[itStyles.elemName, { color: userMoonColor }]}>{userName}</Text>
                <Text style={[itStyles.elemEl,   { color: userMoonColor + "AA" }]}>{userElement}</Text>
              </View>
              <Text style={itStyles.arrow}>⟷</Text>
              <View style={[itStyles.elemChip, { backgroundColor: partnerMoonColor + "15", borderColor: partnerMoonColor + "33" }]}>
                <Text style={[itStyles.elemName, { color: partnerMoonColor }]}>{partnerName}</Text>
                <Text style={[itStyles.elemEl,   { color: partnerMoonColor + "AA" }]}>{partnerElement}</Text>
              </View>
            </View>
            <View style={itStyles.cta}>
              <Text style={itStyles.ctaText}>See the full breakdown</Text>
              <Feather name="arrow-right" size={13} color="#7C52C8" />
            </View>
          </LinearGradient>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const itStyles = StyleSheet.create({
  card:       { borderRadius: 20, borderWidth: 1, overflow: "hidden" },
  inner:      { padding: 20, gap: 14 },
  topRow:     { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 10 },
  label:      { fontSize: 12, fontFamily: "Nunito_500Medium", color: "rgba(240,235,248,0.4)" },
  scorePill:  { borderRadius: 20, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 4 },
  scoreText:  { fontSize: 11, fontFamily: "Nunito_600SemiBold" },
  elemRow:    { flexDirection: "row", alignItems: "center", gap: 8 },
  elemChip:   { flex: 1, borderRadius: 12, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 10, alignItems: "center", gap: 2 },
  elemName:   { fontSize: 13, fontFamily: "Nunito_700Bold" },
  elemEl:     { fontSize: 11, fontFamily: "Nunito_400Regular" },
  arrow:      { fontSize: 18, color: "rgba(240,235,248,0.2)" },
  cta:        { flexDirection: "row", alignItems: "center", gap: 5 },
  ctaText:    { fontSize: 12, fontFamily: "Nunito_600SemiBold", color: "#7C52C8" },
});

// ─── Right Now Card ───────────────────────────────────────────────────────────

function RightNowCard({ userMoment, partnerSignal, userName, partnerName }:
  { userMoment:string; partnerSignal:string; userName:string; partnerName:string }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => { Animated.timing(fadeAnim, { toValue:1, duration:600, delay:200, useNativeDriver:true }).start(); }, []);
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
  card:        { backgroundColor: "#0C0A18", borderRadius: 20, borderWidth: 1, borderColor: "rgba(240,235,248,0.07)", padding: 20, gap: 14 },
  header:      { flexDirection: "row", alignItems: "center", gap: 7 },
  livePip:     { width: 7, height: 7, borderRadius: 4, backgroundColor: "#E85C7A" },
  headerLabel: { fontSize: 11, fontFamily: "Nunito_600SemiBold", color: "rgba(232,92,122,0.7)" },
  section:     { gap: 6 },
  personLabel: { fontSize: 12, fontFamily: "Nunito_600SemiBold", color: "rgba(240,235,248,0.4)" },
  body:        { fontSize: 15, fontFamily: "Nunito_400Regular", color: "rgba(240,235,248,0.82)", lineHeight: 24 },
  divider:     { height: 1, backgroundColor: "rgba(240,235,248,0.06)" },
});

// ─── Energy Bar ───────────────────────────────────────────────────────────────

function EnergyBar({ label, value, color, delay }: { label:string; value:number; color:string; delay:number }) {
  const widthAnim   = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacityAnim, { toValue:1, duration:400, delay, useNativeDriver:true }),
      Animated.timing(widthAnim,   { toValue:value, duration:900, delay, useNativeDriver:false }),
    ]).start();
  }, []);
  const w = widthAnim.interpolate({ inputRange:[0,100], outputRange:["0%","100%"], extrapolate:"clamp" });
  return (
    <Animated.View style={{ opacity: opacityAnim, gap: 5 }}>
      <Text style={styles.barLabel}>{label}</Text>
      <View style={styles.barTrack}>
        <Animated.View style={{ width:w, height:"100%", overflow:"hidden", borderRadius:4 }}>
          <LinearGradient colors={[color+"AA",color]} start={{x:0,y:0}} end={{x:1,y:0}} style={{ flex:1 }} />
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
    const tags = Object.entries(attrs).map(([k,v]) => `${k}:${v}`).filter(Boolean);
    fetchDailyContent(tags).then((d) => { if (d) setDbContent(d); });
  }, [reading]);

  if (!user || !partner || !reading) return null;

  // ── Kundli data ─────────────────────────────────────────────────────────
  const uRashi = RASHIS[reading.user.moonRashi];
  const pRashi = RASHIS[reading.partner.moonRashi];
  const uMP    = resolveMoonProfile(reading.user.moonRashi);
  const pMP    = resolveMoonProfile(reading.partner.moonRashi);

  // Top/bottom koota for the teaser score
  const sorted   = [...reading.guna.breakdown].sort((a,b) => (b.score/b.max)-(a.score/a.max));

  // ── Daily content ────────────────────────────────────────────────────────
  const energy     = getDailyEnergyPersonalized(reading, reading.user.dasha.current);
  const qCat       = getPersonalizedQuoteCategory(reading.user.moonRashi, reading.user.dasha.current);
  const today      = new Date();
  const qSeed      = today.getFullYear() * 366 + today.getMonth() * 31 + today.getDate();
  const localQuote = getQuoteByCategory(qCat, qSeed + reading.user.nakshatra);
  const dailyFocus = getPersonalizedFocus(user.name, reading.user.moonRashi, reading.user.dasha.current, partner.relationshipType);
  const quoteText  = dbContent?.quote?.body ?? `"${localQuote.text}"`;
  const quoteAuthor= dbContent?.quote?.meta?.author as string | undefined ?? localQuote.author;
  const quoteLabel = (dbContent?.quote?.meta?.category as string | undefined) ?? localQuote.category;
  const dailyMsg   = dbContent?.message?.body ?? null;

  const hero     = getPersonalizedHero(user.name, partner.name, reading, partner.relationshipType);
  const rightNow = getTodayBetweenYou(reading, partner.relationshipType, user.name, partner.name);

  const hour    = new Date().getHours();
  const greeting = hour < 12 ? "Good morning," : hour < 18 ? "Good afternoon," : "Good evening,";

  const energyBars = [
    { label:"❤️  Affection",     value:energy.closeness,    color:"#E85C7A" },
    { label:"🗣️  Communication",  value:energy.communication, color:"#7C52C8" },
    { label:"🤝  Trust",          value:energy.trust,         color:"#52C8B8" },
    { label:"⚡  Attraction",     value:energy.attraction,    color:"#F5A623" },
    { label:"😊  Positivity",     value:energy.positivity,    color:"#B855E0" },
  ];

  const haptic = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

  return (
    <LinearGradient colors={["#080611","#0D0A1E"]} style={{ flex:1 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={Platform.OS === "web" ? { maxWidth:640, alignSelf:"center", width:"100%" } : undefined}
        contentContainerStyle={[styles.scroll, {
          paddingTop: insets.top + (Platform.OS === "web" ? 67 : 16),
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
            <LinearGradient colors={["#E85C7A","#B855E0"]} style={styles.profileBtnGradient}>
              <Text style={styles.profileBtnInitial}>{user.name.charAt(0) || "?"}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* ─── About You ─────────────────────────────────────────────────── */}
        <ProfileTeaserCard
          label="What we can tell about you"
          name={user.name}
          moonSignName={uRashi.en}
          moonElement={uRashi.element}
          moonColor={uRashi.color}
          oneLiner={`"${uMP.insight ?? ""}"`}
          onPress={() => { haptic(); router.push({ pathname:"/profile-detail", params:{ person:"user" } }); }}
        />

        {/* ─── About Partner ──────────────────────────────────────────────── */}
        <ProfileTeaserCard
          label={`What we can tell about ${partner.name}`}
          name={partner.name}
          moonSignName={pRashi.en}
          moonElement={pRashi.element}
          moonColor={pRashi.color}
          oneLiner={`"${pMP.insight ?? ""}"`}
          onPress={() => { haptic(); router.push({ pathname:"/profile-detail", params:{ person:"partner" } }); }}
        />

        {/* ─── Interaction ───────────────────────────────────────────────── */}
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

        {/* ─── Today's Read ──────────────────────────────────────────────── */}
        <TouchableOpacity
          onPress={() => { haptic(); router.push({ pathname:"/reading-detail", params:{ headline: hero.headline, insight: hero.insight, action: hero.action, moonTag: hero.moonTag } }); }}
          activeOpacity={0.85}
        >
          <GlowCard style={styles.heroCard} glowColor="rgba(232,92,122,0.18)">
            <LinearGradient colors={["#1E0D2B","#110F1E"]} style={styles.heroInner}>
              <View style={styles.heroTopRow}>
                <View style={styles.heroMoonTag}>
                  <Text style={styles.heroMoonTagText}>{hero.moonTag}</Text>
                </View>
                <Feather name="chevron-right" size={14} color="rgba(232,92,122,0.5)" />
              </View>
              <Text style={styles.heroHeadline}>{hero.headline}</Text>
              <Text style={styles.heroInsight} numberOfLines={3}>{hero.insight}</Text>
              <View style={styles.heroDivider} />
              <View style={styles.heroActionRow}>
                <Feather name="sun" size={13} color="#F5A623" />
                <Text style={styles.heroActionText}>{hero.action}</Text>
              </View>
            </LinearGradient>
          </GlowCard>
        </TouchableOpacity>

        {/* ─── Right Now ─────────────────────────────────────────────────── */}
        <RightNowCard
          userMoment={rightNow.userMoment}
          partnerSignal={rightNow.partnerSignal}
          userName={user.name}
          partnerName={partner.name}
        />

        {/* ─── Quote + Focus ─────────────────────────────────────────────── */}
        <GlowCard style={styles.quoteCard} glowColor="rgba(184,85,224,0.15)">
          <LinearGradient colors={["#1A1035","#110F1E"]} style={styles.quoteInner}>
            <View style={styles.quoteTopRow}>
              <Text style={styles.quoteCat}>
                {quoteLabel === "self" ? "self-worth" : quoteLabel === "communication" ? "honesty"
                  : quoteLabel === "intuition" ? "inner knowing" : quoteLabel === "patience" ? "timing"
                  : quoteLabel === "healing" ? "healing" : quoteLabel ?? "reflection"}
              </Text>
              <Text style={styles.quoteStar}>✦</Text>
            </View>
            <Text style={styles.quoteText}>{quoteText.startsWith('"') ? quoteText : `"${quoteText}"`}</Text>
            {quoteAuthor ? <Text style={styles.quoteAuthor}>by {quoteAuthor}</Text> : null}
            <View style={styles.quoteDivider} />
            <View style={styles.focusRow}>
              <Feather name="sun" size={13} color="#F5A623" />
              <Text style={styles.focusText}>{dailyMsg ?? dailyFocus}</Text>
            </View>
          </LinearGradient>
        </GlowCard>

        {/* ─── Energy Today (tappable to detail) ────────────────────────── */}
        <TouchableOpacity
          onPress={() => { haptic(); router.push({ pathname:"/energy-detail" }); }}
          activeOpacity={0.85}
        >
          <GlowCard style={styles.dailyCard} intensity="high" glowColor="rgba(232,92,122,0.2)">
            <LinearGradient colors={["#1E1030","#110F1E"]} style={styles.dailyCardInner}>
              <View style={styles.dailyHeader}>
                <Text style={styles.dailyTitle}>Your energy today</Text>
                <View style={styles.dailyHeaderRight}>
                  <Text style={styles.dailyDate}>{energy.date}</Text>
                  <Feather name="chevron-right" size={14} color="rgba(240,235,248,0.25)" />
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
        </TouchableOpacity>

        {/* ─── Guidance teaser ───────────────────────────────────────────── */}
        <TouchableOpacity
          onPress={() => { haptic(); router.push("/(tabs)/guidance"); }}
          activeOpacity={0.8}
          style={styles.guidanceTeaser}
        >
          <LinearGradient colors={["rgba(124,82,200,0.15)","rgba(184,85,224,0.08)"]} style={styles.guidanceTeaserInner}>
            <Text style={styles.guidanceTeaserTitle}>The question you keep not asking</Text>
            <Text style={styles.guidanceTeaserSub}>Say it out loud. Get an honest answer.</Text>
            <View style={styles.guidanceSuggestions}>
              {[
                partner.relationshipType === "ex"          ? "Do they actually miss me or just the comfort?"
                : partner.relationshipType === "situationship" ? "Why am I always the one who wants more?"
                : partner.relationshipType === "crush"     ? "Am I misreading this or do they feel it too?"
                : "Why do I feel like I care more than they do?",
                partner.relationshipType === "ex"          ? "Why can I not let go even when I know I should?"
                : partner.relationshipType === "situationship" ? "Am I just convenient for them right now?"
                : partner.relationshipType === "crush"     ? "What if I say something and it ruins everything?"
                : "Do they actually want to be with me?",
              ].map((q, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={(e) => { e.stopPropagation?.(); haptic(); router.push({ pathname:"/(tabs)/guidance", params:{ autoSend:q } }); }}
                  activeOpacity={0.75}
                  style={styles.suggestionChip}
                >
                  <Text style={styles.suggestionText}>{q}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  scroll:              { paddingHorizontal:20, gap:16 },
  header:              { flexDirection:"row", justifyContent:"space-between", alignItems:"flex-start", marginBottom:4 },
  profileBtn:          { borderRadius:22, overflow:"hidden" },
  profileBtnGradient:  { width:44, height:44, borderRadius:22, alignItems:"center", justifyContent:"center" },
  profileBtnInitial:   { fontSize:18, fontFamily:"Nunito_700Bold", color:"#fff" },
  greeting:            { fontSize:15, fontFamily:"Nunito_400Regular", color:"rgba(240,235,248,0.5)" },
  userName:            { fontSize:32, fontFamily:"Nunito_700Bold", color:"#F0EBF8" },

  heroCard:            { borderRadius:22 },
  heroInner:           { borderRadius:22, padding:24, gap:14 },
  heroTopRow:          { flexDirection:"row", justifyContent:"space-between", alignItems:"center" },
  heroMoonTag:         { backgroundColor:"rgba(232,92,122,0.12)", borderWidth:1, borderColor:"rgba(232,92,122,0.28)", borderRadius:20, paddingHorizontal:12, paddingVertical:5 },
  heroMoonTagText:     { fontSize:12, fontFamily:"Nunito_500Medium", color:"#E85C7A" },
  heroHeadline:        { fontSize:22, fontFamily:"Nunito_700Bold", color:"#F0EBF8", lineHeight:30 },
  heroInsight:         { fontSize:16, fontFamily:"Nunito_400Regular", color:"rgba(240,235,248,0.85)", lineHeight:25 },
  heroDivider:         { height:1, backgroundColor:"rgba(240,235,248,0.08)" },
  heroActionRow:       { flexDirection:"row", alignItems:"flex-start", gap:8 },
  heroActionText:      { flex:1, fontSize:14, fontFamily:"Nunito_600SemiBold", color:"#F5A623", lineHeight:21 },

  quoteCard:           { borderRadius:22 },
  quoteInner:          { borderRadius:22, padding:24, gap:14 },
  quoteTopRow:         { flexDirection:"row", justifyContent:"space-between", alignItems:"center" },
  quoteCat:            { fontSize:12, fontFamily:"Nunito_500Medium", color:"#B855E0" },
  quoteStar:           { fontSize:16, color:"rgba(184,85,224,0.5)" },
  quoteText:           { fontSize:19, fontFamily:"Nunito_400Regular", color:"rgba(240,235,248,0.92)", lineHeight:29, fontStyle:"italic" },
  quoteAuthor:         { fontSize:13, fontFamily:"Nunito_500Medium", color:"rgba(240,235,248,0.4)" },
  quoteDivider:        { height:1, backgroundColor:"rgba(240,235,248,0.08)" },
  focusRow:            { flexDirection:"row", alignItems:"flex-start", gap:8 },
  focusText:           { flex:1, fontSize:14, fontFamily:"Nunito_400Regular", color:"rgba(240,235,248,0.55)", lineHeight:22 },

  dailyCard:           { borderRadius:22 },
  dailyCardInner:      { borderRadius:22, padding:24, gap:14 },
  dailyHeader:         { flexDirection:"row", justifyContent:"space-between", alignItems:"center" },
  dailyHeaderRight:    { flexDirection:"row", alignItems:"center", gap:6 },
  dailyTitle:          { fontSize:13, fontFamily:"Nunito_600SemiBold", color:"rgba(240,235,248,0.55)" },
  dailyDate:           { fontSize:12, fontFamily:"Nunito_400Regular", color:"rgba(240,235,248,0.3)" },
  dailyMessage:        { fontSize:17, fontFamily:"Nunito_400Regular", color:"rgba(240,235,248,0.88)", lineHeight:26, fontStyle:"italic" },
  withText:            { fontSize:13, fontFamily:"Nunito_400Regular", color:"rgba(240,235,248,0.35)" },
  barsContainer:       { gap:13, marginTop:4 },
  barLabel:            { fontSize:13, fontFamily:"Nunito_400Regular", color:"rgba(240,235,248,0.55)" },
  barTrack:            { height:6, backgroundColor:"rgba(240,235,248,0.08)", borderRadius:4, overflow:"hidden" },

  guidanceTeaser:      { borderRadius:20, borderWidth:1, borderColor:"rgba(124,82,200,0.25)", overflow:"hidden" },
  guidanceTeaserInner: { padding:22, gap:8 },
  guidanceTeaserTitle: { fontSize:21, fontFamily:"Nunito_700Bold", color:"#F0EBF8", lineHeight:28 },
  guidanceTeaserSub:   { fontSize:15, fontFamily:"Nunito_400Regular", color:"rgba(240,235,248,0.5)" },
  guidanceSuggestions: { flexDirection:"row", gap:8, marginTop:10, flexWrap:"wrap" },
  suggestionChip:      { backgroundColor:"rgba(124,82,200,0.15)", borderWidth:1, borderColor:"rgba(124,82,200,0.3)", borderRadius:20, paddingHorizontal:14, paddingVertical:8 },
  suggestionText:      { fontSize:13, fontFamily:"Nunito_400Regular", color:"rgba(240,235,248,0.75)" },
});
