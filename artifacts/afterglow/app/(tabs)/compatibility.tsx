import { AnimatedBar } from "@/components/AnimatedBar";
import { PremiumGate } from "@/components/PremiumGate";
import { ShareCardModal } from "@/components/ShareCardModal";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
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
  BackHandler,
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
  const c = useColors();
  const scoreStylesMemo = useMemo(() => createScoreStyles(c), [c]);
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
    <Animated.View style={[scoreStylesMemo.wrap, { transform: [{ scale: scaleAnim }] }]}>
      <View style={[scoreStylesMemo.orb, { backgroundColor: colorBg, borderColor: color + "40", width: ORB_SIZE, height: ORB_SIZE, borderRadius: ORB_SIZE / 2 }]}>
        <Text style={[scoreStylesMemo.pct, { color }]} adjustsFontSizeToFit numberOfLines={1} minimumFontScale={0.6}>
          {pct}<Text style={scoreStylesMemo.pctSign}>%</Text>
        </Text>
        <Text style={scoreStylesMemo.orbLabel}>compatibility</Text>
        <View style={[scoreStylesMemo.verdictPill, { backgroundColor: color + "18", borderColor: color + "40" }]}>
          <Text style={[scoreStylesMemo.verdictText, { color }]}>{verdict}</Text>
        </View>
        <Text style={scoreStylesMemo.orbHint}>from your birth charts</Text>
      </View>
    </Animated.View>
  );
}

function createScoreStyles(c: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    wrap:        { alignItems: "center", paddingVertical: 8 },
    orb:         { alignItems: "center", justifyContent: "center", borderWidth: 2, gap: 3 },
    pct:         { fontSize: 44, fontFamily: "PlusJakartaSans_800ExtraBold" },
    pctSign:     { fontSize: 22, fontFamily: "PlusJakartaSans_400Regular", color: c.textFaint },
    orbLabel:    { fontSize: 10, fontFamily: "PlusJakartaSans_500Medium", color: c.textMuted, textTransform: "uppercase", letterSpacing: 0.6 },
    verdictPill: { borderWidth: 1, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3, marginTop: 2 },
    verdictText: { fontSize: 11, fontFamily: "PlusJakartaSans_700Bold" },
    orbHint:     { fontSize: 10, fontFamily: "PlusJakartaSans_400Regular", color: c.textFaint, textAlign: "center", marginTop: 1 },
  });
}

// ─── Section deep content ─────────────────────────────────────────────────────

const SECTION_DEEP: Record<string, { headline: string; points: string[]; askPrompt: string }> = {
  "Emotional Chemistry": {
    headline: "What this connection is actually built on",
    points: [
      "The pull you feel is real — it is grounded in how your emotional natures actually interact, not just timing or circumstance. That is what makes it harder to either ignore or walk away from cleanly.",
      "Chemistry without shared direction tends to hold two people in place. You can feel the spark for a long time and still end up exactly where you started, because the feeling becomes the goal instead of a starting point.",
      "Most couples with strong chemistry underinvest in the ordinary stuff — logistics, low-stakes conversations, conflict that is not dramatic. That is where chemistry either deepens into something lasting or stays as just a feeling.",
      "Avoid the trap of testing the connection instead of building on it. Each 'will they, won't they' cycle feels electric but costs something real, usually trust, and trust is harder to rebuild than it looks.",
      "Try this today: tell them one specific thing you appreciate about how they show up for you. Concrete beats general. Notice how they receive it — that tells you more about where this goes than any feeling does.",
    ],
    askPrompt: "Why does the chemistry between us feel so strong?",
  },
  "Communication Energy": {
    headline: "Why talking feels harder than it should",
    points: [
      "You process things differently — one of you leads with feeling, the other with analysis or silence. Neither is wrong. The breakdown happens when the one who needs more time stops signalling that they are still engaged.",
      "The most common version of this gap: one person thinks the conversation is over, the other thinks it never really started. You are both right. You are just talking about different conversations.",
      "Timing matters more than content between you. The same words land completely differently depending on whether they come at the right moment or mid-defensiveness. Learning each other's open versus closed windows is the real skill here.",
      "Most communication fixes focus on what to say. Your actual lever is how you signal safety. When the other person feels they won't be judged or cut off, they will tell you almost everything.",
      "Before your next important conversation, say: 'I want to talk about something — is now a good time?' That single question prevents most of the miscommunication between you, because it separates timing from content.",
    ],
    askPrompt: "Why do we keep misunderstanding each other even when we're both trying?",
  },
  "Attachment Dynamics": {
    headline: "The push-pull and what is underneath it",
    points: [
      "One of you moves closer when things feel good and the other pulls back when things get real. This creates a rhythm that feels like electricity but is actually two people managing fear in opposite directions.",
      "The moments of genuine closeness feel extraordinary precisely because of the uncertainty around them. After a while, your nervous system starts calling that cycle love when it is actually a loop you are both stuck in.",
      "The one who pursues is not clingy — they are anxious. The one who withdraws is not cold — they are overwhelmed. Both responses make complete sense. They just keep colliding at the worst possible moments.",
      "Name the pattern together when you are both calm, not in the middle of it. Saying 'I notice we do this thing where one of us gets close and then one of us steps back' changes the dynamic immediately, because naming it makes it visible.",
      "Next time you feel the impulse to pursue or withdraw, pause for 60 seconds first. Ask yourself what you actually need in that moment — not what feels urgent. That gap between impulse and action is exactly where this pattern starts to shift.",
    ],
    askPrompt: "Why do I feel close to them one day and distant the next?",
  },
  "Emotional Tension": {
    headline: "What the tension is actually telling you",
    points: [
      "Tension between two people who care about each other is almost never about what it looks like on the surface. It is where two or three specific unspoken things are living. Both of you know what those things are, even if you have agreed not to name them.",
      "Emotional tension is usually a sign that at least one person is holding something they are afraid to say out loud. The tension you feel is that held thing pressing outward, looking for a way out.",
      "Resolving the argument does not resolve the tension. The argument is a symptom. The tension goes away when the underlying need or fear gets named directly — which is uncomfortable, which is exactly why it usually does not happen.",
      "There is a version of this tension that functions almost like intimacy — the charged feeling of being around someone who matters deeply. When it tips into chronic friction, that ratio has shifted and something real needs to be said.",
      "In a genuinely calm moment, try saying: 'I notice there is something between us that keeps surfacing. I want to understand what it actually is.' Said without blame, that question opens almost every door that tension keeps closed.",
    ],
    askPrompt: "Why does the same tension keep coming up between us no matter what we do?",
  },
  "Long-Term Potential": {
    headline: "What staying would actually look like",
    points: [
      "Long-term potential is genuinely present in this connection, but it is not automatic. The raw material is there — the question is whether both of you are willing to choose depth over comfort when those two things start to feel like different options.",
      "Most connections with real potential fail not because of incompatibility but because neither person was willing to go first into the vulnerable conversation. Someone has to move first. That is not a weakness — it is the whole thing.",
      "Long-term does not mean easy. It means both people keep choosing to work on the same problems instead of finding new ones. The areas of friction in your chart are also the areas that build something genuinely lasting, if both of you are willing to stay with them.",
      "The relationship you have right now and the one you are capable of having are genuinely different things. What exists between you today is the floor, not the ceiling. Most couples never find out what the ceiling is.",
      "Ask yourself — and eventually ask them — one honest question: are we both actively choosing this, or are we both waiting for the other person to make it safe enough to choose? Only one of those answers actually goes somewhere.",
    ],
    askPrompt: "Do we actually have a future together, or are we just comfortable?",
  },
  "Why This Feels Addictive": {
    headline: "What you are actually attached to",
    points: [
      "The addiction is specific. You found someone who makes you feel genuinely known — not just liked or wanted or useful, but actually seen for something real. That experience does not happen often. Once it does, the mind does not release it without a fight.",
      "The pull back is almost always to that feeling of recognition — being fully seen. Once you have had it, ordinary connection feels like something is missing. It is worth sitting with whether you are attached to this person or to what they reflect back to you about yourself.",
      "There is a version of this that is healthy: you are deeply drawn because the connection is genuinely rare and worth protecting. There is a version that is a loop: the highs and lows have trained your nervous system to need the cycle itself, not the person.",
      "Intensity and depth feel almost identical in the short term. Long-term, they are completely different. Intensity has to be recreated, usually through drama or distance. Depth compounds quietly over time.",
      "This is not a reason to leave or a reason to stay. It is information. Knowing what you are actually attached to gives you the ability to make a real, grounded choice instead of just responding to the pull every time it surfaces.",
    ],
    askPrompt: "Why can't I stop thinking about them even when I know I should?",
  },
  "Hidden Relationship Pattern": {
    headline: "The pattern running underneath everything",
    points: [
      "Both of you are more afraid of actually getting what you want here than of not getting it. That fear — not incompatibility — is the engine running most of the distance, ambiguity, and cycles between you.",
      "There is almost certainly a testing pattern at work: small actions and small withdrawals designed to find out whether the other person will stay. The test never officially ends because neither of you has decided it is safe enough to stop running it.",
      "This pattern predates you both — it is something each of you brought in from earlier. The relationship did not create it. It revealed it. That is actually useful, because what is visible can be worked on consciously.",
      "The pattern feels like it is about the other person. Most of it is about what you believe, deep down, you are allowed to have. People recreate the emotional environments that feel familiar, even when those environments hurt — because familiar feels like safe.",
      "The only move that changes this is one person going first into genuine openness without a guarantee it will be matched. Everything else keeps the loop running. It is uncomfortable. It is also the only thing that actually works.",
    ],
    askPrompt: "What is the real pattern underneath everything between us?",
  },
};

// ─── Section detail sheet ─────────────────────────────────────────────────────

const SCREEN_H = Dimensions.get("window").height;

function SectionDetailSheet({ section, onClose }: { section: CompatibilitySection; onClose: () => void }) {
  const insets    = useSafeAreaInsets();
  const router    = useRouter();
  const c         = useColors();
  const sheetStylesMemo = useMemo(() => createSheetStyles(c), [c]);
  const scrollRef = useRef<ScrollView>(null);
  const slideAnim = useRef(new Animated.Value(SCREEN_H)).current;
  const lbl  = sectionStrength(section.score);
  const deep = SECTION_DEEP[section.label];

  useEffect(() => {
    Animated.spring(slideAnim, { toValue: 0, friction: 9, tension: 100, useNativeDriver: true }).start();
  }, []);

  const close = () => {
    Animated.timing(slideAnim, { toValue: SCREEN_H, duration: 280, easing: Easing.in(Easing.cubic), useNativeDriver: true }).start(onClose);
  };

  useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => { close(); return true; });
    return () => sub.remove();
  }, []);

  const handleAskOracle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    close();
    setTimeout(() => router.push("/(tabs)/guidance"), 320);
  };

  return (
    <Animated.View style={[sheetStylesMemo.page, { transform: [{ translateY: slideAnim }] }]}>
      <View style={[sheetStylesMemo.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={close} style={sheetStylesMemo.backBtn} activeOpacity={0.7}>
          <Feather name="arrow-left" size={20} color={c.textMuted} />
        </TouchableOpacity>
        <View style={[sheetStylesMemo.iconCircle, { backgroundColor: section.color + "14" }]}>
          <View style={[sheetStylesMemo.iconDot, { backgroundColor: section.color }]} />
        </View>
        <Text style={sheetStylesMemo.title} numberOfLines={1}>{section.label}</Text>
        <View style={[sheetStylesMemo.badge, { backgroundColor: lbl.bg, borderColor: lbl.color + "44" }]}>
          <Text style={[sheetStylesMemo.badgeText, { color: lbl.color }]}>{lbl.text}</Text>
        </View>
      </View>

      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[sheetStylesMemo.scroll, { paddingBottom: insets.bottom + 40 }]}
      >
        <AnimatedBar value={section.score} color={section.color} color2={section.color + "88"} delay={120} height={8} />
        <View style={sheetStylesMemo.divider} />
        <Text style={sheetStylesMemo.body}>{section.text}</Text>

        {deep && (
          <View style={sheetStylesMemo.deepBlock}>
            <Text style={[sheetStylesMemo.deepHeadline, { color: section.color }]}>{deep.headline}</Text>
            {deep.points.map((pt, i) => (
              <View key={i} style={sheetStylesMemo.deepPoint}>
                <View style={[sheetStylesMemo.deepDot, { backgroundColor: section.color }]} />
                <Text style={sheetStylesMemo.deepText}>{pt}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={sheetStylesMemo.ctaBlock}>
          <TouchableOpacity
            onPress={handleAskOracle}
            style={[sheetStylesMemo.oracleBtn, { backgroundColor: section.color }]}
            activeOpacity={0.85}
          >
            <Feather name="message-circle" size={16} color="#FFFFFF" />
            <Text style={sheetStylesMemo.oracleBtnText}>Ask the oracle about this</Text>
            <Feather name="arrow-right" size={15} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={close} style={sheetStylesMemo.doneBtn} activeOpacity={0.7}>
            <Text style={sheetStylesMemo.doneBtnText}>I already know this one</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Animated.View>
  );
}

function createSheetStyles(c: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    page:      { ...StyleSheet.absoluteFillObject, zIndex: 200, backgroundColor: c.card },
    header:    { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: c.borderLight },
    backBtn:   { width: 40, height: 40, borderRadius: 12, backgroundColor: c.input, borderWidth: 1, borderColor: c.border, alignItems: "center", justifyContent: "center" },
    iconCircle:{ width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center" },
    iconDot:   { width: 10, height: 10, borderRadius: 5 },
    title:     { flex: 1, fontSize: 17, fontFamily: "PlusJakartaSans_700Bold", color: c.text },
    badge:     { borderRadius: 20, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 4 },
    badgeText: { fontSize: 11, fontFamily: "PlusJakartaSans_600SemiBold" },

    scroll:    { paddingHorizontal: 24, paddingTop: 28, gap: 20 },
    divider:   { height: 1, backgroundColor: c.borderLight },
    body:      { fontSize: 17, fontFamily: "PlusJakartaSans_400Regular", color: c.textBody, lineHeight: 29 },

    deepBlock:    { gap: 14, backgroundColor: c.input, borderRadius: 16, borderWidth: 1, borderColor: c.border, padding: 18 },
    deepHeadline: { fontSize: 14, fontFamily: "PlusJakartaSans_700Bold", lineHeight: 20 },
    deepPoint:    { flexDirection: "row", gap: 12, alignItems: "flex-start" },
    deepDot:      { width: 7, height: 7, borderRadius: 4, marginTop: 8, flexShrink: 0 },
    deepText:     { flex: 1, fontSize: 15, fontFamily: "PlusJakartaSans_400Regular", color: c.textBody, lineHeight: 24 },

    ctaBlock:     { gap: 10 },
    oracleBtn:    { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 9, borderRadius: 16, paddingVertical: 16 },
    oracleBtnText:{ fontSize: 15, fontFamily: "PlusJakartaSans_700Bold", color: "#FFFFFF" },
    doneBtn:      { alignItems: "center", paddingVertical: 16, backgroundColor: c.input, borderRadius: 16, borderWidth: 1, borderColor: c.border },
    doneBtnText:  { fontSize: 15, fontFamily: "PlusJakartaSans_600SemiBold", color: c.textMuted },
  });
}

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
  const c = useColors();
  const scStylesMemo = useMemo(() => createSectionCardStyles(c), [c]);
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
        style={scStylesMemo.card}
      >
        <View style={scStylesMemo.row}>
          <View style={[scStylesMemo.iconBox, { backgroundColor: section.color + "15" }]}>
            <Text style={{ fontSize: 17 }}>{icon}</Text>
          </View>
          <View style={scStylesMemo.mid}>
            <Text style={scStylesMemo.label}>{section.label}</Text>
            {!isLocked && (
              <Text style={scStylesMemo.preview} numberOfLines={2}>{section.text}</Text>
            )}
            {!isLocked && (
              <AnimatedBar value={section.score} color={section.color} color2={section.color + "70"} delay={index * 80 + 300} height={4} />
            )}
          </View>
          {isLocked ? (
            <View style={scStylesMemo.lockBadge}>
              <Feather name="lock" size={12} color={c.textFaint} />
            </View>
          ) : (
            <View style={[scStylesMemo.scoreBadge, { backgroundColor: lbl.bg, borderColor: lbl.color + "40" }]}>
              <Text style={[scStylesMemo.scoreNum, { color: lbl.color }]}>{lbl.text}</Text>
            </View>
          )}
          <Feather name="chevron-right" size={15} color={c.borderLight} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

function createSectionCardStyles(c: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    card:      { backgroundColor: c.card, borderRadius: 14, borderWidth: 1, borderColor: c.border, paddingHorizontal: 14, paddingVertical: 14, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
    row:       { flexDirection: "row", alignItems: "flex-start", gap: 12 },
    iconBox:   { width: 38, height: 38, borderRadius: 11, alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 },
    mid:       { flex: 1, gap: 5 },
    label:     { fontSize: 13, fontFamily: "PlusJakartaSans_700Bold", color: c.text },
    preview:   { fontSize: 12, fontFamily: "PlusJakartaSans_400Regular", color: c.textMuted, lineHeight: 17 },
    scoreBadge:{ paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20, borderWidth: 1, marginTop: 1 },
    scoreNum:  { fontSize: 10, fontFamily: "PlusJakartaSans_700Bold" },
    lockBadge: { width: 30, height: 30, borderRadius: 9, backgroundColor: c.input, borderWidth: 1, borderColor: c.border, alignItems: "center", justifyContent: "center", marginTop: 1 },
  });
}

// ─── Compatibility screen ─────────────────────────────────────────────────────

export default function CompatibilityScreen() {
  const insets = useSafeAreaInsets();
  const { user, partner, isPremium } = useApp();
  const c = useColors();
  const styles = useMemo(() => createStyles(c), [c]);
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
          <Feather name="chevron-right" size={13} color={c.primaryBorder} />
        </TouchableOpacity>

        {/* Relationship type tags */}
        <View style={styles.tagRow}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{partner.relationshipType}</Text>
          </View>
          <View style={[styles.tag, { backgroundColor: c.primaryLight, borderColor: c.primaryBorder }]}>
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

function createStyles(c: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    root:     { flex: 1, backgroundColor: c.background },
    webScroll:{ maxWidth: 640, alignSelf: "center", width: "100%" },
    scroll:   { paddingHorizontal: 18, gap: 16 },

    headerBlock:{ gap: 4 },
    headerRow:  { flexDirection: "row", alignItems: "flex-start", gap: 12 },
    screenTitle:{ fontSize: 26, fontFamily: "PlusJakartaSans_800ExtraBold", color: c.text, letterSpacing: -0.4 },
    screenSub:  { fontSize: 13, fontFamily: "PlusJakartaSans_400Regular", color: c.textMuted },
    shareIconBtn:{ width: 42, height: 42, borderRadius: 13, backgroundColor: c.primaryLight, borderWidth: 1, borderColor: c.primaryBorder, alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 },

    shareNudge:     { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: c.primaryLight, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1, borderColor: c.primaryBorder, justifyContent: "center" },
    shareNudgeText: { flex: 1, fontSize: 13, fontFamily: "PlusJakartaSans_600SemiBold", color: "#4A3DE8", textAlign: "center" },

    tagRow:  { flexDirection: "row", gap: 8, justifyContent: "center" },
    tag:     { borderWidth: 1, borderColor: c.border, backgroundColor: c.input, paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 },
    tagText: { fontSize: 12, fontFamily: "PlusJakartaSans_600SemiBold", color: c.textMuted, textTransform: "capitalize" },

    sectionsList: { gap: 10 },

    upgradeBanner:     { flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: c.card, borderRadius: 16, borderWidth: 1, borderColor: c.primaryBorder, padding: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
    upgradeBannerLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
    upgradeIcon:       { width: 40, height: 40, borderRadius: 12, backgroundColor: c.primaryLight, alignItems: "center", justifyContent: "center" },
    upgradeBannerTitle:{ fontSize: 15, fontFamily: "PlusJakartaSans_700Bold", color: c.text },
    upgradeBannerSub:  { fontSize: 12, fontFamily: "PlusJakartaSans_400Regular", color: c.textMuted },
    upgradeBannerArrow:{ width: 36, height: 36, borderRadius: 10, backgroundColor: c.primaryLight, alignItems: "center", justifyContent: "center" },
  });
}
