import { GlowCard } from "@/components/GlowCard";
import { PremiumGate } from "@/components/PremiumGate";
import { useApp } from "@/context/AppContext";
import type { Challenge, ChallengeSolution } from "@/utils/challenges";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SEVERITY_COLOR: Record<string, string> = {
  mild:     "#52C8B8",
  moderate: "#F5A623",
  severe:   "#E85C7A",
};

const SOLUTION_TYPE_META: Record<ChallengeSolution["type"], { icon: string; label: string; color: string }> = {
  practical:     { icon: "tool",        label: "Practical",     color: "#52C8B8" },
  communication: { icon: "message-circle", label: "Communication", color: "#7C52C8" },
  spiritual:     { icon: "sun",         label: "Spiritual",     color: "#F5A623" },
  ritual:        { icon: "moon",        label: "Vedic Ritual",  color: "#B855E0" },
  professional:  { icon: "briefcase",   label: "Professional",  color: "#E85C7A" },
};

function SolutionCard({
  solution,
  index,
  isPremium,
  onUnlockPress,
}: {
  solution: ChallengeSolution;
  index: number;
  isPremium: boolean;
  onUnlockPress: () => void;
}) {
  const meta = SOLUTION_TYPE_META[solution.type];
  const locked = solution.isPremium && !isPremium;

  return (
    <GlowCard style={styles.solutionCard} glowColor={meta.color + "18"}>
      <LinearGradient colors={["#1A1630", "#110F1E"]} style={styles.solutionInner}>
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
        </View>
        <Text style={styles.solutionTitle}>{solution.title}</Text>

        {locked ? (
          <TouchableOpacity style={styles.unlockRow} onPress={onUnlockPress} activeOpacity={0.8}>
            <Feather name="lock" size={13} color="rgba(240,235,248,0.3)" />
            <Text style={styles.unlockText}>Unlock with Premium to see this remedy</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.solutionDesc}>{solution.description}</Text>
        )}
      </LinearGradient>
    </GlowCard>
  );
}

export default function ChallengeDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { isPremium } = useApp();
  const [showPremiumGate, setShowPremiumGate] = useState(false);

  const params = useLocalSearchParams<{ data: string }>();
  let challenge: Challenge | null = null;
  try {
    challenge = JSON.parse(params.data ?? "null") as Challenge;
  } catch {
    challenge = null;
  }

  if (!challenge) {
    return (
      <LinearGradient colors={["#080611", "#0D0A1E"]} style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ color: "rgba(240,235,248,0.4)", fontFamily: "Nunito_400Regular" }}>Challenge not found.</Text>
      </LinearGradient>
    );
  }

  const severityColor = SEVERITY_COLOR[challenge.severity] ?? "#B855E0";
  const solutions = (challenge.solutions ?? []) as ChallengeSolution[];
  const freeSolutions     = solutions.filter((s) => !s.isPremium);
  const premiumSolutions  = solutions.filter((s) => s.isPremium);

  return (
    <LinearGradient colors={["#080611", "#0D0A1E"]} style={{ flex: 1 }}>
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
        {/* Back button */}
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color="rgba(240,235,248,0.7)" />
        </TouchableOpacity>

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

            <Text style={styles.heroTitle}>{challenge.title}</Text>
            <Text style={styles.heroDesc}>{challenge.description}</Text>

            {/* Match indicator */}
            <View style={styles.matchRow}>
              <Feather name="target" size={12} color="rgba(184,85,224,0.6)" />
              <Text style={styles.matchText}>
                Matched {challenge.match_score} kundli indicator{challenge.match_score !== 1 ? "s" : ""}
              </Text>
            </View>
          </LinearGradient>
        </GlowCard>

        {/* Solutions section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Remedies & Solutions</Text>
          <Text style={styles.sectionSub}>{solutions.length} remedies available</Text>
        </View>

        {solutions.map((solution, i) => (
          <SolutionCard
            key={i}
            solution={solution}
            index={i}
            isPremium={isPremium}
            onUnlockPress={() => setShowPremiumGate(true)}
          />
        ))}

        {/* Astrology note */}
        <View style={styles.noteCard}>
          <Feather name="info" size={13} color="rgba(184,85,224,0.5)" style={{ marginTop: 1 }} />
          <Text style={styles.noteText}>
            These patterns are derived from your Vedic birth chart. Astrological guidance complements — it does not replace — personal effort and professional support when needed.
          </Text>
        </View>
      </ScrollView>

      <PremiumGate
        visible={showPremiumGate}
        onClose={() => setShowPremiumGate(false)}
        featureName="Premium Remedies"
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: 20,
    gap: 14,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(240,235,248,0.06)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  heroCard: { borderRadius: 20 },
  heroInner: { borderRadius: 20, padding: 20, gap: 12 },
  heroTopRow: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  severityPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  severityDot: { width: 7, height: 7, borderRadius: 4 },
  severityText: { fontSize: 11, fontFamily: "Nunito_600SemiBold", textTransform: "capitalize", letterSpacing: 0.4 },
  categoryPill: {
    backgroundColor: "rgba(124,82,200,0.12)",
    borderWidth: 1,
    borderColor: "rgba(124,82,200,0.25)",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  categoryText: { fontSize: 11, fontFamily: "Nunito_500Medium", color: "rgba(124,82,200,0.9)" },
  heroTitle: { fontSize: 20, fontFamily: "Nunito_700Bold", color: "#F0EBF8", lineHeight: 28 },
  heroDesc: { fontSize: 14, fontFamily: "Nunito_400Regular", color: "rgba(240,235,248,0.65)", lineHeight: 22 },
  matchRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 },
  matchText: { fontSize: 12, fontFamily: "Nunito_400Regular", color: "rgba(184,85,224,0.6)" },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" },
  sectionTitle: { fontSize: 14, fontFamily: "Nunito_600SemiBold", color: "rgba(240,235,248,0.4)", letterSpacing: 0.5, textTransform: "uppercase" },
  sectionSub: { fontSize: 12, fontFamily: "Nunito_400Regular", color: "rgba(240,235,248,0.3)" },
  solutionCard: { borderRadius: 16 },
  solutionInner: { borderRadius: 16, padding: 16, gap: 10 },
  solutionHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  solutionIconBg: {
    width: 28, height: 28, borderRadius: 14,
    borderWidth: 1, alignItems: "center", justifyContent: "center",
  },
  solutionType: { fontSize: 11, fontFamily: "Nunito_600SemiBold", letterSpacing: 0.4 },
  premiumBadge: {
    marginLeft: "auto",
    backgroundColor: "rgba(245,166,35,0.12)",
    borderWidth: 1,
    borderColor: "rgba(245,166,35,0.3)",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  premiumBadgeText: { fontSize: 9, fontFamily: "Nunito_600SemiBold", color: "#F5A623", letterSpacing: 0.3 },
  solutionTitle: { fontSize: 15, fontFamily: "Nunito_700Bold", color: "#F0EBF8" },
  solutionDesc: { fontSize: 13, fontFamily: "Nunito_400Regular", color: "rgba(240,235,248,0.6)", lineHeight: 20 },
  unlockRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "rgba(240,235,248,0.04)",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(240,235,248,0.08)",
    borderStyle: "dashed",
  },
  unlockText: { fontSize: 13, fontFamily: "Nunito_400Regular", color: "rgba(240,235,248,0.3)", fontStyle: "italic" },
  noteCard: {
    flexDirection: "row",
    gap: 10,
    padding: 14,
    backgroundColor: "rgba(184,85,224,0.06)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(184,85,224,0.1)",
    marginTop: 4,
  },
  noteText: { flex: 1, fontSize: 12, fontFamily: "Nunito_400Regular", color: "rgba(240,235,248,0.35)", lineHeight: 18 },
});
