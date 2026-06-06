import { GlowCard } from "@/components/GlowCard";
import { PremiumGate } from "@/components/PremiumGate";
import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import type { Challenge, ChallengeSolution } from "@/utils/challenges";
import { getLocalStates, saveChallengeState, removeChallengeState } from "@/utils/dbContent";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
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

// ─── Constants ────────────────────────────────────────────────────────────────

const SEVERITY_COLOR: Record<string, string> = {
  mild: "#52C8B8", moderate: "#F5A623", severe: "#E85C7A",
};

const SEVERITY_MEANING: Record<string, string> = {
  mild:     "Worth being aware of",
  moderate: "Actively affecting the dynamic",
  severe:   "The core tension in this connection",
};

const SOLUTION_TYPE_META: Record<ChallengeSolution["type"], { icon: string; label: string; color: string }> = {
  practical:     { icon: "tool",            label: "Practical",     color: "#52C8B8" },
  communication: { icon: "message-circle",  label: "Communication", color: "#7C52C8" },
  spiritual:     { icon: "sun",             label: "Spiritual",     color: "#F5A623" },
  ritual:        { icon: "moon",            label: "Mindful Practice", color: "#B855E0" },
  professional:  { icon: "briefcase",       label: "Professional",  color: "#E85C7A" },
};

const STATE_META = {
  resonates:  { label: "This resonates",   icon: "heart",       color: "#E85C7A" },
  working_on: { label: "Working on this",  icon: "activity",    color: "#F5A623" },
  resolved:   { label: "Resolved ✓",       icon: "check-circle",color: "#52C8B8" },
};

// ─── Acknowledge Banner ───────────────────────────────────────────────────────

function AcknowledgeBanner({
  currentState,
  onSelect,
  onRemove,
}: {
  currentState: string | null;
  onSelect: (s: "resonates" | "working_on" | "resolved") => void;
  onRemove: () => void;
}) {
  if (currentState) {
    const meta = STATE_META[currentState as keyof typeof STATE_META];
    return (
      <View style={[styles.stateBanner, { borderColor: meta.color + "44" }]}>
        <View style={[styles.stateDot, { backgroundColor: meta.color }]} />
        <Text style={[styles.stateBannerText, { color: meta.color }]}>{meta.label}</Text>
        <TouchableOpacity onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onRemove(); }} style={styles.stateClear}>
          <Feather name="x" size={14} color="rgba(240,235,248,0.3)" />
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
          style={[styles.acknowledgeBtn, styles.acknowledgeBtnPrimary]}
          onPress={() => onSelect("resonates")}
          activeOpacity={0.8}
        >
          <LinearGradient colors={["#E85C7A", "#B855E0"]} style={styles.acknowledgeBtnGrad}>
            <Feather name="heart" size={14} color="#fff" />
            <Text style={styles.acknowledgeBtnTextPrimary}>Yes, this is me</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.acknowledgeBtn, styles.acknowledgeBtnSecondary]}
          onPress={() => onSelect("working_on")}
          activeOpacity={0.8}
        >
          <Feather name="activity" size={14} color="#F5A623" />
          <Text style={[styles.acknowledgeBtnText, { color: "#F5A623" }]}>I'm working on it</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Solution Card ────────────────────────────────────────────────────────────

function SolutionCard({
  solution,
  isPremium,
  isAcknowledged,
  tried,
  onTry,
  onUnlockPress,
}: {
  solution: ChallengeSolution;
  isPremium: boolean;
  isAcknowledged: boolean;
  tried: boolean;
  onTry: () => void;
  onUnlockPress: () => void;
}) {
  const meta = SOLUTION_TYPE_META[solution.type];
  const locked = solution.isPremium && !isPremium;
  const fadeAnim = useRef(new Animated.Value(tried ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: tried ? 1 : 0, duration: 300, useNativeDriver: false }).start();
  }, [tried]);

  const borderColor = fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [meta.color + "22", meta.color + "88"] });

  return (
    <Animated.View style={[styles.solutionCard, { borderColor }]}>
      <LinearGradient colors={["#1A1630", "#110F1E"]} style={styles.solutionInner}>
        {/* Header row */}
        <View style={styles.solutionHeader}>
          <View style={[styles.solutionIconBg, { backgroundColor: meta.color + "18", borderColor: meta.color + "33" }]}>
            <Feather name={meta.icon as any} size={14} color={meta.color} />
          </View>
          <Text style={[styles.solutionType, { color: meta.color }]}>{meta.label}</Text>
          {solution.isPremium && (
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumBadgeText}>✦ Premium</Text>
            </View>
          )}
          {tried && (
            <View style={styles.triedBadge}>
              <Text style={styles.triedText}>Trying this</Text>
            </View>
          )}
        </View>

        <Text style={styles.solutionTitle}>{solution.title}</Text>

        {locked ? (
          <TouchableOpacity style={styles.unlockRow} onPress={onUnlockPress} activeOpacity={0.8}>
            <Feather name="lock" size={13} color="rgba(240,235,248,0.3)" />
            <Text style={styles.unlockText}>Unlock with Premium to see this step</Text>
          </TouchableOpacity>
        ) : (
          <>
            <Text style={styles.solutionDesc}>{solution.description}</Text>

            {/* "I'll try this" only shows once user has acknowledged */}
            {isAcknowledged && !tried && (
              <TouchableOpacity style={styles.tryBtn} onPress={onTry} activeOpacity={0.8}>
                <Feather name="check" size={13} color="#52C8B8" />
                <Text style={styles.tryBtnText}>I'll try this</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </LinearGradient>
    </Animated.View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function ChallengeDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { isPremium } = useApp();
  const { jwtToken } = useAuth();
  const [showPremiumGate, setShowPremiumGate] = useState(false);
  const [challengeState, setChallengeState] = useState<string | null>(null);
  const [triedSolutions, setTriedSolutions] = useState<Set<number>>(new Set());
  const acknowledgeAnim = useRef(new Animated.Value(0)).current;

  const params = useLocalSearchParams<{ data: string }>();
  let challenge: Challenge | null = null;
  try { challenge = JSON.parse(params.data ?? "null") as Challenge; } catch {}

  // Load saved state on mount
  useEffect(() => {
    if (!challenge?.id) return;
    getLocalStates().then((states) => {
      const s = states[challenge!.id];
      if (s) setChallengeState(s);
    });
  }, [challenge?.id]);

  // Animate solutions in when acknowledged
  useEffect(() => {
    if (challengeState) {
      Animated.spring(acknowledgeAnim, { toValue: 1, useNativeDriver: true, tension: 60, friction: 8 }).start();
    }
  }, [challengeState]);

  if (!challenge) {
    return (
      <LinearGradient colors={["#080611", "#0D0A1E"]} style={{ flex: 1 }}>
        <View style={[styles.fixedHeader, { paddingTop: insets.top + (Platform.OS === "web" ? 67 : 8) }]}>
          <TouchableOpacity onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.back(); }} style={styles.backBtn}>
            <Feather name="arrow-left" size={22} color="rgba(240,235,248,0.7)" />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 10 }}>
          <Text style={{ color: "rgba(240,235,248,0.4)", fontFamily: "Nunito_400Regular", fontSize: 15 }}>Challenge not found.</Text>
        </View>
      </LinearGradient>
    );
  }

  const severityColor = SEVERITY_COLOR[challenge.severity] ?? "#B855E0";
  const solutions = (challenge.solutions ?? []) as ChallengeSolution[];
  const isAcknowledged = !!challengeState;

  const handleStateSelect = async (state: "resonates" | "working_on" | "resolved") => {
    setChallengeState(state);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await saveChallengeState(challenge!.id, state, jwtToken ?? "");
    } catch {}
  };

  const handleRemoveState = async () => {
    setChallengeState(null);
    setTriedSolutions(new Set());
    try {
      await removeChallengeState(challenge!.id, jwtToken ?? "");
    } catch {}
  };

  const handleTrySolution = (index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTriedSolutions((prev) => { const n = new Set(prev); n.add(index); return n; });
    // Promote to working_on if just resonates
    if (challengeState === "resonates") {
      handleStateSelect("working_on");
    }
  };

  return (
    <LinearGradient colors={["#080611", "#0D0A1E"]} style={{ flex: 1 }}>
      {/* Fixed back button — stays visible while scrolling */}
      <View style={[styles.fixedHeader, { paddingTop: insets.top + (Platform.OS === "web" ? 67 : 8) }]}>
        <TouchableOpacity onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.back(); }} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color="rgba(240,235,248,0.7)" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + (Platform.OS === "web" ? 120 : 64), paddingBottom: insets.bottom + 100 },
        ]}
      >
        {/* Hero card */}
        <GlowCard style={styles.heroCard} glowColor={severityColor + "22"}>
          <LinearGradient colors={["#1E1035", "#110F1E"]} style={styles.heroInner}>
            <View style={styles.heroTopRow}>
              <View style={[styles.severityPill, { backgroundColor: severityColor + "18", borderColor: severityColor + "44" }]}>
                <View style={[styles.severityDot, { backgroundColor: severityColor }]} />
                <Text style={[styles.severityText, { color: severityColor }]}>{challenge.severity}</Text>
              </View>
              <View style={styles.categoryPill}>
                <Text style={styles.categoryText}>{challenge.category}</Text>
              </View>
            </View>
            <Text style={[styles.severityMeaning, { color: severityColor + "AA" }]}>
              {SEVERITY_MEANING[challenge.severity] ?? ""}
            </Text>
            <Text style={styles.heroTitle}>{challenge.title}</Text>
            <Text style={styles.heroDesc}>{challenge.description}</Text>
            <View style={styles.matchRow}>
              <Feather name="target" size={12} color="rgba(184,85,224,0.6)" />
              <Text style={styles.matchText}>
                Matched {challenge.match_score ?? "?"} compatibility indicator{challenge.match_score !== 1 ? "s" : ""} in your profile
              </Text>
            </View>
          </LinearGradient>
        </GlowCard>

        {/* Acknowledge / state banner */}
        <AcknowledgeBanner
          currentState={challengeState}
          onSelect={handleStateSelect}
          onRemove={handleRemoveState}
        />

        {/* Solutions — always visible but "I'll try this" only shows after acknowledgment */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Steps to Try</Text>
          <Text style={styles.sectionSub}>{solutions.length} options</Text>
        </View>

        {!isAcknowledged && (
          <View style={styles.solutionsHint}>
            <Feather name="info" size={12} color="rgba(184,85,224,0.5)" />
            <Text style={styles.solutionsHintText}>Tap "Yes, this is me" above to start tracking which steps you're trying.</Text>
          </View>
        )}

        {isAcknowledged && triedSolutions.size > 0 && (
          <View style={styles.progressRow}>
            <Feather name="activity" size={13} color="#F5A623" />
            <Text style={styles.progressText}>
              You're trying {triedSolutions.size} of {solutions.filter(s => !s.isPremium || isPremium).length} available remedies
            </Text>
          </View>
        )}

        <Animated.View style={{
          opacity: 1,
          transform: [{ translateY: acknowledgeAnim.interpolate({ inputRange: [0, 1], outputRange: [8, 0] }) }],
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
            />
          ))}
        </Animated.View>

        {/* Resolved CTA */}
        {isAcknowledged && challengeState !== "resolved" && triedSolutions.size >= 1 && (
          <TouchableOpacity
            style={styles.resolvedBtn}
            onPress={() => handleStateSelect("resolved")}
            activeOpacity={0.8}
          >
            <Feather name="check-circle" size={14} color="#52C8B8" />
            <Text style={styles.resolvedBtnText}>Mark this pattern as resolved</Text>
          </TouchableOpacity>
        )}

        <View style={styles.noteCard}>
          <Feather name="info" size={13} color="rgba(184,85,224,0.5)" style={{ marginTop: 1 }} />
          <Text style={styles.noteText}>
            These patterns are identified from your personality profiles and compatibility data. They're here to support your self-awareness — not replace professional help when you need it.
          </Text>
        </View>
      </ScrollView>

      <PremiumGate visible={showPremiumGate} onClose={() => setShowPremiumGate(false)} featureName="Premium Remedies" />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fixedHeader: { position: "absolute", top: 0, left: 0, right: 0, zIndex: 10, paddingHorizontal: 16, paddingBottom: 8 },
  scroll: { paddingHorizontal: 20, gap: 16 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(240,235,248,0.07)", alignItems: "center", justifyContent: "center" },
  heroCard: { borderRadius: 22 },
  heroInner: { borderRadius: 22, padding: 24, gap: 14 },
  heroTopRow: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  severityPill: { flexDirection: "row", alignItems: "center", gap: 7, borderWidth: 1, borderRadius: 20, paddingHorizontal: 13, paddingVertical: 6 },
  severityDot: { width: 8, height: 8, borderRadius: 4 },
  severityText: { fontSize: 12, fontFamily: "Nunito_600SemiBold", textTransform: "capitalize", letterSpacing: 0.4 },
  severityMeaning: { fontSize: 13, fontFamily: "Nunito_400Regular", lineHeight: 19, marginTop: -4 },
  categoryPill: { backgroundColor: "rgba(124,82,200,0.12)", borderWidth: 1, borderColor: "rgba(124,82,200,0.28)", borderRadius: 20, paddingHorizontal: 13, paddingVertical: 6 },
  categoryText: { fontSize: 12, fontFamily: "Nunito_500Medium", color: "rgba(124,82,200,0.9)" },
  heroTitle: { fontSize: 24, fontFamily: "Nunito_700Bold", color: "#F0EBF8", lineHeight: 32 },
  heroDesc: { fontSize: 16, fontFamily: "Nunito_400Regular", color: "rgba(240,235,248,0.7)", lineHeight: 25 },
  matchRow: { flexDirection: "row", alignItems: "center", gap: 7, marginTop: 4 },
  matchText: { fontSize: 13, fontFamily: "Nunito_400Regular", color: "rgba(184,85,224,0.62)" },
  // Acknowledge block
  acknowledgeBlock: { backgroundColor: "rgba(232,92,122,0.07)", borderWidth: 1, borderColor: "rgba(232,92,122,0.2)", borderRadius: 20, padding: 22, gap: 10 },
  acknowledgeQuestion: { fontSize: 20, fontFamily: "Nunito_700Bold", color: "#F0EBF8" },
  acknowledgeHint: { fontSize: 15, fontFamily: "Nunito_400Regular", color: "rgba(240,235,248,0.48)", lineHeight: 22 },
  acknowledgeButtons: { flexDirection: "row", gap: 10, marginTop: 6 },
  acknowledgeBtn: { flex: 1, borderRadius: 22, overflow: "hidden" },
  acknowledgeBtnPrimary: {},
  acknowledgeBtnSecondary: { backgroundColor: "rgba(245,166,35,0.1)", borderWidth: 1, borderColor: "rgba(245,166,35,0.28)", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7, paddingVertical: 14 },
  acknowledgeBtnGrad: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7, paddingVertical: 14 },
  acknowledgeBtnTextPrimary: { fontSize: 14, fontFamily: "Nunito_700Bold", color: "#fff" },
  acknowledgeBtnText: { fontSize: 14, fontFamily: "Nunito_600SemiBold" },
  // State banner
  stateBanner: { flexDirection: "row", alignItems: "center", gap: 9, backgroundColor: "rgba(240,235,248,0.04)", borderWidth: 1, borderRadius: 16, paddingHorizontal: 16, paddingVertical: 12 },
  stateDot: { width: 9, height: 9, borderRadius: 5 },
  stateBannerText: { flex: 1, fontSize: 14, fontFamily: "Nunito_600SemiBold" },
  stateClear: { padding: 4 },
  // Solutions
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" },
  sectionTitle: { fontSize: 11, fontFamily: "Nunito_700Bold", color: "rgba(240,235,248,0.5)", letterSpacing: 1, textTransform: "uppercase" },
  sectionSub: { fontSize: 13, fontFamily: "Nunito_400Regular", color: "rgba(240,235,248,0.32)" },
  solutionsHint: { flexDirection: "row", gap: 9, alignItems: "flex-start" },
  solutionsHintText: { flex: 1, fontSize: 13, fontFamily: "Nunito_400Regular", color: "rgba(184,85,224,0.58)", lineHeight: 20 },
  progressRow: { flexDirection: "row", alignItems: "center", gap: 9 },
  progressText: { fontSize: 14, fontFamily: "Nunito_500Medium", color: "#F5A623" },
  solutionCard: { borderRadius: 18, borderWidth: 1 },
  solutionInner: { borderRadius: 18, padding: 20, gap: 12 },
  solutionHeader: { flexDirection: "row", alignItems: "center", gap: 9 },
  solutionIconBg: { width: 32, height: 32, borderRadius: 16, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  solutionType: { fontSize: 12, fontFamily: "Nunito_600SemiBold", letterSpacing: 0.4 },
  premiumBadge: { marginLeft: "auto", backgroundColor: "rgba(245,166,35,0.12)", borderWidth: 1, borderColor: "rgba(245,166,35,0.3)", borderRadius: 11, paddingHorizontal: 9, paddingVertical: 3 },
  premiumBadgeText: { fontSize: 10, fontFamily: "Nunito_600SemiBold", color: "#F5A623", letterSpacing: 0.3 },
  triedBadge: { marginLeft: "auto", backgroundColor: "rgba(82,200,184,0.12)", borderWidth: 1, borderColor: "rgba(82,200,184,0.3)", borderRadius: 11, paddingHorizontal: 9, paddingVertical: 3 },
  triedText: { fontSize: 10, fontFamily: "Nunito_600SemiBold", color: "#52C8B8" },
  solutionTitle: { fontSize: 17, fontFamily: "Nunito_700Bold", color: "#F0EBF8" },
  solutionDesc: { fontSize: 15, fontFamily: "Nunito_400Regular", color: "rgba(240,235,248,0.65)", lineHeight: 23 },
  tryBtn: { flexDirection: "row", alignItems: "center", gap: 7, alignSelf: "flex-start", marginTop: 6, backgroundColor: "rgba(82,200,184,0.1)", borderWidth: 1, borderColor: "rgba(82,200,184,0.28)", borderRadius: 14, paddingHorizontal: 14, paddingVertical: 9 },
  tryBtnText: { fontSize: 13, fontFamily: "Nunito_600SemiBold", color: "#52C8B8" },
  unlockRow: { flexDirection: "row", alignItems: "center", gap: 9, paddingVertical: 12, paddingHorizontal: 14, backgroundColor: "rgba(240,235,248,0.04)", borderRadius: 12, borderWidth: 1, borderColor: "rgba(240,235,248,0.09)", borderStyle: "dashed" },
  unlockText: { fontSize: 14, fontFamily: "Nunito_400Regular", color: "rgba(240,235,248,0.32)", fontStyle: "italic" },
  resolvedBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 9, backgroundColor: "rgba(82,200,184,0.09)", borderWidth: 1, borderColor: "rgba(82,200,184,0.22)", borderRadius: 16, paddingVertical: 16 },
  resolvedBtnText: { fontSize: 15, fontFamily: "Nunito_600SemiBold", color: "#52C8B8" },
  noteCard: { flexDirection: "row", gap: 11, padding: 16, backgroundColor: "rgba(184,85,224,0.06)", borderRadius: 14, borderWidth: 1, borderColor: "rgba(184,85,224,0.12)", marginTop: 4 },
  noteText: { flex: 1, fontSize: 13, fontFamily: "Nunito_400Regular", color: "rgba(240,235,248,0.37)", lineHeight: 20 },
});
