import { AnimatedBar } from "@/components/AnimatedBar";
import { PremiumGate } from "@/components/PremiumGate";
import { useApp } from "@/context/AppContext";
import { getAstrologyReading, RASHIS } from "@/utils/astrology";
import { calculateCompatibility, CompatibilitySection } from "@/utils/compatibility";
import { getCompatibilityTexts } from "@/utils/personalization";
import { getContentBundle, applyVars } from "@/utils/dbContent";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { KundliLoading } from "@/components/KundliLoading";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function sectionLabel(score: number): { text: string; color: string; bg: string } {
  if (score >= 72) return { text: "Strong",     color: "#10B981", bg: "#ECFDF5" };
  if (score >= 57) return { text: "Good",       color: "#10B981", bg: "#ECFDF5" };
  if (score >= 44) return { text: "Building",   color: "#F59E0B", bg: "#FFFBEB" };
  return              { text: "Needs work", color: "#F43F5E", bg: "#FFF1F2" };
}

function OverallScore({ score }: { score: number }) {
  const countAnim = useRef(new Animated.Value(0)).current;
  const [display, setDisplay] = useState(0);
  const scaleAnim = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    countAnim.setValue(0);
    const listenerId = countAnim.addListener(({ value }) => setDisplay(Math.round(value)));
    Animated.parallel([
      Animated.timing(countAnim, { toValue: score, duration: 750, delay: 100, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 5, tension: 90, delay: 80, useNativeDriver: true }),
    ]).start();
    return () => countAnim.removeListener(listenerId);
  }, [score]);

  const color   = score >= 28 ? "#10B981" : score >= 21 ? "#F59E0B" : "#F43F5E";
  const colorBg = score >= 28 ? "#ECFDF5" : score >= 21 ? "#FFFBEB" : "#FFF1F2";
  const displayPct = Math.round((display / 36) * 100);
  const verdict = score >= 28 ? "Strong" : score >= 21 ? "Good" : score >= 18 ? "Average" : "Challenging";

  return (
    <Animated.View style={{ alignItems: "center", transform: [{ scale: scaleAnim }] }}>
      <View style={[styles.scoreOrb, { backgroundColor: colorBg, borderColor: color + "30" }]}>
        <Text style={[styles.scoreNumber, { color }]}>{displayPct}<Text style={styles.scoreMax}>%</Text></Text>
        <Text style={styles.scoreLabel}>compatibility</Text>
        <View style={[styles.scoreVerdictPill, { backgroundColor: color + "18", borderColor: color + "44" }]}>
          <Text style={[styles.scoreVerdict, { color }]}>{verdict}</Text>
        </View>
        <Text style={styles.scoreHint}>based on your birth charts</Text>
      </View>
    </Animated.View>
  );
}

// ─── Section detail — full-screen page ───────────────────────────────────────

const SCREEN_H = Dimensions.get("window").height;

function SectionDetailSheet({ section, onClose }: { section: CompatibilitySection; onClose: () => void }) {
  const insets    = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(SCREEN_H)).current;
  const lbl       = sectionLabel(section.score);

  useEffect(() => {
    Animated.spring(slideAnim, { toValue: 0, friction: 9, tension: 100, useNativeDriver: true }).start();
  }, []);

  const close = () => {
    Animated.timing(slideAnim, { toValue: SCREEN_H, duration: 280, easing: Easing.in(Easing.cubic), useNativeDriver: true }).start(onClose);
  };

  return (
    <Animated.View style={[sdStyles.page, { transform: [{ translateY: slideAnim }] }]}>
      {/* Header */}
      <View style={[sdStyles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={close} style={sdStyles.backBtn} activeOpacity={0.7}>
          <Feather name="arrow-left" size={22} color="#6B7280" />
        </TouchableOpacity>
        <View style={[sdStyles.dot, { backgroundColor: section.color + "14" }]}>
          <View style={[sdStyles.dotCore, { backgroundColor: section.color }]} />
        </View>
        <Text style={sdStyles.headerTitle} numberOfLines={1}>{section.label}</Text>
        <View style={[sdStyles.scoreBadge, { backgroundColor: lbl.bg, borderColor: lbl.color + "44" }]}>
          <Text style={[sdStyles.scoreBadgeText, { color: lbl.color }]}>{lbl.text}</Text>
        </View>
      </View>

      {/* Scrollable content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[sdStyles.scroll, { paddingBottom: insets.bottom + 40 }]}
      >
        <AnimatedBar value={section.score} color={section.color} color2={section.color + "88"} delay={120} height={8} />
        <View style={sdStyles.divider} />
        <Text style={sdStyles.fullText}>{section.text}</Text>
        <TouchableOpacity onPress={close} style={sdStyles.closeBtn} activeOpacity={0.7}>
          <Text style={sdStyles.closeBtnText}>Got it</Text>
        </TouchableOpacity>
      </ScrollView>
    </Animated.View>
  );
}

const sdStyles = StyleSheet.create({
  page:           { ...StyleSheet.absoluteFillObject, zIndex: 200, backgroundColor: "#FFFFFF" },
  header:         { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 20,
                    paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: "#F3F4F6" },
  backBtn:        { width: 40, height: 40, borderRadius: 20, backgroundColor: "#F9FAFB", borderWidth: 1,
                    borderColor: "#E5E7EB", alignItems: "center", justifyContent: "center" },
  dot:            { width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  dotCore:        { width: 10, height: 10, borderRadius: 5 },
  headerTitle:    { flex: 1, fontSize: 18, fontFamily: "Nunito_700Bold", color: "#111827" },
  scoreBadge:     { borderRadius: 20, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 4 },
  scoreBadgeText: { fontSize: 11, fontFamily: "Nunito_600SemiBold" },
  scroll:         { paddingHorizontal: 24, paddingTop: 28, gap: 24 },
  divider:        { height: 1, backgroundColor: "#F3F4F6" },
  fullText:       { fontSize: 18, fontFamily: "Nunito_400Regular", color: "#374151", lineHeight: 30 },
  closeBtn:       { alignItems: "center", paddingVertical: 16, backgroundColor: "#F9FAFB", borderRadius: 16, borderWidth: 1, borderColor: "#E5E7EB" },
  closeBtnText:   { fontSize: 15, fontFamily: "Nunito_600SemiBold", color: "#6B7280" },
});

// ─── Section card ─────────────────────────────────────────────────────────────

function SectionCard({
  section, index, isPremium, onLockTap, onDetailTap,
}: {
  section: CompatibilitySection; index: number; isPremium: boolean;
  onLockTap: () => void; onDetailTap: () => void;
}) {
  const isLocked  = index >= 5 && !isPremium;
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 250, delay: index * 50 + 80, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 250, delay: index * 50 + 80, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, []);

  const lbl = sectionLabel(section.score);

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
      <TouchableOpacity
        onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); isLocked ? onLockTap() : onDetailTap(); }}
        activeOpacity={0.82}
      >
        <View style={styles.sectionCard}>
          <View style={[styles.sectionAccentBar, { backgroundColor: section.color }]} />
          <View style={styles.sectionContent}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIconCircle, { backgroundColor: section.color + "14" }]}>
                <View style={[styles.sectionDotCore, { backgroundColor: section.color }]} />
              </View>
              <Text style={styles.sectionLabel}>{section.label}</Text>
              <View style={[styles.scoreLabelChip, { backgroundColor: lbl.bg, borderColor: lbl.color + "44" }]}>
                <Text style={[styles.scoreLabelText, { color: lbl.color }]}>{lbl.text}</Text>
              </View>
            </View>
            <AnimatedBar value={section.score} color={section.color} color2={section.color + "88"} delay={index * 100 + 400} />
            {isLocked ? (
              <View style={styles.lockedOverlay}>
                <Feather name="lock" size={14} color="#9CA3AF" />
                <Text style={styles.lockedText}>Unlock with Premium</Text>
              </View>
            ) : (
              <Text style={styles.sectionText} numberOfLines={2}>{section.text}</Text>
            )}
            {!isLocked && (
              <View style={styles.sectionFooter}>
                <View style={[styles.sectionCtaBtn, { borderColor: section.color + "44" }]}>
                  <Text style={[styles.sectionCtaBtnText, { color: section.color }]}>See full breakdown</Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function CompatibilityScreen() {
  const insets = useSafeAreaInsets();
  const { user, partner, isPremium } = useApp();
  const [showGate,      setShowGate]      = useState(false);
  const [activeSection, setActiveSection] = useState<CompatibilitySection | null>(null);

  const reading = useMemo(() => {
    if (!user || !partner) return null;
    return getAstrologyReading(user.name, user.birthDate, partner.name, partner.birthDate, user.birthTime);
  }, [user?.birthDate, user?.name, user?.birthTime, partner?.birthDate, partner?.name]);

  if (!user || !partner) return null;
  if (!reading) return <KundliLoading label="Calculating emotional chemistry…" />;

  const uRashi = RASHIS[reading.user.moonRashi];
  const pRashi = RASHIS[reading.partner.moonRashi];

  const dbBundle = getContentBundle();
  const dbCompatTexts: Record<string, string> = {};
  if (dbBundle?.compatibilityTexts?.length) {
    const vars = {
      u:        user.name,
      p:        partner.name,
      uElement: uRashi.element,
      pElement: pRashi.element,
      uSign:    uRashi.en,
      pSign:    pRashi.en,
    };
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
    <View style={{ flex: 1, backgroundColor: "#F4F5F7" }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={Platform.OS === "web" ? { maxWidth: 640, alignSelf: "center", width: "100%" } : undefined}
        contentContainerStyle={[styles.scroll, {
          paddingTop: insets.top + (Platform.OS === "web" ? 67 : 20),
          paddingBottom: insets.bottom + 100,
        }]}
      >
        <Text style={styles.screenTitle}>You & {partner.name}</Text>
        <Text style={styles.screenSub}>An honest look at what works and what doesn't</Text>

        <OverallScore score={data.overall} />

        <View style={styles.tagRow}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{partner.relationshipType}</Text>
          </View>
          <View style={[styles.tag, { backgroundColor: "#EEF2FF", borderColor: "#C7D2FE" }]}>
            <Text style={[styles.tagText, { color: "#5B4CE8" }]}>Deep analysis</Text>
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
              onDetailTap={() => setActiveSection(section)}
            />
          ))}
        </View>

        {!isPremium && (
          <TouchableOpacity
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); setShowGate(true); }}
            activeOpacity={0.85}
            style={styles.upgradeTeaser}
          >
            <View style={styles.upgradeTeaserInner}>
              <View style={styles.upgradeIconRow}>
                <Feather name="lock" size={16} color="#5B4CE8" />
                <Text style={styles.upgradeTeaserTitle}>Unlock the full picture</Text>
              </View>
              <Text style={styles.upgradeTeaserSub}>
                2 insights locked, including your hidden relationship pattern
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </ScrollView>

      <PremiumGate visible={showGate} onClose={() => setShowGate(false)} featureName="Hidden Relationship Pattern" />
      {activeSection && <SectionDetailSheet section={activeSection} onClose={() => setActiveSection(null)} />}
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: 20, gap: 16 },
  screenTitle: { fontSize: 24, fontFamily: "Nunito_700Bold", color: "#111827" },
  screenSub:   { fontSize: 13, fontFamily: "Nunito_400Regular", color: "#6B7280", marginTop: -2 },

  scoreOrb: {
    width: 150, height: 150, borderRadius: 75,
    alignItems: "center", justifyContent: "center", alignSelf: "center",
    borderWidth: 2, gap: 3,
  },
  scoreNumber:     { fontSize: 46, fontFamily: "Nunito_700Bold" },
  scoreMax:        { fontSize: 22, fontFamily: "Nunito_400Regular", color: "#9CA3AF" },
  scoreLabel:      { fontSize: 11, fontFamily: "Nunito_500Medium", color: "#6B7280" },
  scoreVerdictPill:{ borderWidth: 1, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3, marginTop: 2 },
  scoreVerdict:    { fontSize: 12, fontFamily: "Nunito_700Bold" },
  scoreHint:       { fontSize: 10, fontFamily: "Nunito_400Regular", color: "#9CA3AF", textAlign: "center", marginTop: 1 },

  tagRow:  { flexDirection: "row", gap: 6, justifyContent: "center" },
  tag:     { borderWidth: 1, borderColor: "#E5E7EB", backgroundColor: "#F9FAFB", paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 },
  tagText: { fontSize: 12, fontFamily: "Nunito_600SemiBold", color: "#6B7280", textTransform: "capitalize" },

  sectionsContainer: { gap: 8 },
  sectionCard:       { backgroundColor: "#FFFFFF", borderRadius: 14, borderWidth: 1, borderColor: "#E5E7EB",
                       flexDirection: "row", overflow: "hidden",
                       shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  sectionAccentBar:  { width: 3 },
  sectionContent:    { flex: 1, padding: 13, gap: 9 },
  sectionHeader:     { flexDirection: "row", alignItems: "center", gap: 8 },
  sectionIconCircle: { width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  sectionDotCore:    { width: 8, height: 8, borderRadius: 4 },
  sectionLabel:      { flex: 1, fontSize: 13, fontFamily: "Nunito_700Bold", color: "#111827" },
  scoreLabelChip:    { borderWidth: 1, borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3 },
  scoreLabelText:    { fontSize: 10, fontFamily: "Nunito_600SemiBold" },
  sectionFooter:     { flexDirection: "row", justifyContent: "flex-end" },
  sectionCtaBtn:     { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, borderWidth: 1, backgroundColor: "transparent" },
  sectionCtaBtnText: { fontSize: 11, fontFamily: "Nunito_600SemiBold" },
  sectionText:       { fontSize: 12, fontFamily: "Nunito_400Regular", color: "#6B7280", lineHeight: 18 },
  lockedOverlay:     { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "#F9FAFB", borderRadius: 10, padding: 12 },
  lockedText:        { fontSize: 13, fontFamily: "Nunito_500Medium", color: "#9CA3AF" },

  upgradeTeaser:      { borderRadius: 20, overflow: "hidden", borderWidth: 1, borderColor: "#C7D2FE",
                        backgroundColor: "#FFFFFF", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 3 },
  upgradeTeaserInner: { padding: 20, gap: 8 },
  upgradeIconRow:     { flexDirection: "row", alignItems: "center", gap: 8 },
  upgradeTeaserTitle: { fontSize: 18, fontFamily: "Nunito_700Bold", color: "#111827" },
  upgradeTeaserSub:   { fontSize: 14, fontFamily: "Nunito_400Regular", color: "#6B7280" },
});
