import { AnimatedBar } from "@/components/AnimatedBar";
import { GlowCard } from "@/components/GlowCard";
import { PremiumGate } from "@/components/PremiumGate";
import { useApp } from "@/context/AppContext";
import { getAstrologyReading } from "@/utils/astrology";
import { calculateCompatibility, CompatibilitySection } from "@/utils/compatibility";
import { getCompatibilityTexts } from "@/utils/personalization";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { KundliLoading } from "@/components/KundliLoading";
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

// Maps a section score (32–86) to a human label + color
function sectionLabel(score: number): { text: string; color: string } {
  if (score >= 72) return { text: "Strong",       color: "#52C8B8" };
  if (score >= 57) return { text: "Good",         color: "#52C8B8" };
  if (score >= 44) return { text: "Building",     color: "#F5A623" };
  return              { text: "Needs work",   color: "#E85C7A" };
}

// score is 0–36 (actual guna total)
function OverallScore({ score }: { score: number }) {
  const countAnim = useRef(new Animated.Value(0)).current;
  const [display, setDisplay] = useState(0);
  const scaleAnim = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    countAnim.setValue(0);
    const listenerId = countAnim.addListener(({ value }) => setDisplay(Math.round(value)));
    Animated.parallel([
      Animated.timing(countAnim, { toValue: score, duration: 1400, delay: 200, useNativeDriver: false }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 6, tension: 40, delay: 200, useNativeDriver: true }),
    ]).start();
    return () => countAnim.removeListener(listenerId);
  }, [score]);

  const color = score >= 28 ? "#52C8B8" : score >= 21 ? "#F5A623" : "#E85C7A";
  const pct   = Math.round((score / 36) * 100);
  const displayPct = Math.round((display / 36) * 100);
  const verdict = score >= 28 ? "Strong" : score >= 21 ? "Good" : score >= 18 ? "Average" : "Challenging";

  return (
    <Animated.View style={{ alignItems: "center", transform: [{ scale: scaleAnim }] }}>
      <LinearGradient
        colors={["rgba(232,92,122,0.15)", "rgba(184,85,224,0.08)", "transparent"]}
        style={styles.scoreOrb}
      >
        <Text style={[styles.scoreNumber, { color }]}>{displayPct}<Text style={styles.scoreMax}>%</Text></Text>
        <Text style={styles.scoreLabel}>Overall compatibility</Text>
        <Text style={[styles.scoreVerdict, { color }]}>{verdict}</Text>
        <Text style={styles.scoreHint}>based on how your personalities align</Text>
      </LinearGradient>
    </Animated.View>
  );
}

function SectionCard({
  section,
  index,
  isPremium,
  onLockTap,
}: {
  section: CompatibilitySection;
  index: number;
  isPremium: boolean;
  onLockTap: () => void;
}) {
  const isLocked = index >= 5 && !isPremium;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, delay: index * 100 + 300, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 400, delay: index * 100 + 300, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
      <TouchableOpacity
        onPress={isLocked ? () => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onLockTap(); } : undefined}
        activeOpacity={isLocked ? 0.8 : 1}
      >
        <GlowCard
          style={styles.sectionCard}
          glowColor={section.color + "33"}
          intensity={isLocked ? "low" : "medium"}
        >
          <View style={styles.sectionInner}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionDot, { backgroundColor: section.color + "22", borderColor: section.color + "55" }]}>
                <View style={[styles.sectionDotCore, { backgroundColor: section.color }]} />
              </View>
              <Text style={styles.sectionLabel}>{section.label}</Text>
              {(() => {
                const lbl = sectionLabel(section.score);
                return (
                  <View style={[styles.scoreLabelChip, { backgroundColor: lbl.color + "18", borderColor: lbl.color + "44" }]}>
                    <Text style={[styles.scoreLabelText, { color: lbl.color }]}>{lbl.text}</Text>
                  </View>
                );
              })()}
            </View>

            <AnimatedBar
              value={section.score}
              color={section.color}
              color2={section.color + "88"}
              delay={index * 100 + 400}
            />

            {isLocked ? (
              <View style={styles.lockedOverlay}>
                <Text style={styles.lockIcon}>◈</Text>
                <Text style={styles.lockedText}>Unlock with Premium</Text>
              </View>
            ) : (
              <Text style={styles.sectionText}>{section.text}</Text>
            )}
          </View>
        </GlowCard>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function CompatibilityScreen() {
  const insets = useSafeAreaInsets();
  const { user, partner, isPremium } = useApp();
  const [showGate, setShowGate] = useState(false);

  const reading = useMemo(() => {
    if (!user || !partner) return null;
    return getAstrologyReading(user.name, user.birthDate, partner.name, partner.birthDate, user.birthTime);
  }, [user?.birthDate, user?.name, user?.birthTime, partner?.birthDate, partner?.name]);

  if (!user || !partner) return null;
  if (!reading) return <KundliLoading label="Calculating emotional chemistry…" />;

  // Build compatibility sections using actual guna breakdown texts
  const personalizedTexts = getCompatibilityTexts(reading, partner.relationshipType);
  const baseData = calculateCompatibility(user.birthDate, partner.birthDate, user.name, partner.name, partner.relationshipType);
  // Override section texts with kundli-derived versions
  const data = {
    ...baseData,
    overall: reading.guna.total, // Real guna total 0–36
    sections: baseData.sections.map((s) => ({
      ...s,
      text: personalizedTexts[s.label] ?? s.text,
      score: (() => {
        // Map each section to its actual koota score
        const kootaMap: Record<string, string> = {
          "Emotional Chemistry":       "Graha Maitri",
          "Communication Energy":      "Gana",
          "Attachment Dynamics":       "Yoni",
          "Emotional Tension":         "Nadi",
          "Long-Term Potential":       "Bhakoot",
          "Why This Feels Addictive":  "Tara",
          "Hidden Relationship Pattern":"Vashya",
        };
        const koota = reading.guna.breakdown.find((k) => k.name === kootaMap[s.label]);
        // Remap 0–1 to 32–86: scores never hit extreme ends
        if (!koota) return s.score;
        return Math.round(32 + (koota.score / koota.max) * 54);
      })(),
    })),
  };

  return (
    <LinearGradient colors={["#080611", "#0D0A1E"]} style={{ flex: 1 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={Platform.OS === "web" ? { maxWidth: 640, alignSelf: "center", width: "100%" } : undefined}
        contentContainerStyle={[
          styles.scroll,
          {
            paddingTop: insets.top + (Platform.OS === "web" ? 67 : 20),
            paddingBottom: insets.bottom + 100,
          },
        ]}
      >
        <Text style={styles.screenTitle}>You & {partner.name}</Text>
        <Text style={styles.screenSub}>Chemistry · Patterns · Deep reads</Text>

        <OverallScore score={data.overall} />

        <View style={styles.tagRow}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{partner.relationshipType}</Text>
          </View>
          <View style={[styles.tag, { borderColor: "rgba(184,85,224,0.3)", backgroundColor: "rgba(184,85,224,0.08)" }]}>
            <Text style={[styles.tagText, { color: "#B855E0" }]}>Deep analysis</Text>
          </View>
        </View>

        <View style={styles.sectionsContainer}>
          {data.sections.map((section, i) => (
            <SectionCard
              key={section.label}
              section={section}
              index={i}
              isPremium={isPremium}
              onLockTap={() => setShowGate(true)}
            />
          ))}
        </View>

        {!isPremium && (
          <TouchableOpacity onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); setShowGate(true); }} activeOpacity={0.85} style={styles.upgradeTeaser}>
            <LinearGradient
              colors={["rgba(232,92,122,0.15)", "rgba(184,85,224,0.1)"]}
              style={styles.upgradeTeaserInner}
            >
              <Text style={styles.upgradeTeaserTitle}>Unlock the full picture</Text>
              <Text style={styles.upgradeTeaserSub}>
                2 insights locked, including your hidden relationship pattern
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        )}

      </ScrollView>

      <PremiumGate
        visible={showGate}
        onClose={() => setShowGate(false)}
        featureName="Hidden Relationship Pattern"
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: 20,
    gap: 18,
  },
  screenTitle: {
    fontSize: 32,
    fontFamily: "Nunito_700Bold",
    color: "#F0EBF8",
  },
  screenSub: {
    fontSize: 16,
    fontFamily: "Nunito_400Regular",
    color: "rgba(240,235,248,0.45)",
    marginTop: -6,
  },
  scoreOrb: {
    width: 190,
    height: 190,
    borderRadius: 95,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    borderWidth: 1,
    borderColor: "rgba(232,92,122,0.18)",
    gap: 4,
  },
  scoreNumber: {
    fontSize: 60,
    fontFamily: "Nunito_700Bold",
  },
  scoreMax: {
    fontSize: 30,
    fontFamily: "Nunito_400Regular",
    color: "rgba(240,235,248,0.4)",
  },
  scoreLabel: {
    fontSize: 11,
    fontFamily: "Nunito_400Regular",
    color: "rgba(240,235,248,0.4)",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  scoreVerdict: {
    fontSize: 15,
    fontFamily: "Nunito_700Bold",
    marginTop: 2,
  },
  tagRow: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    marginTop: -6,
  },
  tag: {
    borderWidth: 1,
    borderColor: "rgba(232,92,122,0.3)",
    backgroundColor: "rgba(232,92,122,0.08)",
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
  },
  tagText: {
    fontSize: 13,
    fontFamily: "Nunito_600SemiBold",
    color: "#E85C7A",
    textTransform: "capitalize",
  },
  sectionsContainer: {
    gap: 13,
  },
  sectionCard: {
    borderRadius: 20,
  },
  sectionInner: {
    padding: 22,
    gap: 14,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  sectionDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionDotCore: {
    width: 11,
    height: 11,
    borderRadius: 6,
  },
  sectionLabel: {
    flex: 1,
    fontSize: 17,
    fontFamily: "Nunito_600SemiBold",
    color: "#F0EBF8",
  },
  scoreLabelChip: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 11,
    paddingVertical: 4,
  },
  scoreLabelText: {
    fontSize: 12,
    fontFamily: "Nunito_600SemiBold",
  },
  scoreHint: {
    fontSize: 12,
    fontFamily: "Nunito_400Regular",
    color: "rgba(240,235,248,0.32)",
    marginTop: 2,
    textAlign: "center",
  },
  sectionText: {
    fontSize: 15,
    fontFamily: "Nunito_400Regular",
    color: "rgba(240,235,248,0.7)",
    lineHeight: 24,
  },
  lockedOverlay: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(240,235,248,0.04)",
    borderRadius: 12,
    padding: 14,
  },
  lockIcon: {
    color: "#E85C7A",
    fontSize: 18,
  },
  lockedText: {
    fontSize: 14,
    fontFamily: "Nunito_500Medium",
    color: "rgba(240,235,248,0.32)",
  },
  upgradeTeaser: {
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(232,92,122,0.22)",
  },
  upgradeTeaserInner: {
    padding: 22,
    gap: 8,
  },
  upgradeTeaserTitle: {
    fontSize: 20,
    fontFamily: "Nunito_700Bold",
    color: "#F0EBF8",
  },
  upgradeTeaserSub: {
    fontSize: 15,
    fontFamily: "Nunito_400Regular",
    color: "rgba(240,235,248,0.48)",
  },

});
