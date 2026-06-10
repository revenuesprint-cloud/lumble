import { PremiumGate } from "@/components/PremiumGate";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import { getAstrologyReading } from "@/utils/astrology";
import { getAllViralFeatures, ViralFeatureResult } from "@/utils/compatibility";
import { getPersonalizedFeatureText } from "@/utils/personalization";
import { getContentBundle, fetchContentBundle, applyVars } from "@/utils/dbContent";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { KundliLoading } from "@/components/KundliLoading";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CARD_COLORS = [
  "#F43F5E", "#4A3DE8", "#8B5CF6", "#F59E0B",
  "#10B981", "#F43F5E", "#4A3DE8", "#F59E0B",
  "#10B981", "#8B5CF6",
];

function intensityOf(score: number) {
  return score >= 70 ? "High" : score >= 52 ? "Moderate" : "Low";
}

// ─── Featured hero card (first insight, large) ────────────────────────────────

function FeaturedCard({
  feature, color, colorBg, onPress,
}: {
  feature: ViralFeatureResult; color: string; colorBg: string; onPress: () => void;
}) {
  const c = useColors();
  const heroStylesMemo = useMemo(() => createHeroStyles(c), [c]);
  const intensity = intensityOf(feature.score);
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={heroStylesMemo.card}>
      <View style={heroStylesMemo.topRow}>
        <View style={[heroStylesMemo.iconBox, { backgroundColor: colorBg }]}>
          <Feather name={feature.icon as any} size={22} color={color} />
        </View>
        <View style={[heroStylesMemo.scoreBadge, { backgroundColor: colorBg, borderColor: color + "40" }]}>
          <Text style={[heroStylesMemo.scoreNum, { color }]}>{feature.score}</Text>
          <Text style={[heroStylesMemo.scoreSub, { color }]}>/100</Text>
        </View>
      </View>
      <Text style={heroStylesMemo.title}>{feature.title}</Text>
      <Text style={heroStylesMemo.body} numberOfLines={4}>{feature.text}</Text>
      <View style={heroStylesMemo.footer}>
        <View style={[heroStylesMemo.intensityPill, { backgroundColor: colorBg, borderColor: color + "44" }]}>
          <Text style={[heroStylesMemo.intensityText, { color }]}>{intensity} intensity</Text>
        </View>
        <TouchableOpacity onPress={onPress} style={[heroStylesMemo.cta, { backgroundColor: color }]} activeOpacity={0.85}>
          <Text style={heroStylesMemo.ctaTextWhite}>Read the full insight</Text>
          <Feather name="arrow-right" size={13} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

function createHeroStyles(c: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    card:        { backgroundColor: c.card, borderRadius: 16, borderWidth: 1, borderColor: c.border, padding: 18, gap: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 3 },
    topRow:      { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
    iconBox:     { width: 48, height: 48, borderRadius: 14, alignItems: "center", justifyContent: "center" },
    scoreBadge:  { flexDirection: "row", alignItems: "baseline", gap: 2, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, borderWidth: 1 },
    scoreNum:    { fontSize: 22, fontFamily: "PlusJakartaSans_800ExtraBold" },
    scoreSub:    { fontSize: 12, fontFamily: "PlusJakartaSans_400Regular", color: c.textFaint },
    title:       { fontSize: 19, fontFamily: "PlusJakartaSans_800ExtraBold", color: c.text, lineHeight: 26, letterSpacing: -0.3 },
    body:        { fontSize: 14, fontFamily: "PlusJakartaSans_400Regular", color: c.textBody, lineHeight: 22 },
    footer:      { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    intensityPill: { borderWidth: 1, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
    intensityText: { fontSize: 11, fontFamily: "PlusJakartaSans_700Bold" },
    cta:           { flexDirection: "row", alignItems: "center", gap: 6, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 },
    ctaTextWhite:  { fontSize: 12, fontFamily: "PlusJakartaSans_700Bold", color: "#FFFFFF" },
  });
}

// ─── Compact grid card (remaining insights) ───────────────────────────────────

function CompactCard({
  feature, index, colorBg: colorBgProp, color: colorProp, isPremium, onPress,
}: {
  feature: ViralFeatureResult; index: number; color: string; colorBg: string; isPremium: boolean; onPress: () => void;
}) {
  const c = useColors();
  const cStylesMemo = useMemo(() => createCompactStyles(c), [c]);
  const color   = colorProp;
  const colorBg = colorBgProp;
  const isLocked = feature.locked && !isPremium;

  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 200, delay: index * 40, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();
  }, []);

  return (
    <Animated.View style={[{ opacity: fadeAnim }, cStylesMemo.wrap]}>
      <TouchableOpacity onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onPress(); }} activeOpacity={0.82} style={cStylesMemo.card}>
        <View style={cStylesMemo.row}>
          <View style={[cStylesMemo.iconBox, { backgroundColor: colorBg }]}>
            <Feather name={feature.icon as any} size={16} color={color} />
          </View>
          <View style={cStylesMemo.mid}>
            <Text style={cStylesMemo.title} numberOfLines={2}>{feature.title}</Text>
            {!isLocked && (
              <Text style={[cStylesMemo.readMore, { color }]}>Read more</Text>
            )}
          </View>
          {isLocked ? (
            <View style={cStylesMemo.lockBox}>
              <Feather name="lock" size={11} color={c.textFaint} />
            </View>
          ) : (
            <View style={[cStylesMemo.scoreBadge, { backgroundColor: colorBg, borderColor: color + "44" }]}>
              <Text style={[cStylesMemo.scoreText, { color }]}>{feature.score}</Text>
            </View>
          )}
          <Feather name="chevron-right" size={13} color={c.borderLight} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

function createCompactStyles(c: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    wrap:      {},
    card:      { backgroundColor: c.card, borderRadius: 14, borderWidth: 1, borderColor: c.border, paddingHorizontal: 14, paddingVertical: 13, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 5, elevation: 1 },
    row:       { flexDirection: "row", alignItems: "center", gap: 12 },
    iconBox:   { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center", flexShrink: 0 },
    mid:       { flex: 1, gap: 2 },
    title:     { fontSize: 13, fontFamily: "PlusJakartaSans_600SemiBold", color: c.text, lineHeight: 18 },
    readMore:  { fontSize: 10, fontFamily: "PlusJakartaSans_600SemiBold" },
    lockBox:   { width: 26, height: 26, borderRadius: 8, backgroundColor: c.input, borderWidth: 1, borderColor: c.border, alignItems: "center", justifyContent: "center" },
    scoreBadge:{ paddingHorizontal: 7, paddingVertical: 3, borderRadius: 20, borderWidth: 1 },
    scoreText: { fontSize: 11, fontFamily: "PlusJakartaSans_800ExtraBold" },
  });
}

// ─── Insights screen ──────────────────────────────────────────────────────────

export default function FeaturesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, partner, isPremium } = useApp();
  const c = useColors();
  const s = useMemo(() => createStyles(c), [c]);
  const [showGate,    setShowGate]    = useState(false);
  const [gateFeature, setGateFeature] = useState<string | undefined>();
  const [, forceUpdate] = useState(0);

  const reading = useMemo(() => {
    if (!user || !partner) return null;
    return getAstrologyReading(user.name, user.birthDate, partner.name, partner.birthDate, user.birthTime);
  }, [user?.birthDate, user?.name, user?.birthTime, partner?.birthDate, partner?.name]);

  // Ensure the content bundle is loaded so DB text overrides work
  useEffect(() => {
    if (!user || !partner || !reading) return;
    if (getContentBundle()) return;
    const { extractKundliAttributes } = require("@/utils/challenges");
    const attrs = extractKundliAttributes(reading, partner.relationshipType ?? "relationship");
    const tags = Object.entries(attrs).map(([k, v]) => `${k}:${v}`).filter(Boolean) as string[];
    fetchContentBundle(tags).then((b) => { if (b) forceUpdate((n) => n + 1); });
  }, [reading]);

  if (!user || !partner) return null;
  if (!reading) return <KundliLoading label="Analysing your connection..." />;

  const dbBundle = getContentBundle();
  const dbFeatureTexts: Record<string, string> = {};
  if (dbBundle?.featureInsights?.length) {
    const vars = { u: user.name, p: partner.name };
    for (const item of dbBundle.featureInsights) {
      const key = (item.meta as any)?.featureKey as string | undefined;
      if (key) dbFeatureTexts[key] = applyVars(item.body, vars);
    }
  }

  const baseFeatures = getAllViralFeatures(user.birthDate, partner.birthDate, user.name, partner.name);
  const features = baseFeatures.map((f) => ({
    ...f,
    text: dbFeatureTexts[f.key] ?? getPersonalizedFeatureText(f.key, reading, user.name, partner.name),
  }));

  // First unlocked feature gets the hero card; rest go in the compact grid
  const heroIdx  = features.findIndex((f) => !f.locked || isPremium);
  const heroFeat = heroIdx >= 0 ? features[heroIdx] : features[0];
  const restFeats = features.filter((_, i) => i !== heroIdx);

  const CARD_BG = [
    c.roseLight, c.primaryLight, c.violetLight, c.goldLight,
    c.emeraldLight, c.roseLight, c.primaryLight, c.goldLight,
    c.emeraldLight, c.violetLight,
  ];

  const handlePress = (feature: ViralFeatureResult) => {
    if (feature.locked && !isPremium) {
      setGateFeature(feature.title); setShowGate(true);
    } else {
      router.push({ pathname: "/feature-detail", params: { featureKey: feature.key } });
    }
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
        {/* Header */}
        <View style={s.header}>
          <Text style={s.title}>What Makes You Two Tick</Text>
          <Text style={s.sub}>{user.name} and {partner.name} · {features.length} personalised insights</Text>
        </View>

        {/* Hero feature */}
        {heroFeat && (
          <>
            <Text style={s.sectionLabel}>FEATURED INSIGHT</Text>
            <FeaturedCard
              feature={heroFeat}
              color={CARD_COLORS[heroIdx >= 0 ? heroIdx : 0]}
              colorBg={CARD_BG[heroIdx >= 0 ? heroIdx : 0]}
              onPress={() => handlePress(heroFeat)}
            />
          </>
        )}

        {/* Compact list */}
        {restFeats.length > 0 && (
          <>
            <Text style={s.sectionLabel}>ALL INSIGHTS · {features.length}</Text>
            <View style={s.grid}>
              {restFeats.map((feat, ri) => {
                const realIdx = ri + (heroIdx >= 0 ? 1 : 0);
                return (
                  <CompactCard
                    key={feat.key}
                    feature={feat}
                    index={ri}
                    color={CARD_COLORS[realIdx % CARD_COLORS.length]}
                    colorBg={CARD_BG[realIdx % CARD_BG.length]}
                    isPremium={isPremium}
                    onPress={() => handlePress(feat)}
                  />
                );
              })}
            </View>
          </>
        )}

        {/* Premium banner */}
        {!isPremium && (
          <TouchableOpacity
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); setShowGate(true); }}
            activeOpacity={0.85}
            style={s.premiumBanner}
          >
            <View style={s.premiumLeft}>
              <View style={s.premiumIcon}>
                <Feather name="lock" size={16} color="#4A3DE8" />
              </View>
              <View>
                <Text style={s.premiumTitle}>See all your insights</Text>
                <Text style={s.premiumSub}>3 deeper readings are waiting for you</Text>
              </View>
            </View>
            <View style={s.premiumArrow}>
              <Feather name="arrow-right" size={16} color="#4A3DE8" />
            </View>
          </TouchableOpacity>
        )}
      </ScrollView>

      <PremiumGate visible={showGate} onClose={() => setShowGate(false)} featureName={gateFeature} />
    </View>
  );
}

function createStyles(c: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    root:     { flex: 1, backgroundColor: c.background },
    webScroll:{ maxWidth: 640, alignSelf: "center", width: "100%" },
    scroll:   { paddingHorizontal: 18, gap: 14 },

    header:       { gap: 3 },
    title:        { fontSize: 24, fontFamily: "PlusJakartaSans_800ExtraBold", color: c.text, letterSpacing: -0.4 },
    sub:          { fontSize: 13, fontFamily: "PlusJakartaSans_400Regular", color: c.textMuted },
    sectionLabel: { fontSize: 11, fontFamily: "PlusJakartaSans_700Bold", color: c.textFaint, letterSpacing: 1.2, textTransform: "uppercase" },

    grid:    { gap: 8 },

    premiumBanner:{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: c.card, borderRadius: 16, borderWidth: 1, borderColor: c.primaryBorder, padding: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
    premiumLeft:  { flexDirection: "row", alignItems: "center", gap: 12 },
    premiumIcon:  { width: 40, height: 40, borderRadius: 12, backgroundColor: c.primaryLight, alignItems: "center", justifyContent: "center" },
    premiumTitle: { fontSize: 14, fontFamily: "PlusJakartaSans_700Bold", color: c.text },
    premiumSub:   { fontSize: 12, fontFamily: "PlusJakartaSans_400Regular", color: c.textMuted },
    premiumArrow: { width: 36, height: 36, borderRadius: 10, backgroundColor: c.primaryLight, alignItems: "center", justifyContent: "center" },
  });
}
