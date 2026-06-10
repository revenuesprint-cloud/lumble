import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import { getAstrologyReading, RASHIS } from "@/utils/astrology";
import { getLuckyFeatures, lifePathNumber, todayVibration } from "@/utils/lucky";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ─── Animated number count-up ─────────────────────────────────────────────────

function AnimatedNumber({ target, st }: { target: number; st: any }) {
  const anim    = useRef(new Animated.Value(0)).current;
  const scale   = useRef(new Animated.Value(0.6)).current;
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const id = anim.addListener(({ value }) => setDisplay(Math.round(value)));
    Animated.parallel([
      Animated.timing(anim,  { toValue: target, duration: 600, delay: 150, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
      Animated.spring(scale, { toValue: 1, friction: 5, tension: 80, delay: 120, useNativeDriver: true }),
    ]).start();
    return () => anim.removeListener(id);
  }, [target]);

  return (
    <Animated.Text style={[st.bigNumber, { transform: [{ scale }] }]}>
      {display}
    </Animated.Text>
  );
}

// ─── Section with fade-in ─────────────────────────────────────────────────────

function FadeSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const slide   = useRef(new Animated.Value(14)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 280, delay, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.timing(slide,   { toValue: 0, duration: 280, delay, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY: slide }] }}>
      {children}
    </Animated.View>
  );
}

// ─── Lucky Detail screen ──────────────────────────────────────────────────────

export default function LuckyDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, partner } = useApp();
  const c = useColors();
  const st = useMemo(() => createStyles(c), [c]);

  const reading = useMemo(() => {
    if (!user || !partner) return null;
    return getAstrologyReading(user.name, user.birthDate, partner.name, partner.birthDate, user.birthTime);
  }, [user?.birthDate, user?.name, user?.birthTime, partner?.birthDate, partner?.name]);

  if (!user || !reading) return null;

  const uRashi   = RASHIS[reading.user.moonRashi];
  const element  = uRashi.element;
  const features = getLuckyFeatures(user.birthDate, element);
  const lp       = lifePathNumber(user.birthDate);
  const dv       = todayVibration();

  const now      = new Date();
  const dateStr  = now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  const handleShare = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await Share.share({
        message: `my lucky number today is ${features.number} (${features.archetype}) and my color is ${features.color.name} ✦\n\nget yours on Lumble — download on the Play Store:\nhttps://play.google.com/store/apps/details?id=com.lumble.app`,
        title:   "Today's Lucky",
      });
    } catch {}
  };

  return (
    <View style={st.root}>
      {/* ── Color gradient header — keep lucky color gradient as-is ─── */}
      <LinearGradient
        colors={[features.color.gradient[0] + "CC", features.color.gradient[1] + "55", c.background + "00"]}
        style={[st.headerGrad, { paddingTop: insets.top + (Platform.OS === "web" ? 70 : 12) }]}
      >
        <View style={st.headerRow}>
          <TouchableOpacity
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.back(); }}
            style={st.backBtn}
            activeOpacity={0.7}
          >
            <Feather name="arrow-left" size={20} color={c.text} />
          </TouchableOpacity>
          <View style={st.headerCenter}>
            <Text style={st.headerTitle}>Today's Lucky</Text>
            <Text style={st.headerDate}>{dateStr}</Text>
          </View>
          <TouchableOpacity onPress={handleShare} style={st.shareBtn} activeOpacity={0.7}>
            <Feather name="share-2" size={18} color="#4A3DE8" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={Platform.OS === "web" ? st.webScroll : undefined}
        contentContainerStyle={[st.scroll, { paddingBottom: insets.bottom + 40 }]}
      >
        {/* ── Lucky Number card ──────────────────────────────────────── */}
        <FadeSection delay={80}>
          <View style={st.card}>
            {/* Card header */}
            <View style={st.cardHeader}>
              <View style={[st.cardIconBox, { backgroundColor: c.primaryLight }]}>
                <Feather name="hash" size={16} color="#4A3DE8" />
              </View>
              <View style={st.cardHeaderText}>
                <Text style={st.cardTitle}>Lucky Number</Text>
                <Text style={st.cardSub}>Derived from your birth chart + today's vibration</Text>
              </View>
            </View>

            <View style={st.divider} />

            {/* Number display */}
            <View style={st.numberDisplay}>
              <AnimatedNumber target={features.number} st={st} />
              <View style={st.archetypeBlock}>
                <Text style={st.archetypeName}>{features.archetype}</Text>
                <View style={st.energyPill}>
                  <Text style={st.energyText}>{features.energy}</Text>
                </View>
              </View>
            </View>

            {/* Numerology breakdown */}
            <View style={st.calcRow}>
              <View style={st.calcItem}>
                <Text style={st.calcVal}>{lp}</Text>
                <Text style={st.calcLabel}>Life Path</Text>
              </View>
              <View style={st.calcPlus}>
                <Text style={st.calcOp}>+</Text>
              </View>
              <View style={st.calcItem}>
                <Text style={st.calcVal}>{dv}</Text>
                <Text style={st.calcLabel}>Today</Text>
              </View>
              <View style={st.calcPlus}>
                <Text style={st.calcOp}>=</Text>
              </View>
              <View style={[st.calcItem, st.calcResult]}>
                <Text style={[st.calcVal, st.calcResultVal]}>{features.number}</Text>
                <Text style={st.calcLabel}>Your number</Text>
              </View>
            </View>

            <View style={st.divider} />

            {/* Description */}
            <Text style={st.bodyText}>{features.description}</Text>

            <View style={st.divider} />

            {/* Opportunities */}
            <Text style={st.sectionHeading}>TODAY'S OPPORTUNITIES</Text>
            <View style={st.opportunitiesList}>
              {features.opportunities.map((opp, i) => (
                <View key={i} style={st.oppRow}>
                  <View style={[st.oppBullet, { backgroundColor: "#4A3DE8" }]}>
                    <Text style={st.oppBulletText}>{i + 1}</Text>
                  </View>
                  <Text style={st.oppText}>{opp}</Text>
                </View>
              ))}
            </View>

            <View style={st.divider} />

            {/* Life path meaning */}
            <Text style={st.sectionHeading}>YOUR LIFE PATH · {lp}</Text>
            <Text style={st.bodyTextMuted}>{features.lifePathMeaning}</Text>
          </View>
        </FadeSection>

        {/* ── Lucky Color card ────────────────────────────────────────── */}
        <FadeSection delay={200}>
          <View style={st.card}>
            {/* Card header */}
            <View style={st.cardHeader}>
              <View style={[st.cardIconBox, { backgroundColor: features.color.gradient[0] + "33" }]}>
                <View style={[st.colorDot, { backgroundColor: features.color.hex }]} />
              </View>
              <View style={st.cardHeaderText}>
                <Text style={st.cardTitle}>Lucky Color</Text>
                <Text style={st.cardSub}>{features.planet} rules today · {element} moon</Text>
              </View>
            </View>

            <View style={st.divider} />

            {/* Color swatch — keep lucky color gradient */}
            <LinearGradient
              colors={features.color.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={st.colorSwatch}
            >
              <Text style={st.swatchName}>{features.color.name}</Text>
            </LinearGradient>

            {/* Planet meaning */}
            <View style={st.planetRow}>
              <Feather name="sun" size={13} color="#F59E0B" />
              <Text style={st.planetText}>{features.color.planetMeaning}</Text>
            </View>

            <View style={st.divider} />

            {/* Why this color */}
            <Text style={st.sectionHeading}>WHY THIS COLOR FOR YOU</Text>
            <Text style={st.bodyText}>{features.color.colorMeaning}</Text>

            <View style={st.divider} />

            {/* How to use */}
            <Text style={st.sectionHeading}>HOW TO USE IT TODAY</Text>
            <View style={st.opportunitiesList}>
              {features.color.howToUse.map((tip, i) => (
                <View key={i} style={st.oppRow}>
                  <View style={[st.oppBullet, { backgroundColor: features.color.hex }]}>
                    <Text style={st.oppBulletText}>{i + 1}</Text>
                  </View>
                  <Text style={st.oppText}>{tip}</Text>
                </View>
              ))}
            </View>
          </View>
        </FadeSection>

        {/* ── Share button ────────────────────────────────────────────── */}
        <FadeSection delay={320}>
          <TouchableOpacity onPress={handleShare} style={st.shareFullBtn} activeOpacity={0.85}>
            <Feather name="share-2" size={16} color={c.ctaForeground} />
            <Text style={st.shareFullBtnText}>Share today's luck</Text>
          </TouchableOpacity>
          <Text style={st.refreshHint}>Your luck updates every day at midnight ✦</Text>
        </FadeSection>
      </ScrollView>
    </View>
  );
}

function createStyles(c: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    root:    { flex: 1, backgroundColor: c.background },
    webScroll:{ maxWidth: 640, alignSelf: "center", width: "100%" },
    scroll:  { paddingHorizontal: 18, paddingTop: 8, gap: 14 },

    // Header
    headerGrad:   { paddingHorizontal: 18, paddingBottom: 20 },
    headerRow:    { flexDirection: "row", alignItems: "center", gap: 12 },
    backBtn:      { width: 40, height: 40, borderRadius: 12, backgroundColor: c.card + "B3", alignItems: "center", justifyContent: "center", flexShrink: 0 },
    shareBtn:     { width: 40, height: 40, borderRadius: 12, backgroundColor: c.card + "B3", alignItems: "center", justifyContent: "center", flexShrink: 0 },
    headerCenter: { flex: 1, alignItems: "center" },
    headerTitle:  { fontSize: 18, fontFamily: "PlusJakartaSans_800ExtraBold", color: c.text, letterSpacing: -0.3 },
    headerDate:   { fontSize: 12, fontFamily: "PlusJakartaSans_400Regular", color: c.textMuted, marginTop: 2 },

    // Card
    card: { backgroundColor: c.card, borderRadius: 20, borderWidth: 1, borderColor: c.border, padding: 20, gap: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 3 },

    cardHeader:     { flexDirection: "row", alignItems: "center", gap: 12 },
    cardIconBox:    { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center", flexShrink: 0 },
    colorDot:       { width: 16, height: 16, borderRadius: 8 },
    cardHeaderText: { flex: 1 },
    cardTitle:      { fontSize: 17, fontFamily: "PlusJakartaSans_700Bold", color: c.text },
    cardSub:        { fontSize: 11, fontFamily: "PlusJakartaSans_400Regular", color: c.textFaint, marginTop: 2 },

    divider: { height: 1, backgroundColor: c.borderLight },

    // Number display
    numberDisplay: { flexDirection: "row", alignItems: "center", gap: 20, paddingVertical: 8 },
    bigNumber: { fontSize: 88, fontFamily: "PlusJakartaSans_800ExtraBold", color: "#4A3DE8", lineHeight: 96, width: 100, textAlign: "center" },
    archetypeBlock:{ flex: 1, gap: 6 },
    archetypeName: { fontSize: 22, fontFamily: "PlusJakartaSans_800ExtraBold", color: c.text, letterSpacing: -0.3, lineHeight: 28 },
    energyPill:    { alignSelf: "flex-start", backgroundColor: c.primaryLight, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: c.primaryBorder },
    energyText:    { fontSize: 11, fontFamily: "PlusJakartaSans_600SemiBold", color: "#4A3DE8" },

    // Numerology breakdown
    calcRow:     { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 4 },
    calcItem:    { alignItems: "center", gap: 2 },
    calcResult:  { backgroundColor: c.primaryLight, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, borderWidth: 1, borderColor: c.primaryBorder },
    calcVal:     { fontSize: 20, fontFamily: "PlusJakartaSans_800ExtraBold", color: c.text },
    calcResultVal:{ color: "#4A3DE8" },
    calcLabel:   { fontSize: 9, fontFamily: "PlusJakartaSans_500Medium", color: c.textFaint, textTransform: "uppercase", letterSpacing: 0.5 },
    calcPlus:    { paddingBottom: 12 },
    calcOp:      { fontSize: 18, fontFamily: "PlusJakartaSans_400Regular", color: c.borderLight },

    // Body
    sectionHeading:{ fontSize: 10, fontFamily: "PlusJakartaSans_700Bold", color: c.textFaint, letterSpacing: 1.4, textTransform: "uppercase" },
    bodyText:      { fontSize: 15, fontFamily: "PlusJakartaSans_400Regular", color: c.textBody, lineHeight: 24 },
    bodyTextMuted: { fontSize: 14, fontFamily: "PlusJakartaSans_400Regular", color: c.textMuted, lineHeight: 23, fontStyle: "italic" },

    // Opportunities
    opportunitiesList: { gap: 12 },
    oppRow:            { flexDirection: "row", gap: 12, alignItems: "flex-start" },
    oppBullet:         { width: 22, height: 22, borderRadius: 11, alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 },
    oppBulletText:     { fontSize: 11, fontFamily: "PlusJakartaSans_700Bold", color: "#FFFFFF" },
    oppText:           { flex: 1, fontSize: 14, fontFamily: "PlusJakartaSans_400Regular", color: c.textBody, lineHeight: 22 },

    // Color card
    colorSwatch: { height: 80, borderRadius: 14, alignItems: "flex-end", justifyContent: "flex-end", padding: 14 },
    swatchName:  { fontSize: 16, fontFamily: "PlusJakartaSans_700Bold", color: "#FFFFFF", textShadowColor: "rgba(0,0,0,0.25)", textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3 },
    planetRow:   { flexDirection: "row", gap: 8, alignItems: "flex-start" },
    planetText:  { flex: 1, fontSize: 13, fontFamily: "PlusJakartaSans_400Regular", color: c.textMuted, lineHeight: 20 },

    // Bottom
    shareFullBtn:     { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: c.cta, borderRadius: 14, paddingVertical: 15 },
    shareFullBtnText: { fontSize: 15, fontFamily: "PlusJakartaSans_700Bold", color: c.ctaForeground },
    refreshHint:      { textAlign: "center", fontSize: 11, fontFamily: "PlusJakartaSans_500Medium", color: c.textFaint, marginTop: 2 },
  });
}
