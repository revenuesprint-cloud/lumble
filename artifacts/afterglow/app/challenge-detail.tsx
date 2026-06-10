import { PremiumGate } from "@/components/PremiumGate";
import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";
import type { Challenge, ChallengeSolution } from "@/utils/challenges";
import { getLocalStates, saveChallengeState, removeChallengeState } from "@/utils/dbContent";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
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

const SEVERITY_COLOR: Record<string, string> = {
  mild: "#10B981", moderate: "#F59E0B", severe: "#F43F5E",
};
const SEVERITY_BG: Record<string, string> = {
  mild: "#ECFDF5", moderate: "#FFFBEB", severe: "#FFF1F2",
};
const SEVERITY_MEANING: Record<string, string> = {
  mild:     "Worth being aware of",
  moderate: "Actively affecting the dynamic",
  severe:   "The core tension in this connection",
};

const SOLUTION_TYPE_META: Record<ChallengeSolution["type"], { icon: string; label: string; color: string; bg: string }> = {
  practical:     { icon: "tool",           label: "Practical",       color: "#10B981", bg: "#ECFDF5" },
  communication: { icon: "message-circle", label: "Communication",   color: "#4A3DE8", bg: "#EEF2FF" },
  spiritual:     { icon: "sun",            label: "Spiritual",       color: "#F59E0B", bg: "#FFFBEB" },
  ritual:        { icon: "moon",           label: "Mindful Practice",color: "#8B5CF6", bg: "#F5F3FF" },
  professional:  { icon: "briefcase",      label: "Professional",    color: "#F43F5E", bg: "#FFF1F2" },
};

const STATE_META = {
  resonates:  { label: "This resonates",  icon: "heart",        color: "#F43F5E", bg: "#FFF1F2" },
  working_on: { label: "Working on this", icon: "activity",     color: "#F59E0B", bg: "#FFFBEB" },
  resolved:   { label: "Resolved ✓",      icon: "check-circle", color: "#10B981", bg: "#ECFDF5" },
};

function AcknowledgeBanner({
  currentState, onSelect, onRemove, styles,
}: {
  currentState: string | null;
  onSelect: (s: "resonates" | "working_on" | "resolved") => void;
  onRemove: () => void;
  styles: any;
}) {
  if (currentState) {
    const meta = STATE_META[currentState as keyof typeof STATE_META];
    return (
      <View style={[styles.stateBanner, { backgroundColor: meta.bg, borderColor: meta.color + "44" }]}>
        <Feather name={meta.icon as any} size={16} color={meta.color} />
        <Text style={[styles.stateBannerText, { color: meta.color }]}>{meta.label}</Text>
        <TouchableOpacity onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onRemove(); }} style={styles.stateClear}>
          <Feather name="x" size={14} color="#94A3B8" />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.acknowledgeBlock}>
      <Text style={styles.acknowledgeQuestion}>Does this resonate with you?</Text>
      <Text style={styles.acknowledgeHint}>Acknowledging a pattern is the first step to changing it.</Text>
      <View style={styles.acknowledgeButtons}>
        <TouchableOpacity
          style={styles.acknowledgeBtnPrimary}
          onPress={() => onSelect("resonates")}
          activeOpacity={0.8}
        >
          <View style={styles.acknowledgeBtnGrad}>
            <Feather name="heart" size={14} color="#fff" />
            <Text style={styles.acknowledgeBtnTextPrimary}>Yes, this is me</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.acknowledgeBtnSecondary}
          onPress={() => onSelect("working_on")}
          activeOpacity={0.8}
        >
          <Feather name="activity" size={14} color="#F59E0B" />
          <Text style={[styles.acknowledgeBtnText, { color: "#F59E0B" }]}>I'm working on it</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function SolutionCard({
  solution, isPremium, isAcknowledged, tried, onTry, onUnlockPress, styles,
}: {
  solution: ChallengeSolution; isPremium: boolean; isAcknowledged: boolean;
  tried: boolean; onTry: () => void; onUnlockPress: () => void; styles: any;
}) {
  const meta   = SOLUTION_TYPE_META[solution.type];
  const locked = solution.isPremium && !isPremium;
  const borderColor = tried ? meta.color + "60" : styles._border;

  return (
    <View style={[styles.solutionCard, { borderColor }]}>
      <View style={[styles.solutionAccent, { backgroundColor: meta.color }]} />
      <View style={styles.solutionContent}>
        <View style={styles.solutionHeader}>
          <View style={[styles.solutionIconBg, { backgroundColor: meta.bg }]}>
            <Feather name={meta.icon as any} size={14} color={meta.color} />
          </View>
          <Text style={[styles.solutionType, { color: meta.color }]}>{meta.label}</Text>
          {solution.isPremium && (
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumBadgeText}>Premium</Text>
            </View>
          )}
          {tried && (
            <View style={styles.triedBadge}>
              <Text style={styles.triedText}>Trying this</Text>
            </View>
          )}
        </View>

        <Text style={styles.solutionTitle} numberOfLines={2}>{solution.title}</Text>

        {locked ? (
          <TouchableOpacity style={styles.unlockRow} onPress={onUnlockPress} activeOpacity={0.8}>
            <Feather name="lock" size={13} color="#94A3B8" />
            <Text style={styles.unlockText}>Unlock with Premium to see this step</Text>
          </TouchableOpacity>
        ) : (
          <>
            <Text style={styles.solutionDesc}>{solution.description}</Text>
            {isAcknowledged && !tried && (
              <TouchableOpacity style={styles.tryBtn} onPress={onTry} activeOpacity={0.8}>
                <Feather name="check" size={13} color="#10B981" />
                <Text style={styles.tryBtnText}>I'll try this</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    </View>
  );
}

export default function ChallengeDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { isPremium } = useApp();
  const { jwtToken } = useAuth();
  const c = useColors();
  const styles = useMemo(() => createStyles(c), [c]);
  const [showPremiumGate, setShowPremiumGate] = useState(false);
  const [challengeState,  setChallengeState]  = useState<string | null>(null);
  const [triedSolutions,  setTriedSolutions]  = useState<Set<number>>(new Set());
  const acknowledgeAnim = useRef(new Animated.Value(0)).current;

  const params = useLocalSearchParams<{ data: string }>();
  let challenge: Challenge | null = null;
  try { challenge = JSON.parse(params.data ?? "null") as Challenge; } catch {}

  useEffect(() => {
    if (!challenge?.id) return;
    getLocalStates().then((states) => {
      const s = states[challenge!.id];
      if (s) setChallengeState(s);
    });
  }, [challenge?.id]);

  useEffect(() => {
    if (challengeState) {
      Animated.spring(acknowledgeAnim, { toValue: 1, useNativeDriver: true, tension: 100, friction: 7 }).start();
    }
  }, [challengeState]);

  if (!challenge) {
    return (
      <View style={{ flex: 1, backgroundColor: c.background }}>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 10 }}>
          <TouchableOpacity onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.back(); }} style={[styles.backBtn, { position: "absolute", top: insets.top + 12, left: 20 }]}>
            <Feather name="arrow-left" size={22} color={c.textMuted} />
          </TouchableOpacity>
          <Text style={{ color: c.textFaint, fontFamily: "PlusJakartaSans_400Regular", fontSize: 15 }}>Challenge not found.</Text>
        </View>
      </View>
    );
  }

  const severityColor   = SEVERITY_COLOR[challenge.severity] ?? "#4A3DE8";
  const severityBg      = SEVERITY_BG[challenge.severity]    ?? c.primaryLight;
  const solutions       = (challenge.solutions ?? []) as ChallengeSolution[];
  const isAcknowledged  = !!challengeState;

  const handleStateSelect = async (state: "resonates" | "working_on" | "resolved") => {
    setChallengeState(state);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try { await saveChallengeState(challenge!.id, state, jwtToken ?? ""); } catch {}
  };

  const handleRemoveState = async () => {
    setChallengeState(null);
    setTriedSolutions(new Set());
    try { await removeChallengeState(challenge!.id, jwtToken ?? ""); } catch {}
  };

  const handleTrySolution = (index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTriedSolutions((prev) => { const n = new Set(prev); n.add(index); return n; });
    if (challengeState === "resonates") handleStateSelect("working_on");
  };

  return (
    <View style={{ flex: 1, backgroundColor: c.background }}>
      {/* Fixed header */}
      <View style={[styles.fixedHeader, { paddingTop: insets.top + (Platform.OS === "web" ? 67 : 12) }]}>
        <TouchableOpacity
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.back(); }}
          style={styles.backBtn}
          activeOpacity={0.7}
        >
          <Feather name="arrow-left" size={20} color={c.textMuted} />
        </TouchableOpacity>
        <Text style={styles.fixedHeaderTitle} numberOfLines={1}>{challenge.title}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={Platform.OS === "web" ? { maxWidth: 640, alignSelf: "center", width: "100%" } : undefined}
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 100 }]}
      >
        {/* Hero card */}
        <View style={[styles.heroCard, { borderColor: severityColor + "30" }]}>
          <View style={[styles.heroAccent, { backgroundColor: severityColor }]} />
          <View style={styles.heroContent}>
            <View style={styles.heroTopRow}>
              <View style={[styles.severityPill, { backgroundColor: severityBg, borderColor: severityColor + "44" }]}>
                <View style={[styles.severityDot, { backgroundColor: severityColor }]} />
                <Text style={[styles.severityText, { color: severityColor }]}>{challenge.severity}</Text>
              </View>
              <View style={styles.categoryPill}>
                <Text style={styles.categoryText}>{challenge.category}</Text>
              </View>
            </View>
            <Text style={[styles.severityMeaning, { color: severityColor }]}>
              {SEVERITY_MEANING[challenge.severity] ?? ""}
            </Text>
            <Text style={styles.heroTitle} numberOfLines={2}>{challenge.title}</Text>
            <Text style={styles.heroDesc}>{challenge.description}</Text>
            <View style={styles.matchRow}>
              <Feather name="target" size={12} color="#4A3DE8" />
              <Text style={styles.matchText}>
                Matched {challenge.match_score ?? "?"} compatibility indicator{challenge.match_score !== 1 ? "s" : ""} in your profile
              </Text>
            </View>
          </View>
        </View>

        <AcknowledgeBanner
          currentState={challengeState}
          onSelect={handleStateSelect}
          onRemove={handleRemoveState}
          styles={styles}
        />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Steps to Try</Text>
          <Text style={styles.sectionSub}>{solutions.length} options</Text>
        </View>

        {!isAcknowledged && (
          <View style={styles.solutionsHint}>
            <Feather name="info" size={12} color="#4A3DE8" />
            <Text style={styles.solutionsHintText}>Tap "Yes, this is me" above to start tracking which steps you're trying.</Text>
          </View>
        )}

        {isAcknowledged && triedSolutions.size > 0 && (
          <View style={styles.progressRow}>
            <Feather name="activity" size={13} color="#F59E0B" />
            <Text style={styles.progressText}>
              You're trying {triedSolutions.size} of {solutions.filter(s => !s.isPremium || isPremium).length} available remedies
            </Text>
          </View>
        )}

        <Animated.View style={{
          opacity: 1,
          transform: [{ translateY: acknowledgeAnim.interpolate({ inputRange: [0, 1], outputRange: [8, 0] }) }],
          gap: 12,
        }}>
          {solutions.map((solution, i) => (
            <SolutionCard
              key={i}
              solution={solution}
              isPremium={isPremium}
              isAcknowledged={isAcknowledged}
              tried={triedSolutions.has(i)}
              onTry={() => handleTrySolution(i)}
              onUnlockPress={() => setShowPremiumGate(true)}
              styles={{ ...styles, _border: c.border }}
            />
          ))}
        </Animated.View>

        {isAcknowledged && challengeState !== "resolved" && triedSolutions.size >= 1 && (
          <TouchableOpacity
            style={styles.resolvedBtn}
            onPress={() => handleStateSelect("resolved")}
            activeOpacity={0.8}
          >
            <Feather name="check-circle" size={14} color="#10B981" />
            <Text style={styles.resolvedBtnText}>Mark this pattern as resolved</Text>
          </TouchableOpacity>
        )}

        <View style={styles.noteCard}>
          <Feather name="info" size={13} color="#4A3DE8" style={{ marginTop: 1 }} />
          <Text style={styles.noteText}>
            These patterns are identified from your personality profiles and compatibility data. They're here to support your self-awareness — not replace professional help when you need it.
          </Text>
        </View>
      </ScrollView>

      <PremiumGate visible={showPremiumGate} onClose={() => setShowPremiumGate(false)} featureName="Premium Remedies" />
    </View>
  );
}

function createStyles(c: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    fixedHeader:      { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 18, paddingBottom: 12, backgroundColor: c.background, borderBottomWidth: 1, borderBottomColor: c.border },
    fixedHeaderTitle: { flex: 1, fontSize: 15, fontFamily: "PlusJakartaSans_600SemiBold", color: c.text },
    scroll:           { paddingHorizontal: 20, paddingTop: 14, gap: 14 },
    backBtn:          { width: 40, height: 40, borderRadius: 14, backgroundColor: c.card, borderWidth: 1, borderColor: c.border, alignItems: "center", justifyContent: "center", flexShrink: 0 },

    heroCard:       { backgroundColor: c.card, borderRadius: 20, borderWidth: 1, flexDirection: "row", overflow: "hidden",
                      shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 2 },
    heroAccent:     { width: 4 },
    heroContent:    { flex: 1, padding: 22, gap: 12 },
    heroTopRow:     { flexDirection: "row", gap: 8, flexWrap: "wrap" },
    severityPill:   { flexDirection: "row", alignItems: "center", gap: 6, borderWidth: 1, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 },
    severityDot:    { width: 7, height: 7, borderRadius: 4 },
    severityText:   { fontSize: 12, fontFamily: "PlusJakartaSans_600SemiBold", textTransform: "capitalize" },
    severityMeaning:{ fontSize: 13, fontFamily: "PlusJakartaSans_500Medium", lineHeight: 19 },
    categoryPill:   { backgroundColor: c.primaryLight, borderWidth: 1, borderColor: c.primaryBorder, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 },
    categoryText:   { fontSize: 12, fontFamily: "PlusJakartaSans_500Medium", color: "#4A3DE8" },
    heroTitle:      { fontSize: 22, fontFamily: "PlusJakartaSans_700Bold", color: c.text, lineHeight: 30 },
    heroDesc:       { fontSize: 15, fontFamily: "PlusJakartaSans_400Regular", color: c.textMuted, lineHeight: 24 },
    matchRow:       { flexDirection: "row", alignItems: "center", gap: 6 },
    matchText:      { fontSize: 13, fontFamily: "PlusJakartaSans_400Regular", color: "#4A3DE8" },

    acknowledgeBlock:        { backgroundColor: c.card, borderWidth: 1, borderColor: c.border, borderRadius: 20, padding: 20, gap: 10,
                               shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 1 },
    acknowledgeQuestion:     { fontSize: 20, fontFamily: "PlusJakartaSans_700Bold", color: c.text },
    acknowledgeHint:         { fontSize: 14, fontFamily: "PlusJakartaSans_400Regular", color: c.textMuted, lineHeight: 22 },
    acknowledgeButtons:      { flexDirection: "row", gap: 10, marginTop: 4 },
    acknowledgeBtnPrimary:   { flex: 1, borderRadius: 22, overflow: "hidden" },
    acknowledgeBtnSecondary: { flex: 1, backgroundColor: c.goldLight, borderWidth: 1, borderColor: c.goldBorder, borderRadius: 22,
                               flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7, paddingVertical: 14 },
    acknowledgeBtnGrad:      { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7, paddingVertical: 14, backgroundColor: c.cta },
    acknowledgeBtnTextPrimary:{ fontSize: 14, fontFamily: "PlusJakartaSans_700Bold", color: c.ctaForeground },
    acknowledgeBtnText:      { fontSize: 14, fontFamily: "PlusJakartaSans_600SemiBold" },

    stateBanner:     { flexDirection: "row", alignItems: "center", gap: 9, borderWidth: 1, borderRadius: 16, paddingHorizontal: 16, paddingVertical: 12 },
    stateBannerText: { flex: 1, fontSize: 14, fontFamily: "PlusJakartaSans_600SemiBold" },
    stateClear:      { padding: 4 },

    sectionHeader:   { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" },
    sectionTitle:    { fontSize: 11, fontFamily: "PlusJakartaSans_700Bold", color: c.textFaint, textTransform: "uppercase", letterSpacing: 1.2 },
    sectionSub:      { fontSize: 13, fontFamily: "PlusJakartaSans_400Regular", color: c.textFaint },
    solutionsHint:   { flexDirection: "row", gap: 9, alignItems: "flex-start" },
    solutionsHintText:{ flex: 1, fontSize: 13, fontFamily: "PlusJakartaSans_400Regular", color: "#4A3DE8", lineHeight: 20 },
    progressRow:     { flexDirection: "row", alignItems: "center", gap: 9 },
    progressText:    { fontSize: 14, fontFamily: "PlusJakartaSans_500Medium", color: "#F59E0B" },

    solutionCard:    { backgroundColor: c.card, borderRadius: 18, borderWidth: 1, flexDirection: "row", overflow: "hidden",
                       shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 1 },
    solutionAccent:  { width: 4 },
    solutionContent: { flex: 1, padding: 18, gap: 10 },
    solutionHeader:  { flexDirection: "row", alignItems: "center", gap: 8 },
    solutionIconBg:  { width: 30, height: 30, borderRadius: 15, alignItems: "center", justifyContent: "center" },
    solutionType:    { fontSize: 12, fontFamily: "PlusJakartaSans_600SemiBold" },
    premiumBadge:    { marginLeft: "auto", backgroundColor: c.goldLight, borderWidth: 1, borderColor: c.goldBorder, borderRadius: 11, paddingHorizontal: 9, paddingVertical: 3 },
    premiumBadgeText:{ fontSize: 10, fontFamily: "PlusJakartaSans_600SemiBold", color: "#D97706" },
    triedBadge:      { marginLeft: "auto", backgroundColor: "#ECFDF5", borderWidth: 1, borderColor: "#A7F3D0", borderRadius: 11, paddingHorizontal: 9, paddingVertical: 3 },
    triedText:       { fontSize: 10, fontFamily: "PlusJakartaSans_600SemiBold", color: "#10B981" },
    solutionTitle:   { fontSize: 17, fontFamily: "PlusJakartaSans_700Bold", color: c.text },
    solutionDesc:    { fontSize: 14, fontFamily: "PlusJakartaSans_400Regular", color: c.textMuted, lineHeight: 22 },
    tryBtn:          { flexDirection: "row", alignItems: "center", gap: 7, alignSelf: "flex-start", marginTop: 4, backgroundColor: "#ECFDF5", borderWidth: 1, borderColor: "#A7F3D0", borderRadius: 14, paddingHorizontal: 14, paddingVertical: 8 },
    tryBtnText:      { fontSize: 13, fontFamily: "PlusJakartaSans_600SemiBold", color: "#10B981" },
    unlockRow:       { flexDirection: "row", alignItems: "center", gap: 9, paddingVertical: 12, paddingHorizontal: 14, backgroundColor: c.input, borderRadius: 12, borderWidth: 1, borderColor: c.border },
    unlockText:      { fontSize: 14, fontFamily: "PlusJakartaSans_400Regular", color: c.textFaint, fontStyle: "italic" },

    resolvedBtn:     { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 9, backgroundColor: "#ECFDF5", borderWidth: 1, borderColor: "#A7F3D0", borderRadius: 16, paddingVertical: 16 },
    resolvedBtnText: { fontSize: 15, fontFamily: "PlusJakartaSans_600SemiBold", color: "#10B981" },

    noteCard:  { flexDirection: "row", gap: 10, padding: 16, backgroundColor: c.primaryLight, borderRadius: 14, borderWidth: 1, borderColor: c.primaryBorder },
    noteText:  { flex: 1, fontSize: 13, fontFamily: "PlusJakartaSans_400Regular", color: "#4A3DE8", lineHeight: 20 },
  });
}
