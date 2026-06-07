import { useApp } from "@/context/AppContext";
import { getAstrologyReading } from "@/utils/astrology";
import { getAllViralFeatures } from "@/utils/compatibility";
import { getPersonalizedFeatureText } from "@/utils/personalization";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useRef } from "react";
import { Animated, Easing, Pressable, ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CARD_COLORS: Record<string, string> = {
  "falls-harder":          "#F43F5E",
  "attached-first":        "#8B5CF6",
  "dependency-index":      "#5B4CE8",
  "ghosting-probability":  "#F59E0B",
  "reunion-potential":     "#10B981",
  "toxic-or-soulmate":     "#F43F5E",
  "cant-let-go":           "#8B5CF6",
  "red-flags":             "#F59E0B",
  "green-flags":           "#10B981",
  "pulling-back":          "#5B4CE8",
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
        <Text style={[styles.ringScore, { color }]}>{score}</Text>
        <Text style={styles.ringLabel}>out of 100</Text>
      </View>
    </Animated.View>
  );
}

function ErrorScreen({ message, router }: { message: string; router: any }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, backgroundColor: "#F4F5F7" }}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="chevron-left" size={24} color="#6B7280" />
        </Pressable>
        <View style={{ width: 40 }} />
      </View>
      <View style={styles.errorState}>
        <View style={styles.errorIconWrap}>
          <Feather name="alert-circle" size={32} color="#9CA3AF" />
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
  const color    = CARD_COLORS[featureKey] || "#5B4CE8";
  const colorBg  = CARD_BG[featureKey]    || "#EEF2FF";

  const handleShare = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await Share.share({ message: `${feature.title}\n\n${feature.text}\n\n— Lumble app`, title: feature.title });
    } catch {}
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F4F5F7" }}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Pressable onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.back(); }} style={styles.backBtn}>
          <Feather name="chevron-left" size={24} color="#6B7280" />
        </Pressable>
        <Pressable onPress={handleShare} style={styles.shareBtn}>
          <Feather name="share" size={20} color="#6B7280" />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 40 }]}
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

          {/* Share card */}
          <TouchableOpacity onPress={handleShare} style={styles.shareCard} activeOpacity={0.8}>
            <Feather name="share-2" size={18} color="#9CA3AF" />
            <View style={{ flex: 1 }}>
              <Text style={styles.shareCardTitle}>Share this insight</Text>
              <Text style={styles.shareCardSub}>Screenshot-ready for stories</Text>
            </View>
            <Feather name="chevron-right" size={16} color="#D1D5DB" />
          </TouchableOpacity>

          <Text style={styles.contextNote}>
            This insight is based on emotional pattern analysis between {user.name} and {partner.name}. Every connection is unique.
          </Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header:       { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingBottom: 8 },
  backBtn:      { width: 40, height: 40, borderRadius: 20, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E5E7EB", alignItems: "center", justifyContent: "center" },
  shareBtn:     { width: 40, height: 40, borderRadius: 20, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E5E7EB", alignItems: "center", justifyContent: "center" },
  scroll:       { paddingHorizontal: 20, paddingTop: 8 },
  titleSection: { alignItems: "center", gap: 12 },
  iconCircle:   { width: 72, height: 72, borderRadius: 36, borderWidth: 1.5, alignItems: "center", justifyContent: "center" },
  featureTitle: { fontSize: 30, fontFamily: "Nunito_700Bold", color: "#111827", textAlign: "center" },
  featureSub:   { fontSize: 15, fontFamily: "Nunito_400Regular", color: "#9CA3AF" },

  ring:         { width: 160, height: 160, borderRadius: 80, borderWidth: 2, alignItems: "center", justifyContent: "center", alignSelf: "center",
                  shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 2 },
  ringScore:    { fontSize: 54, fontFamily: "Nunito_700Bold" },
  ringLabel:    { fontSize: 12, fontFamily: "Nunito_400Regular", color: "#9CA3AF" },

  resultCard:    { borderRadius: 20, borderWidth: 1, backgroundColor: "#FFFFFF", flexDirection: "row", overflow: "hidden",
                   shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 2 },
  resultAccent:  { width: 4 },
  resultContent: { flex: 1, padding: 22 },
  resultText:    { fontSize: 17, fontFamily: "Nunito_400Regular", color: "#374151", lineHeight: 28 },

  shareCard:     { backgroundColor: "#FFFFFF", borderRadius: 14, borderWidth: 1, borderColor: "#E5E7EB",
                   padding: 16, flexDirection: "row", alignItems: "center", gap: 12 },
  shareCardTitle:{ fontSize: 14, fontFamily: "Nunito_600SemiBold", color: "#374151" },
  shareCardSub:  { fontSize: 12, fontFamily: "Nunito_400Regular", color: "#9CA3AF", marginTop: 1 },

  contextNote:   { fontSize: 12, fontFamily: "Nunito_400Regular", color: "#9CA3AF", textAlign: "center", lineHeight: 18, paddingHorizontal: 20 },

  errorState:    { flex: 1, alignItems: "center", justifyContent: "center", gap: 12, paddingHorizontal: 40 },
  errorIconWrap: { width: 72, height: 72, borderRadius: 36, backgroundColor: "#F3F4F6", alignItems: "center", justifyContent: "center" },
  errorTitle:    { fontSize: 22, fontFamily: "Nunito_700Bold", color: "#111827", textAlign: "center" },
  errorSub:      { fontSize: 14, fontFamily: "Nunito_400Regular", color: "#6B7280", textAlign: "center", lineHeight: 22 },
});
