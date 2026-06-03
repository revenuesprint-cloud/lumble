import { AnimatedBar } from "@/components/AnimatedBar";
import { GlowCard } from "@/components/GlowCard";
import { PremiumGate } from "@/components/PremiumGate";
import { useApp } from "@/context/AppContext";
import { calculateCompatibility, CompatibilitySection } from "@/utils/compatibility";
import { LinearGradient } from "expo-linear-gradient";
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

function OverallScore({ score }: { score: number }) {
  const countAnim = useRef(new Animated.Value(0)).current;
  const [display, setDisplay] = useState(0);
  const scaleAnim = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(countAnim, { toValue: score, duration: 1400, delay: 200, useNativeDriver: false }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 6, tension: 40, delay: 200, useNativeDriver: true }),
    ]).start();
    countAnim.addListener(({ value }) => setDisplay(Math.round(value)));
    return () => countAnim.removeAllListeners();
  }, [score]);

  const color = score >= 80 ? "#E85C7A" : score >= 65 ? "#F5A623" : "#7C52C8";

  return (
    <Animated.View style={{ alignItems: "center", transform: [{ scale: scaleAnim }] }}>
      <LinearGradient
        colors={["rgba(232,92,122,0.15)", "rgba(184,85,224,0.08)", "transparent"]}
        style={styles.scoreOrb}
      >
        <Text style={[styles.scoreNumber, { color }]}>{display}</Text>
        <Text style={styles.scoreLabel}>Compatibility</Text>
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
        onPress={isLocked ? onLockTap : undefined}
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
              <Text style={[styles.sectionScore, { color: section.color }]}>{section.score}</Text>
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

  if (!user || !partner) return null;

  const data = calculateCompatibility(
    user.birthDate,
    partner.birthDate,
    user.name,
    partner.name,
    partner.relationshipType
  );

  return (
    <LinearGradient colors={["#080611", "#0D0A1E"]} style={{ flex: 1 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scroll,
          {
            paddingTop: insets.top + (Platform.OS === "web" ? 67 : 20),
            paddingBottom: insets.bottom + 100,
          },
        ]}
      >
        <Text style={styles.screenTitle}>Emotional Chemistry</Text>
        <Text style={styles.screenSub}>
          {user.name} & {partner.name}
        </Text>

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
          <TouchableOpacity onPress={() => setShowGate(true)} activeOpacity={0.85} style={styles.upgradeTeaser}>
            <LinearGradient
              colors={["rgba(232,92,122,0.15)", "rgba(184,85,224,0.1)"]}
              style={styles.upgradeTeaserInner}
            >
              <Text style={styles.upgradeTeaserTitle}>Unlock the full picture</Text>
              <Text style={styles.upgradeTeaserSub}>
                2 insights hidden — including hidden relationship patterns
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
    gap: 16,
  },
  screenTitle: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
    color: "#F0EBF8",
  },
  screenSub: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "rgba(240,235,248,0.4)",
    marginTop: -8,
  },
  scoreOrb: {
    width: 180,
    height: 180,
    borderRadius: 90,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    borderWidth: 1,
    borderColor: "rgba(232,92,122,0.15)",
    gap: 4,
  },
  scoreNumber: {
    fontSize: 56,
    fontFamily: "Inter_700Bold",
  },
  scoreLabel: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: "rgba(240,235,248,0.4)",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  tagRow: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    marginTop: -8,
  },
  tag: {
    borderWidth: 1,
    borderColor: "rgba(232,92,122,0.3)",
    backgroundColor: "rgba(232,92,122,0.08)",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  tagText: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    color: "#E85C7A",
    textTransform: "capitalize",
  },
  sectionsContainer: {
    gap: 12,
  },
  sectionCard: {
    borderRadius: 18,
  },
  sectionInner: {
    padding: 18,
    gap: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  sectionDot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionDotCore: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  sectionLabel: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    color: "#F0EBF8",
  },
  sectionScore: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
  },
  sectionText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "rgba(240,235,248,0.65)",
    lineHeight: 22,
  },
  lockedOverlay: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(240,235,248,0.04)",
    borderRadius: 10,
    padding: 12,
  },
  lockIcon: {
    color: "#E85C7A",
    fontSize: 16,
  },
  lockedText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    color: "rgba(240,235,248,0.3)",
  },
  upgradeTeaser: {
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(232,92,122,0.2)",
  },
  upgradeTeaserInner: {
    padding: 20,
    gap: 6,
  },
  upgradeTeaserTitle: {
    fontSize: 17,
    fontFamily: "Inter_700Bold",
    color: "#F0EBF8",
  },
  upgradeTeaserSub: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: "rgba(240,235,248,0.45)",
  },
});
