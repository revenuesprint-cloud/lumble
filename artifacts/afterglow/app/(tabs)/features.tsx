import { PremiumGate } from "@/components/PremiumGate";
import { useApp } from "@/context/AppContext";
import { getAstrologyReading } from "@/utils/astrology";
import { getAllViralFeatures, ViralFeatureResult } from "@/utils/compatibility";
import { getPersonalizedFeatureText } from "@/utils/personalization";
import { getContentBundle, applyVars } from "@/utils/dbContent";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
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

const CARD_COLORS: string[] = [
  "#E85C7A",
  "#B855E0",
  "#7C52C8",
  "#F5A623",
  "#52C8B8",
  "#E85C7A",
  "#7C52C8",
  "#F5A623",
  "#52C8B8",
  "#B855E0",
];

function FeatureCard({
  feature,
  index,
  isPremium,
  onPress,
}: {
  feature: ViralFeatureResult;
  index: number;
  isPremium: boolean;
  onPress: () => void;
}) {
  const color = CARD_COLORS[index % CARD_COLORS.length];
  const isLocked = feature.locked && !isPremium;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 350, delay: index * 55, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 350, delay: index * 55, useNativeDriver: true }),
    ]).start();
  }, []);

  const intensity = feature.score >= 70 ? "High" : feature.score >= 52 ? "Moderate" : "Low";

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
      <TouchableOpacity
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onPress();
        }}
        activeOpacity={0.82}
      >
        <View style={[styles.card, { borderColor: color + "30" }]}>
          {/* Top: icon circle + premium badge */}
          <View style={styles.cardTop}>
            <View style={[styles.iconCircle, { backgroundColor: color + "20", borderColor: color + "44" }]}>
              <Feather name={feature.icon as any} size={18} color={color} />
            </View>
            {isLocked && (
              <View style={[styles.lockBadge, { borderColor: color + "44" }]}>
                <Text style={[styles.lockBadgeText, { color }]}>Premium</Text>
              </View>
            )}
          </View>

          {/* Title */}
          <Text style={styles.cardTitle}>{feature.title}</Text>

          {/* Intensity tag + preview OR locked state */}
          {!isLocked ? (
            <>
              <View style={[styles.intensityChip, { borderColor: color + "55" }]}>
                <Text style={[styles.intensityText, { color }]}>{intensity}</Text>
              </View>
              <Text style={styles.cardPreview} numberOfLines={3}>{feature.text}</Text>
            </>
          ) : (
            <Text style={styles.lockedText}>Unlock with Premium to see this insight.</Text>
          )}

          {/* Footer CTA */}
          <View style={[styles.ctaBtn, { backgroundColor: color + "12", borderColor: color + "44" }]}>
            <Text style={[styles.ctaBtnText, { color }]}>
              {isLocked ? "Unlock →" : "Explore →"}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function FeaturesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, partner, isPremium } = useApp();
  const [showGate, setShowGate] = useState(false);
  const [gateFeature, setGateFeature] = useState<string | undefined>();

  const reading = useMemo(() => {
    if (!user || !partner) return null;
    return getAstrologyReading(user.name, user.birthDate, partner.name, partner.birthDate, user.birthTime);
  }, [user?.birthDate, user?.name, user?.birthTime, partner?.birthDate, partner?.name]);

  if (!user || !partner) return null;
  if (!reading) return <KundliLoading label="Analyzing your compatibility…" />;

  // Build DB feature text lookup
  const dbBundle = getContentBundle();
  const dbFeatureTexts: Record<string, string> = {};
  if (dbBundle?.featureInsights?.length) {
    const vars = { u: user.name, p: partner.name };
    for (const item of dbBundle.featureInsights) {
      const key = (item.meta as any)?.featureKey as string | undefined;
      if (key) dbFeatureTexts[key] = applyVars(item.body, vars);
    }
  }

  const baseFeatures = getAllViralFeatures(user.birthDate, partner.birthDate, user.name, partner.name);
  // Override text: DB first, then kundli-personalized local
  const features = baseFeatures.map((f) => ({
    ...f,
    text: dbFeatureTexts[f.key] ?? getPersonalizedFeatureText(f.key, reading, user.name, partner.name),
  }));

  const handleFeaturePress = (feature: ViralFeatureResult) => {
    if (feature.locked && !isPremium) {
      setGateFeature(feature.title);
      setShowGate(true);
    } else {
      router.push({
        pathname: "/feature-detail",
        params: { featureKey: feature.key },
      });
    }
  };

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
        <Text style={styles.title}>Just between you two</Text>
        <Text style={styles.subtitle}>
          10 things worth knowing about {user.name} & {partner.name}
        </Text>

        <View style={styles.grid}>
          {features.map((feature, i) => (
            <View key={feature.key} style={styles.gridItem}>
              <FeatureCard
                feature={feature}
                index={i}
                isPremium={isPremium}
                onPress={() => handleFeaturePress(feature)}
              />
            </View>
          ))}
        </View>
      </ScrollView>

      <PremiumGate
        visible={showGate}
        onClose={() => setShowGate(false)}
        featureName={gateFeature}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: 16,
    gap: 16,
  },
  title: {
    fontSize: 28,
    fontFamily: "Nunito_700Bold",
    color: "#F0EBF8",
    paddingHorizontal: 4,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Nunito_400Regular",
    color: "rgba(240,235,248,0.4)",
    paddingHorizontal: 4,
    marginTop: -8,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  gridItem: {
    width: "47.5%",
  },
  card: {
    backgroundColor: "#13102A",
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    gap: 11,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 5,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  lockBadge: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
  },
  lockBadgeText: {
    fontSize: 10,
    fontFamily: "Nunito_600SemiBold",
    letterSpacing: 0,
  },
  cardTitle: {
    fontSize: 15,
    fontFamily: "Nunito_700Bold",
    color: "#F0EBF8",
    lineHeight: 21,
  },
  intensityChip: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: "transparent",
  },
  intensityText: {
    fontSize: 11,
    fontFamily: "Nunito_600SemiBold",
  },
  cardPreview: {
    fontSize: 12,
    fontFamily: "Nunito_400Regular",
    color: "rgba(240,235,248,0.5)",
    lineHeight: 18,
    flex: 1,
  },
  lockedText: {
    fontSize: 12,
    fontFamily: "Nunito_400Regular",
    color: "rgba(240,235,248,0.35)",
    lineHeight: 18,
    flex: 1,
  },
  ctaBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    alignSelf: "flex-start",
    marginTop: 2,
  },
  ctaBtnText: {
    fontSize: 12,
    fontFamily: "Nunito_600SemiBold",
  },
});
