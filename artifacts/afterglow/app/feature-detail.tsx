import { useApp } from "@/context/AppContext";
import { getAllViralFeatures } from "@/utils/compatibility";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, Pressable, ScrollView, Share, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CARD_COLORS: Record<string, string> = {
  "falls-harder": "#E85C7A",
  "attached-first": "#B855E0",
  "dependency-index": "#7C52C8",
  "ghosting-probability": "#F5A623",
  "reunion-potential": "#52C8B8",
  "toxic-or-soulmate": "#E85C7A",
  "cant-let-go": "#B855E0",
  "red-flags": "#F5A623",
  "green-flags": "#52C8B8",
  "pulling-back": "#7C52C8",
};

function ScoreRing({ score, color }: { score: number; color: string }) {
  const scaleAnim = useRef(new Animated.Value(0.6)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, friction: 5, tension: 40, delay: 200, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 500, delay: 200, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity: opacityAnim, transform: [{ scale: scaleAnim }], alignItems: "center" }}>
      <View style={[styles.ring, { borderColor: color + "44" }]}>
        <View style={[styles.ringInner, { backgroundColor: color + "18" }]}>
          <Text style={[styles.ringScore, { color }]}>{score}</Text>
          <Text style={styles.ringLabel}>out of 100</Text>
        </View>
      </View>
    </Animated.View>
  );
}

export default function FeatureDetail() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { featureKey } = useLocalSearchParams<{ featureKey: string }>();
  const { user, partner } = useApp();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  if (!user || !partner || !featureKey) return null;

  const features = getAllViralFeatures(
    user.birthDate,
    partner.birthDate,
    user.name,
    partner.name
  );
  const feature = features.find((f) => f.key === featureKey);
  if (!feature) return null;

  const color = CARD_COLORS[featureKey] || "#E85C7A";

  const handleShare = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await Share.share({
        message: `${feature.title}\n\n${feature.text}\n\n— Afterglow app`,
        title: feature.title,
      });
    } catch {}
  };

  return (
    <LinearGradient colors={["#080611", "#0D0A1E", "#080611"]} style={{ flex: 1 }}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="chevron-left" size={24} color="rgba(240,235,248,0.7)" />
        </Pressable>
        <Pressable onPress={handleShare} style={styles.shareBtn}>
          <Feather name="share" size={20} color="rgba(240,235,248,0.7)" />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }], gap: 28 }}
        >
          {/* Icon + title */}
          <View style={styles.titleSection}>
            <View style={[styles.iconCircle, { backgroundColor: color + "18", borderColor: color + "33" }]}>
              <Feather name={feature.icon as any} size={28} color={color} />
            </View>
            <Text style={styles.featureTitle}>{feature.title}</Text>
            <Text style={styles.featureSub}>
              {user.name} & {partner.name}
            </Text>
          </View>

          {/* Score ring */}
          <ScoreRing score={feature.score} color={color} />

          {/* Result card */}
          <View style={[styles.resultCard, { borderColor: color + "22" }]}>
            <LinearGradient
              colors={[color + "12", "#110F1E"]}
              style={styles.resultCardInner}
            >
              <Text style={styles.resultText}>{feature.text}</Text>
            </LinearGradient>
          </View>

          {/* Share prompt */}
          <Pressable onPress={handleShare} style={styles.shareCard}>
            <LinearGradient
              colors={["rgba(240,235,248,0.04)", "rgba(240,235,248,0.02)"]}
              style={styles.shareCardInner}
            >
              <Feather name="share-2" size={18} color="rgba(240,235,248,0.4)" />
              <View style={{ flex: 1 }}>
                <Text style={styles.shareCardTitle}>Share this insight</Text>
                <Text style={styles.shareCardSub}>Screenshot-ready for stories</Text>
              </View>
              <Feather name="chevron-right" size={16} color="rgba(240,235,248,0.2)" />
            </LinearGradient>
          </Pressable>

          {/* Context note */}
          <Text style={styles.contextNote}>
            This insight is based on emotional pattern analysis between {user.name} and {partner.name}. Every connection is unique.
          </Text>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(240,235,248,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  shareBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(240,235,248,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  scroll: {
    paddingHorizontal: 24,
    paddingTop: 8,
    gap: 0,
  },
  titleSection: {
    alignItems: "center",
    gap: 12,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  featureTitle: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
    color: "#F0EBF8",
    textAlign: "center",
  },
  featureSub: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "rgba(240,235,248,0.35)",
  },
  ring: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginVertical: 8,
  },
  ringInner: {
    width: 130,
    height: 130,
    borderRadius: 65,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  ringScore: {
    fontSize: 48,
    fontFamily: "Inter_700Bold",
  },
  ringLabel: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    color: "rgba(240,235,248,0.35)",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  resultCard: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
  },
  resultCardInner: {
    padding: 24,
  },
  resultText: {
    fontSize: 17,
    fontFamily: "Inter_400Regular",
    color: "rgba(240,235,248,0.9)",
    lineHeight: 28,
  },
  shareCard: {
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(240,235,248,0.06)",
  },
  shareCardInner: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  shareCardTitle: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: "rgba(240,235,248,0.6)",
  },
  shareCardSub: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: "rgba(240,235,248,0.3)",
    marginTop: 1,
  },
  contextNote: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: "rgba(240,235,248,0.2)",
    textAlign: "center",
    lineHeight: 18,
    paddingHorizontal: 20,
    marginTop: 8,
  },
});
