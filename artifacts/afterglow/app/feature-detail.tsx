import { useApp } from "@/context/AppContext";
import { getAstrologyReading } from "@/utils/astrology";
import { getAllViralFeatures } from "@/utils/compatibility";
import { getPersonalizedFeatureText } from "@/utils/personalization";
import { SCREEN_W } from "@/constants/layout";
import { Feather } from "@expo/vector-icons";

const RING_SIZE = Math.min(160, Math.round(SCREEN_W * 0.42));
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useRef } from "react";
import { Animated, Easing, Platform, Pressable, ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CARD_COLORS: Record<string, string> = {
  "falls-harder":          "#F43F5E",
  "attached-first":        "#8B5CF6",
  "dependency-index":      "#4A3DE8",
  "ghosting-probability":  "#F59E0B",
  "reunion-potential":     "#10B981",
  "toxic-or-soulmate":     "#F43F5E",
  "cant-let-go":           "#8B5CF6",
  "red-flags":             "#F59E0B",
  "green-flags":           "#10B981",
  "pulling-back":          "#4A3DE8",
};

const CARD_BG: Record<string, string> = {
  "falls-harder":          "#FFF1F2",
  "attached-first":        "#F5F3FF",
  "dependency-index":      "#EEF2FF",
  "ghosting-probability":  "#FFFBEB",
  "reunion-potential":     "#ECFDF5",
  "toxic-or-soulmate":     "#FFF1F2",
  "cant-let-go":           "#F5F3FF",
  "red-flags":             "#FFFBEB",
  "green-flags":           "#ECFDF5",
  "pulling-back":          "#EEF2FF",
};

function ScoreRing({ score, color, colorBg }: { score: number; color: string; colorBg: string }) {
  const scaleAnim   = useRef(new Animated.Value(0.6)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim,   { toValue: 1, friction: 6, tension: 110, delay: 100, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 280, delay: 100, easing: Easing.out(Easing.quad), useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity: opacityAnim, transform: [{ scale: scaleAnim }], alignItems: "center" }}>
      <View style={[styles.ring, { borderColor: color + "40", backgroundColor: colorBg }]}>
        <Text style={[styles.ringScore, { color }]} adjustsFontSizeToFit numberOfLines={1} minimumFontScale={0.6}>{score}</Text>
        <Text style={styles.ringLabel}>out of 100</Text>
      </View>
    </Animated.View>
  );
}

function ErrorScreen({ message, router }: { message: string; router: any }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, backgroundColor: "#F7F5F0" }}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="chevron-left" size={24} color="#64748B" />
        </Pressable>
        <View style={{ width: 40 }} />
      </View>
      <View style={styles.errorState}>
        <View style={styles.errorIconWrap}>
          <Feather name="alert-circle" size={32} color="#94A3B8" />
        </View>
        <Text style={styles.errorTitle}>{message}</Text>
        <Text style={styles.errorSub}>Complete your profile to unlock this reading.</Text>
      </View>
    </View>
  );
}

export default function FeatureDetail() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { featureKey } = useLocalSearchParams<{ featureKey: string }>();
  const { user, partner } = useApp();

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 280, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 280, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, []);

  const reading = useMemo(() => {
    if (!user || !partner) return null;
    return getAstrologyReading(user.name, user.birthDate, partner.name, partner.birthDate, user.birthTime);
  }, [user?.birthDate, user?.name, user?.birthTime, partner?.birthDate, partner?.name]);

  if (!user || !partner || !featureKey || !reading) {
    return <ErrorScreen message="Insight unavailable" router={router} />;
  }

  const baseFeatures = getAllViralFeatures(user.birthDate, partner.birthDate, user.name, partner.name);
  const baseFeature  = baseFeatures.find((f) => f.key === featureKey);
  if (!baseFeature) {
    return <ErrorScreen message="Insight not found" router={router} />;
  }

  const feature  = { ...baseFeature, text: getPersonalizedFeatureText(featureKey, reading, user.name, partner.name) };
  const color    = CARD_COLORS[featureKey] || "#4A3DE8";
  const colorBg  = CARD_BG[featureKey]    || "#EEF2FF";

  const handleShare = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await Share.share({ message: `${feature.title}\n\n${feature.text}\n\nget Lumble on the Play Store:\nhttps://play.google.com/store/apps/details?id=com.lumble.app`, title: feature.title });
    } catch {}
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F7F5F0" }}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Pressable onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.back(); }} style={styles.backBtn} hitSlop={8}>
          <Feather name="chevron-left" size={24} color="#64748B" />
        </Pressable>
        <Pressable onPress={handleShare} style={styles.shareBtn} hitSlop={8}>
          <Feather name="share" size={20} color="#64748B" />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 40 }]}
        style={Platform.OS === "web" ? { maxWidth: 640, alignSelf: "center", width: "100%" } : undefined}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }], gap: 24 }}>
          {/* Icon + title */}
          <View style={styles.titleSection}>
            <View style={[styles.iconCircle, { backgroundColor: colorBg, borderColor: color + "30" }]}>
              <Feather name={feature.icon as any} size={28} color={color} />
            </View>
            <Text style={styles.featureTitle}>{feature.title}</Text>
            <Text style={styles.featureSub}>{user.name} & {partner.name}</Text>
          </View>

          {/* Score ring */}
          <ScoreRing score={feature.score} color={color} colorBg={colorBg} />

          {/* Result card */}
          <View style={[styles.resultCard, { borderColor: color + "30" }]}>
            <View style={[styles.resultAccent, { backgroundColor: color }]} />
            <View style={styles.resultContent}>
              <Text style={styles.resultText}>{feature.text}</Text>
            </View>
          </View>

          {/* What this means section */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionBlockLabel}>WHAT TO DO WITH THIS</Text>
            <View style={[styles.actionCard, { borderColor: color + "30" }]}>
              <View style={[styles.actionCardAccent, { backgroundColor: color + "20" }]}>
                <Feather name="compass" size={18} color={color} />
              </View>
              <View style={styles.actionCardBody}>
                <Text style={styles.actionCardTitle}>Use this in your next conversation</Text>
                <Text style={styles.actionCardText}>
                  This insight is specific to you two. The most useful thing you can do with it is share it with {partner.name} and see how they respond. Their reaction will tell you more than reading it alone will.
                </Text>
                <TouchableOpacity onPress={handleShare} style={[styles.actionBtn, { backgroundColor: color }]} activeOpacity={0.85}>
                  <Text style={styles.actionBtnText}>Share with {partner.name}</Text>
                  <Feather name="send" size={14} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* What makes this score block */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionBlockLabel}>HOW YOUR SCORE IS CALCULATED</Text>
            <View style={styles.scoreExplainCard}>
              <Text style={styles.scoreExplainText}>
                Your score of {feature.score} out of 100 is calculated from the emotional pattern data between your birth dates and how your natures interact. A higher score means this dynamic is more pronounced in your connection. A lower score means it is present but quieter.
              </Text>
              <View style={styles.scoreExplainRow}>
                <View style={[styles.scoreChip, { backgroundColor: color + "15", borderColor: color + "30" }]}>
                  <Text style={[styles.scoreChipText, { color }]}>Your score: {feature.score}</Text>
                </View>
                <View style={styles.scoreChip}>
                  <Text style={styles.scoreChipText}>Average: 68</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Share card */}
          <TouchableOpacity onPress={handleShare} style={styles.shareCard} activeOpacity={0.8}>
            <Feather name="share-2" size={18} color="#94A3B8" />
            <View style={{ flex: 1 }}>
              <Text style={styles.shareCardTitle}>Save or share this insight</Text>
              <Text style={styles.shareCardSub}>Send it to {partner.name} or save it for yourself</Text>
            </View>
            <Feather name="chevron-right" size={16} color="#D1D5DB" />
          </TouchableOpacity>

          <Text style={styles.contextNote}>
            Based on emotional pattern analysis between {user.name} and {partner.name}. Every connection is unique and this reading reflects yours specifically.
          </Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header:       { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingBottom: 8 },
  backBtn:      { width: 40, height: 40, borderRadius: 14, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E2E8F0", alignItems: "center", justifyContent: "center" },
  shareBtn:     { width: 40, height: 40, borderRadius: 20, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E2E8F0", alignItems: "center", justifyContent: "center" },
  scroll:       { paddingHorizontal: 20, paddingTop: 8 },
  titleSection: { alignItems: "center", gap: 12 },
  iconCircle:   { width: 72, height: 72, borderRadius: 36, borderWidth: 1.5, alignItems: "center", justifyContent: "center" },
  featureTitle: { fontSize: 30, fontFamily: "PlusJakartaSans_700Bold", color: "#0F172A", textAlign: "center" },
  featureSub:   { fontSize: 15, fontFamily: "PlusJakartaSans_400Regular", color: "#94A3B8" },

  ring:         { width: RING_SIZE, height: RING_SIZE, borderRadius: RING_SIZE / 2, borderWidth: 2, alignItems: "center", justifyContent: "center", alignSelf: "center",
                  shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 2 },
  ringScore:    { fontSize: 54, fontFamily: "PlusJakartaSans_800ExtraBold" },
  ringLabel:    { fontSize: 12, fontFamily: "PlusJakartaSans_400Regular", color: "#94A3B8" },

  resultCard:    { borderRadius: 20, borderWidth: 1, backgroundColor: "#FFFFFF", flexDirection: "row", overflow: "hidden",
                   shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 2 },
  resultAccent:  { width: 4 },
  resultContent: { flex: 1, padding: 22 },
  resultText:    { fontSize: 17, fontFamily: "PlusJakartaSans_400Regular", color: "#374151", lineHeight: 28 },

  sectionBlock:       { gap: 10 },
  sectionBlockLabel:  { fontSize: 10, fontFamily: "PlusJakartaSans_700Bold", color: "#94A3B8", textTransform: "uppercase", letterSpacing: 1.2 },

  actionCard:         { backgroundColor: "#FFFFFF", borderRadius: 16, borderWidth: 1, overflow: "hidden",
                        shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 2 },
  actionCardAccent:   { paddingHorizontal: 18, paddingVertical: 14, alignItems: "flex-start" },
  actionCardBody:     { paddingHorizontal: 18, paddingBottom: 18, gap: 10 },
  actionCardTitle:    { fontSize: 16, fontFamily: "PlusJakartaSans_700Bold", color: "#0F172A" },
  actionCardText:     { fontSize: 14, fontFamily: "PlusJakartaSans_400Regular", color: "#64748B", lineHeight: 22 },
  actionBtn:          { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, borderRadius: 14, paddingVertical: 13, marginTop: 2 },
  actionBtnText:      { fontSize: 14, fontFamily: "PlusJakartaSans_700Bold", color: "#FFFFFF" },

  scoreExplainCard:   { backgroundColor: "#FFFFFF", borderRadius: 16, borderWidth: 1, borderColor: "#E2E8F0", padding: 18, gap: 14 },
  scoreExplainText:   { fontSize: 14, fontFamily: "PlusJakartaSans_400Regular", color: "#64748B", lineHeight: 22 },
  scoreExplainRow:    { flexDirection: "row", gap: 8 },
  scoreChip:          { borderRadius: 20, borderWidth: 1, borderColor: "#E2E8F0", backgroundColor: "#F8FAFC", paddingHorizontal: 12, paddingVertical: 6 },
  scoreChipText:      { fontSize: 12, fontFamily: "PlusJakartaSans_600SemiBold", color: "#64748B" },

  shareCard:     { backgroundColor: "#FFFFFF", borderRadius: 14, borderWidth: 1, borderColor: "#E2E8F0",
                   padding: 16, flexDirection: "row", alignItems: "center", gap: 12 },
  shareCardTitle:{ fontSize: 14, fontFamily: "PlusJakartaSans_600SemiBold", color: "#374151" },
  shareCardSub:  { fontSize: 12, fontFamily: "PlusJakartaSans_400Regular", color: "#94A3B8", marginTop: 1 },

  contextNote:   { fontSize: 12, fontFamily: "PlusJakartaSans_400Regular", color: "#94A3B8", textAlign: "center", lineHeight: 18, paddingHorizontal: 20 },

  errorState:    { flex: 1, alignItems: "center", justifyContent: "center", gap: 12, paddingHorizontal: 40 },
  errorIconWrap: { width: 72, height: 72, borderRadius: 36, backgroundColor: "#F1F5F9", alignItems: "center", justifyContent: "center" },
  errorTitle:    { fontSize: 22, fontFamily: "PlusJakartaSans_700Bold", color: "#0F172A", textAlign: "center" },
  errorSub:      { fontSize: 14, fontFamily: "PlusJakartaSans_400Regular", color: "#64748B", textAlign: "center", lineHeight: 22 },
});
