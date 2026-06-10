import { AnimatedBar } from "@/components/AnimatedBar";
import { PremiumGate } from "@/components/PremiumGate";
import { ShareCardModal } from "@/components/ShareCardModal";
import { useApp } from "@/context/AppContext";
import { getAstrologyReading, RASHIS } from "@/utils/astrology";
import { SCREEN_W } from "@/constants/layout";

const ORB_SIZE = Math.min(140, Math.round(SCREEN_W * 0.38));
import { calculateCompatibility, CompatibilitySection } from "@/utils/compatibility";
import { getCompatibilityTexts } from "@/utils/personalization";
import { getContentBundle, fetchContentBundle, applyVars } from "@/utils/dbContent";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { KundliLoading } from "@/components/KundliLoading";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function sectionStrength(score: number): { text: string; color: string; bg: string } {
  if (score >= 72) return { text: "Strong",      color: "#10B981", bg: "#ECFDF5" };
  if (score >= 57) return { text: "Good",        color: "#10B981", bg: "#ECFDF5" };
  if (score >= 44) return { text: "Building",    color: "#F59E0B", bg: "#FFFBEB" };
  return              { text: "Needs Work",   color: "#F43F5E", bg: "#FFF1F2" };
}

// ─── Score circle ─────────────────────────────────────────────────────────────

function ScoreCircle({ score }: { score: number }) {
  const countAnim = useRef(new Animated.Value(0)).current;
  const [display, setDisplay] = useState(0);
  const scaleAnim = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    countAnim.setValue(0);
    const id = countAnim.addListener(({ value }) => setDisplay(Math.round(value)));
    Animated.parallel([
      Animated.timing(countAnim, { toValue: score, duration: 750, delay: 100, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 5, tension: 90, delay: 80, useNativeDriver: true }),
    ]).start();
    return () => countAnim.removeListener(id);
  }, [score]);

  const color   = score >= 28 ? "#10B981" : score >= 21 ? "#F59E0B" : "#F43F5E";
  const colorBg = score >= 28 ? "#ECFDF5" : score >= 21 ? "#FFFBEB" : "#FFF1F2";
  const pct     = Math.round((display / 36) * 100);
  const verdict = score >= 28 ? "Strong" : score >= 21 ? "Good" : score >= 18 ? "Average" : "Challenging";

  return (
    <Animated.View style={[scoreStyles.wrap, { transform: [{ scale: scaleAnim }] }]}>
      <View style={[scoreStyles.orb, { backgroundColor: colorBg, borderColor: color + "40", width: ORB_SIZE, height: ORB_SIZE, borderRadius: ORB_SIZE / 2 }]}>
        <Text style={[scoreStyles.pct, { color }]} adjustsFontSizeToFit numberOfLines={1} minimumFontScale={0.6}>
          {pct}<Text style={scoreStyles.pctSign}>%</Text>
        </Text>
        <Text style={scoreStyles.orbLabel}>compatibility</Text>
        <View style={[scoreStyles.verdictPill, { backgroundColor: color + "18", borderColor: color + "40" }]}>
          <Text style={[scoreStyles.verdictText, { color }]}>{verdict}</Text>
        </View>
        <Text style={scoreStyles.orbHint}>from your birth charts</Text>
      </View>
    </Animated.View>
  );
}

const scoreStyles = StyleSheet.create({
  wrap:        { alignItems: "center", paddingVertical: 8 },
  orb:         { alignItems: "center", justifyContent: "center", borderWidth: 2, gap: 3 },
  pct:         { fontSize: 44, fontFamily: "PlusJakartaSans_800ExtraBold" },
  pctSign:     { fontSize: 22, fontFamily: "PlusJakartaSans_400Regular", color: "#94A3B8" },
  orbLabel:    { fontSize: 10, fontFamily: "PlusJakartaSans_500Medium", color: "#64748B", textTransform: "uppercase", letterSpacing: 0.6 },
  verdictPill: { borderWidth: 1, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3, marginTop: 2 },
  verdictText: { fontSize: 11, fontFamily: "PlusJakartaSans_700Bold" },
  orbHint:     { fontSize: 10, fontFamily: "PlusJakartaSans_400Regular", color: "#94A3B8", textAlign: "center", marginTop: 1 },
});

// ─── Section deep content ─────────────────────────────────────────────────────

const SECTION_DEEP: Record<string, { headline: string; points: string[]; askPrompt: string }> = {
  "Emotional Chemistry": {
    headline: "What this actually means for you",
    points: [
      "The pull you feel is real and grounded in how your emotional natures actually interact, not just surface attraction. That's what makes it harder to either ignore or resolve cleanly.",
      "Chemistry without direction tends to become the thing that holds both people in place without moving forward. The most useful step is naming what you both want from this.",
      "Try asking them: what drew you to me initially? Their answer will tell you whether you are reading the same connection or two different ones.",
    ],
    askPrompt: "Why does the chemistry between us feel so strong?",
  },
  "Communication Energy": {
    headline: "How to actually bridge this gap",
    points: [
      "You process things differently: one of you leads with feeling, the other with logic. Neither approach is wrong. The breakdown happens when the slower processor stops signalling that they are still engaged.",
      "The most common version of this: one person thinks the conversation is over, the other thinks it never really happened.",
      "Before any important conversation, agree on whether you need to process together or separately first. That single step prevents most of the miscommunication between you.",
    ],
    askPrompt: "Why do we keep misunderstanding each other even when we're both trying?",
  },
  "Attachment Dynamics": {
    headline: "Understanding the push and pull",
    points: [
      "One of you moves closer when things feel good and the other pulls back when things get real. This creates a rhythm that feels like electricity but is actually two people managing fear in opposite directions.",
      "The moments of genuine closeness feel extraordinary precisely because of the uncertainty surrounding them. Your system can start to call that cycle love when it is actually a loop.",
      "Name the pattern together when you are both calm. Saying 'I notice we do this thing where one of us gets close and then one of us steps back' changes the dynamic immediately.",
    ],
    askPrompt: "Why do I feel close to them one day and distant the next?",
  },
  "Emotional Tension": {
    headline: "What the tension is actually telling you",
    points: [
      "Tension is almost never about what it looks like on the surface. It is where two or three specific unspoken things are living right now. Both of you know what those things are.",
      "The tension does not go away by resolving the argument. It goes away when the underlying need or fear gets named directly.",
      "In a calm moment, not in a fight, try saying: 'I notice there is something between us that keeps surfacing. Can we talk about what it actually is?' That question works.",
    ],
    askPrompt: "Why does the same tension keep coming up between us no matter what we do?",
  },
  "Long-Term Potential": {
    headline: "What it would actually take",
    points: [
      "Long-term potential is present in this connection, but it is not automatic. The raw material is there. What it needs is both people choosing depth over comfort at the moment those two things start to feel different.",
      "Most connections with real potential fail not because of incompatibility but because neither person was willing to go first into the vulnerable conversation.",
      "The question to sit with is: are you both choosing this, or are you both waiting for the other person to make it safe to choose it? Only one of those leads somewhere.",
    ],
    askPrompt: "Do we actually have a future together, or are we just comfortable?",
  },
  "Why This Feels Addictive": {
    headline: "What you are actually attached to",
    points: [
      "The addiction is specific. You found someone who makes you feel actually known, not just liked or wanted. That experience does not happen often. Once it does, the mind does not release it easily.",
      "The pull back is almost always emotional recognition, the feeling of being fully seen. Once you have had that, ordinary connection can feel like it is missing something. Worth asking whether you are attached to this person or to that feeling.",
      "This is not a reason to leave or to stay. It is information. Knowing what you are actually attached to gives you the ability to make a real choice rather than just responding to the pull.",
    ],
    askPrompt: "Why can't I stop thinking about them even when I know I should?",
  },
  "Hidden Relationship Pattern": {
    headline: "The pattern underneath everything",
    points: [
      "Both of you are more afraid of getting exactly what you want here than of not getting it. That fear is the engine running most of the distance, ambiguity, and cycles between you.",
      "There is likely a testing pattern: small actions and small withdrawals designed to find out if the other person will stay. The test never officially ends because neither of you has decided it is safe to stop running it.",
      "The only move that changes this pattern is one person going first into genuine openness without a guarantee that it will be met the same way. Everything else keeps the loop going.",
    ],
    askPrompt: "What is the real pattern underneath everything between us?",
  },
};

// ─── Section detail sheet ─────────────────────────────────────────────────────

const SCREEN_H = Dimensions.get("window").height;

function SectionDetailSheet({ section, onClose }: { section: CompatibilitySection; onClose: () => void }) {
  const insets    = useSafeAreaInsets();
  const router    = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const slideAnim = useRef(new Animated.Value(SCREEN_H)).current;
  const expandAnim = useRef(new Animated.Value(0)).current;
  const [expanded, setExpanded] = useState(false);
  const lbl = sectionStrength(section.score);
  const deep = SECTION_DEEP[section.label];

  useEffect(() => {
    Animated.spring(slideAnim, { toValue: 0, friction: 9, tension: 100, useNativeDriver: true }).start();
  }, []);

  const close = () => {
    Animated.timing(slideAnim, { toValue: SCREEN_H, duration: 280, easing: Easing.in(Easing.cubic), useNativeDriver: true }).start(onClose);
  };

  const handleKnowMore = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setExpanded(true);
    Animated.timing(expandAnim, { toValue: 1, duration: 300, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 150);
  };

  const handleAskOracle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    close();
    setTimeout(() => router.push("/(tabs)/guidance"), 320);
  };

  return (
    <Animated.View style={[sheetStyles.page, { transform: [{ translateY: slideAnim }] }]}>
      <View style={[sheetStyles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={close} style={sheetStyles.backBtn} activeOpacity={0.7}>
          <Feather name="arrow-left" size={20} color="#64748B" />
        </TouchableOpacity>
        <View style={[sheetStyles.iconCircle, { backgroundColor: section.color + "14" }]}>
          <View style={[sheetStyles.iconDot, { backgroundColor: section.color }]} />
        </View>
        <Text style={sheetStyles.title} numberOfLines={1}>{section.label}</Text>
        <View style={[sheetStyles.badge, { backgroundColor: lbl.bg, borderColor: lbl.color + "44" }]}>
          <Text style={[sheetStyles.badgeText, { color: lbl.color }]}>{lbl.text}</Text>
        </View>
      </View>

      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[sheetStyles.scroll, { paddingBottom: insets.bottom + 40 }]}
      >
        <AnimatedBar value={section.score} color={section.color} color2={section.color + "88"} delay={120} height={8} />
        <View style={sheetStyles.divider} />
        <Text style={sheetStyles.body}>{section.text}</Text>

        {/* Expanded deep content */}
        {expanded && deep && (
          <View style={sheetStyles.deepBlock}>
            <Text style={[sheetStyles.deepHeadline, { color: section.color }]}>{deep.headline}</Text>
            {deep.points.map((pt, i) => (
              <View key={i} style={sheetStyles.deepPoint}>
                <View style={[sheetStyles.deepDot, { backgroundColor: section.color }]} />
                <Text style={sheetStyles.deepText}>{pt}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={sheetStyles.ctaBlock}>
          {!expanded ? (
            <TouchableOpacity
              onPress={handleKnowMore}
              style={[sheetStyles.knowMoreBtn, { backgroundColor: section.color }]}
              activeOpacity={0.85}
            >
              <Text style={sheetStyles.knowMoreText}>Know more</Text>
              <Feather name="chevron-down" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={handleAskOracle}
              style={[sheetStyles.knowMoreBtn, { backgroundColor: section.color }]}
              activeOpacity={0.85}
            >
              <Feather name="message-circle" size={16} color="#FFFFFF" />
              <Text style={sheetStyles.knowMoreText}>Ask the oracle about this</Text>
              <Feather name="arrow-right" size={15} color="#FFFFFF" />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={close} style={sheetStyles.doneBtn} activeOpacity={0.7}>
            <Text style={sheetStyles.doneBtnText}>I already know this one</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Animated.View>
  );
}

const sheetStyles = StyleSheet.create({
  page:      { ...StyleSheet.absoluteFillObject, zIndex: 200, backgroundColor: "#FFFFFF" },
  header:    { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: "#F1F5F9" },
  backBtn:   { width: 40, height: 40, borderRadius: 12, backgroundColor: "#F8FAFC", borderWidth: 1, borderColor: "#E2E8F0", alignItems: "center", justifyContent: "center" },
  iconCircle:{ width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  iconDot:   { width: 10, height: 10, borderRadius: 5 },
  title:     { flex: 1, fontSize: 17, fontFamily: "PlusJakartaSans_700Bold", color: "#0F172A" },
  badge:     { borderRadius: 20, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 4 },
  badgeText: { fontSize: 11, fontFamily: "PlusJakartaSans_600SemiBold" },

  scroll:    { paddingHorizontal: 24, paddingTop: 28, gap: 20 },
  divider:   { height: 1, backgroundColor: "#F1F5F9" },
  body:      { fontSize: 17, fontFamily: "PlusJakartaSans_400Regular", color: "#374151", lineHeight: 29 },

  deepBlock:    { gap: 14, backgroundColor: "#F8FAFC", borderRadius: 16, borderWidth: 1, borderColor: "#E2E8F0", padding: 18 },
  deepHeadline: { fontSize: 14, fontFamily: "PlusJakartaSans_700Bold", lineHeight: 20 },
  deepPoint:    { flexDirection: "row", gap: 12, alignItems: "flex-start" },
  deepDot:      { width: 7, height: 7, borderRadius: 4, marginTop: 8, flexShrink: 0 },
  deepText:     { flex: 1, fontSize: 15, fontFamily: "PlusJakartaSans_400Regular", color: "#374151", lineHeight: 24 },

  ctaBlock:     { gap: 10 },
  knowMoreBtn:  { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 9, borderRadius: 16, paddingVertical: 16 },
  knowMoreText: { fontSize: 15, fontFamily: "PlusJakartaSans_700Bold", color: "#FFFFFF" },
  doneBtn:      { alignItems: "center", paddingVertical: 16, backgroundColor: "#F8FAFC", borderRadius: 16, borderWidth: 1, borderColor: "#E2E8F0" },
  doneBtnText:  { fontSize: 15, fontFamily: "PlusJakartaSans_600SemiBold", color: "#64748B" },
});

// ─── Section card (TradeSathi-inspired) ──────────────────────────────────────

const SECTION_ICONS: Record<string, string> = {
  "Emotional Chemistry":        "💞",
  "Communication Energy":       "💬",
  "Attachment Dynamics":        "🔗",
  "Emotional Tension":          "⚡",
  "Long-Term Potential":        "🌱",
  "Why This Feels Addictive":   "🔥",
  "Hidden Relationship Pattern":"✨",
};

function SectionCard({
  section, index, isPremium, onLockTap, onDetailTap,
}: {
  section: CompatibilitySection; index: number; isPremium: boolean;
  onLockTap: () => void; onDetailTap: () => void;
}) {
  const isLocked  = index >= 5 && !isPremium;
  const lbl       = sectionStrength(section.score);
  const scorePct  = Math.min(100, Math.round(section.score));
  const icon      = SECTION_ICONS[section.label] ?? "◦";

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(16)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 240, delay: index * 60 + 80, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 240, delay: index * 60 + 80, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
      <TouchableOpacity
        onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); isLocked ? onLockTap() : onDetailTap(); }}
        activeOpacity={0.82}
        style={scStyles.card}
      >
        <View style={scStyles.row}>
          <View style={[scStyles.iconBox, { backgroundColor: section.color + "15" }]}>
            <Text style={{ fontSize: 17 }}>{icon}</Text>
          </View>
          <View style={scStyles.mid}>
            <Text style={scStyles.label}>{section.label}</Text>
            {!isLocked && (
              <AnimatedBar value={section.score} color={section.color} color2={section.color + "70"} delay={index * 80 + 300} height={4} />
            )}
          </View>
          {isLocked ? (
            <View style={scStyles.lockBadge}>
              <Feather name="lock" size={12} color="#94A3B8" />
            </View>
          ) : (
            <View style={[scStyles.scoreBadge, { backgroundColor: lbl.bg, borderColor: lbl.color + "40" }]}>
              <Text style={[scStyles.scoreNum, { color: lbl.color }]}>{lbl.text}</Text>
            </View>
          )}
          <Feather name="chevron-right" size={15} color="#CBD5E1" />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const scStyles = StyleSheet.create({
  card:      { backgroundColor: "#FFFFFF", borderRadius: 14, borderWidth: 1, borderColor: "#E2E8F0", paddingHorizontal: 14, paddingVertical: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  row:       { flexDirection: "row", alignItems: "center", gap: 12 },
  iconBox:   { width: 38, height: 38, borderRadius: 11, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  mid:       { flex: 1, gap: 6 },
  label:     { fontSize: 14, fontFamily: "PlusJakartaSans_600SemiBold", color: "#0F172A" },
  scoreBadge:{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, borderWidth: 1 },
  scoreNum:  { fontSize: 11, fontFamily: "PlusJakartaSans_700Bold" },
  lockBadge: { width: 30, height: 30, borderRadius: 9, backgroundColor: "#F8FAFC", borderWidth: 1, borderColor: "#E2E8F0", alignItems: "center", justifyContent: "center" },
});

// ─── Compatibility screen ─────────────────────────────────────────────────────

export default function CompatibilityScreen() {
  const insets = useSafeAreaInsets();
  const { user, partner, isPremium } = useApp();
  const [showGate,      setShowGate]      = useState(false);
  const [activeSection, setActiveSection] = useState<CompatibilitySection | null>(null);
  const [showShare,     setShowShare]     = useState(false);
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
  if (!reading) return <KundliLoading label="Calculating emotional chemistry…" />;

  const uRashi = RASHIS[reading.user.moonRashi];
  const pRashi = RASHIS[reading.partner.moonRashi];

  const dbBundle = getContentBundle();
  const dbCompatTexts: Record<string, string> = {};
  if (dbBundle?.compatibilityTexts?.length) {
    const vars = { u: user.name, p: partner.name, uElement: uRashi.element, pElement: pRashi.element, uSign: uRashi.en, pSign: pRashi.en };
    for (const item of dbBundle.compatibilityTexts) {
      const section = (item.meta as any)?.section as string | undefined;
      if (section) dbCompatTexts[section] = applyVars(item.body, vars);
    }
  }
  const personalizedTexts = getCompatibilityTexts(reading, partner.relationshipType);
  const baseData = calculateCompatibility(user.birthDate, partner.birthDate, user.name, partner.name, partner.relationshipType);
  const data = {
    ...baseData,
    overall: reading.guna.total,
    sections: baseData.sections.map((s) => ({
      ...s,
      text: dbCompatTexts[s.label] ?? personalizedTexts[s.label] ?? s.text,
      score: (() => {
        const kootaMap: Record<string, string> = {
          "Emotional Chemistry":        "Graha Maitri",
          "Communication Energy":       "Gana",
          "Attachment Dynamics":        "Yoni",
          "Emotional Tension":          "Nadi",
          "Long-Term Potential":        "Bhakoot",
          "Why This Feels Addictive":   "Tara",
          "Hidden Relationship Pattern":"Vashya",
        };
        const koota = reading.guna.breakdown.find((k) => k.name === kootaMap[s.label]);
        if (!koota) return s.score;
        return Math.round(32 + (koota.score / koota.max) * 54);
      })(),
    })),
  };

  return (
    <View style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={Platform.OS === "web" ? styles.webScroll : undefined}
        contentContainerStyle={[styles.scroll, {
          paddingTop:    insets.top + (Platform.OS === "web" ? 67 : 20),
          paddingBottom: insets.bottom + 100,
        }]}
      >
        {/* Header */}
        <View style={styles.headerBlock}>
          <View style={styles.headerRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.screenTitle}>You & {partner.name}</Text>
              <Text style={styles.screenSub}>What your birth charts actually say about this connection</Text>
            </View>
            <TouchableOpacity
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setShowShare(true); }}
              activeOpacity={0.75}
              style={styles.shareIconBtn}
            >
              <Feather name="share-2" size={18} color="#4A3DE8" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Overall score circle */}
        <ScoreCircle score={data.overall} />

        {/* Share nudge */}
        <TouchableOpacity
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setShowShare(true); }}
          activeOpacity={0.8}
          style={styles.shareNudge}
        >
          <Feather name="send" size={13} color="#4A3DE8" />
          <Text style={styles.shareNudgeText}>Share with {partner.name} and see if they agree</Text>
          <Feather name="chevron-right" size={13} color="#C7D2FE" />
        </TouchableOpacity>

        {/* Relationship type tags */}
        <View style={styles.tagRow}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{partner.relationshipType}</Text>
          </View>
          <View style={[styles.tag, { backgroundColor: "#EEF2FF", borderColor: "#C7D2FE" }]}>
            <Text style={[styles.tagText, { color: "#4A3DE8" }]}>Vedic analysis</Text>
          </View>
        </View>

        {/* Section cards */}
        <View style={styles.sectionsList}>
          {data.sections.map((section, i) => (
            <SectionCard
              key={section.label}
              section={section}
              index={i}
              isPremium={isPremium}
              onLockTap={() => setShowGate(true)}
              onDetailTap={() => setActiveSection(section)}
            />
          ))}
        </View>

        {/* Upgrade teaser */}
        {!isPremium && (
          <TouchableOpacity
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); setShowGate(true); }}
            activeOpacity={0.85}
            style={styles.upgradeBanner}
          >
            <View style={styles.upgradeBannerLeft}>
              <View style={styles.upgradeIcon}>
                <Feather name="lock" size={16} color="#4A3DE8" />
              </View>
              <View>
                <Text style={styles.upgradeBannerTitle}>See the full picture</Text>
                <Text style={styles.upgradeBannerSub}>2 deeper insights waiting, including your hidden pattern</Text>
              </View>
            </View>
            <View style={styles.upgradeBannerArrow}>
              <Feather name="arrow-right" size={16} color="#4A3DE8" />
            </View>
          </TouchableOpacity>
        )}

      </ScrollView>

      <PremiumGate visible={showGate} onClose={() => setShowGate(false)} featureName="Hidden Relationship Pattern" />
      {activeSection && <SectionDetailSheet section={activeSection} onClose={() => setActiveSection(null)} />}
      <ShareCardModal
        visible={showShare}
        onClose={() => setShowShare(false)}
        userName={user.name}
        partnerName={partner.name}
        compatibilityScore={data.overall}
        userMoonSign={uRashi.en}
        partnerMoonSign={pRashi.en}
        userElement={uRashi.element}
        partnerElement={pRashi.element}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root:     { flex: 1, backgroundColor: "#F7F5F0" },
  webScroll:{ maxWidth: 640, alignSelf: "center", width: "100%" },
  scroll:   { paddingHorizontal: 18, gap: 16 },

  headerBlock:{ gap: 4 },
  headerRow:  { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  screenTitle:{ fontSize: 26, fontFamily: "PlusJakartaSans_800ExtraBold", color: "#0F172A", letterSpacing: -0.4 },
  screenSub:  { fontSize: 13, fontFamily: "PlusJakartaSans_400Regular", color: "#64748B" },
  shareIconBtn:{ width: 42, height: 42, borderRadius: 13, backgroundColor: "#EEF2FF", borderWidth: 1, borderColor: "#C7D2FE", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 },

  shareNudge:     { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "#EEF2FF", borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1, borderColor: "#C7D2FE", justifyContent: "center" },
  shareNudgeText: { flex: 1, fontSize: 13, fontFamily: "PlusJakartaSans_600SemiBold", color: "#4A3DE8", textAlign: "center" },

  tagRow:  { flexDirection: "row", gap: 8, justifyContent: "center" },
  tag:     { borderWidth: 1, borderColor: "#E2E8F0", backgroundColor: "#F8FAFC", paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 },
  tagText: { fontSize: 12, fontFamily: "PlusJakartaSans_600SemiBold", color: "#64748B", textTransform: "capitalize" },

  sectionsList: { gap: 10 },

  upgradeBanner:     { flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "#FFFFFF", borderRadius: 16, borderWidth: 1, borderColor: "#C7D2FE", padding: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  upgradeBannerLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  upgradeIcon:       { width: 40, height: 40, borderRadius: 12, backgroundColor: "#EEF2FF", alignItems: "center", justifyContent: "center" },
  upgradeBannerTitle:{ fontSize: 15, fontFamily: "PlusJakartaSans_700Bold", color: "#0F172A" },
  upgradeBannerSub:  { fontSize: 12, fontFamily: "PlusJakartaSans_400Regular", color: "#64748B" },
  upgradeBannerArrow:{ width: 36, height: 36, borderRadius: 10, backgroundColor: "#EEF2FF", alignItems: "center", justifyContent: "center" },
});
