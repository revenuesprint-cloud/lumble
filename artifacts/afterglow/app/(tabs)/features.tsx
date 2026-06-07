import { PremiumGate } from "@/components/PremiumGate";
import { useApp } from "@/context/AppContext";
import { getAstrologyReading } from "@/utils/astrology";
import { getAllViralFeatures, ViralFeatureResult } from "@/utils/compatibility";
import { getPersonalizedFeatureText } from "@/utils/personalization";
import { getContentBundle, applyVars } from "@/utils/dbContent";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { KundliLoading } from "@/components/KundliLoading";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CARD_COLORS: string[] = [
  "#F43F5E",
  "#5B4CE8",
  "#8B5CF6",
  "#F59E0B",
  "#10B981",
  "#F43F5E",
  "#5B4CE8",
  "#F59E0B",
  "#10B981",
  "#8B5CF6",
];

const CARD_BG: string[] = [
  "#FFF1F2",
  "#EEF2FF",
  "#F5F3FF",
  "#FFFBEB",
  "#ECFDF5",
  "#FFF1F2",
  "#EEF2FF",
  "#FFFBEB",
  "#ECFDF5",
  "#F5F3FF",
];

function FeatureCard({
  feature, index, isPremium, onPress,
}: {
  feature: ViralFeatureResult; index: number; isPremium: boolean; onPress: () => void;
}) {
  const color   = CARD_COLORS[index % CARD_COLORS.length];
  const colorBg = CARD_BG[index % CARD_BG.length];
  const isLocked = feature.locked && !isPremium;
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 220, delay: index * 30, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 220, delay: index * 30, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, []);

  const intensity = feature.score >= 70 ? "High" : feature.score >= 52 ? "Moderate" : "Low";

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
      <TouchableOpacity
        onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onPress(); }}
        activeOpacity={0.82}
      >
        <View style={styles.card}>
          <View style={styles.cardTop}>
            <View style={[styles.iconCircle, { backgroundColor: colorBg }]}>
              <Feather name={feature.icon as any} size={18} color={color} />
            </View>
            {isLocked && (
              <View style={styles.lockBadge}>
                <Feather name="lock" size={9} color="#9CA3AF" />
                <Text style={styles.lockBadgeText}>Premium</Text>
              </View>
            )}
          </View>
          <Text style={styles.cardTitle}>{feature.title}</Text>
          {!isLocked ? (
            <>
              <View style={[styles.intensityChip, { backgroundColor: colorBg, borderColor: color + "44" }]}>
                <Text style={[styles.intensityText, { color }]}>{intensity}</Text>
              </View>
              <Text style={styles.cardPreview} numberOfLines={3}>{feature.text}</Text>
            </>
          ) : (
            <Text style={styles.lockedText}>Unlock with Premium to see this insight.</Text>
          )}
          <View style={[styles.ctaBtn, { backgroundColor: colorBg, borderColor: color + "44" }]}>
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
  const [showGate,   setShowGate]   = useState(false);
  const [gateFeature, setGateFeature] = useState<string | undefined>();

  const reading = useMemo(() => {
    if (!user || !partner) return null;
    return getAstrologyReading(user.name, user.birthDate, partner.name, partner.birthDate, user.birthTime);
  }, [user?.birthDate, user?.name, user?.birthTime, partner?.birthDate, partner?.name]);

  if (!user || !partner) return null;
  if (!reading) return <KundliLoading label="Analyzing your compatibility…" />;

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
  const features = baseFeatures.map((f) => ({
    ...f,
    text: dbFeatureTexts[f.key] ?? getPersonalizedFeatureText(f.key, reading, user.name, partner.name),
  }));

  const handleFeaturePress = (feature: ViralFeatureResult) => {
    if (feature.locked && !isPremium) {
      setGateFeature(feature.title);
      setShowGate(true);
    } else {
      router.push({ pathname: "/feature-detail", params: { featureKey: feature.key } });
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F4F5F7" }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, {
          paddingTop: insets.top + (Platform.OS === "web" ? 67 : 20),
          paddingBottom: insets.bottom + 100,
        }]}
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
      <PremiumGate visible={showGate} onClose={() => setShowGate(false)} featureName={gateFeature} />
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: 16, gap: 16 },
  title: {
    fontSize: 28, fontFamily: "Nunito_700Bold", color: "#111827", paddingHorizontal: 4,
  },
  subtitle: {
    fontSize: 14, fontFamily: "Nunito_400Regular", color: "#6B7280", paddingHorizontal: 4, marginTop: -8,
  },
  grid:     { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  gridItem: { width: "47.5%" },
  card: {
    backgroundColor: "#FFFFFF", borderRadius: 18, borderWidth: 1, borderColor: "#E5E7EB",
    padding: 16, gap: 10,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 12, elevation: 2,
  },
  cardTop:      { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  iconCircle:   { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  lockBadge:    { flexDirection: "row", alignItems: "center", gap: 3, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20, borderWidth: 1, borderColor: "#E5E7EB", backgroundColor: "#F9FAFB" },
  lockBadgeText:{ fontSize: 10, fontFamily: "Nunito_600SemiBold", color: "#9CA3AF" },
  cardTitle:    { fontSize: 15, fontFamily: "Nunito_700Bold", color: "#111827", lineHeight: 21 },
  intensityChip:{ alignSelf: "flex-start", borderWidth: 1, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  intensityText:{ fontSize: 11, fontFamily: "Nunito_600SemiBold" },
  cardPreview:  { fontSize: 12, fontFamily: "Nunito_400Regular", color: "#6B7280", lineHeight: 18, flex: 1 },
  lockedText:   { fontSize: 12, fontFamily: "Nunito_400Regular", color: "#9CA3AF", lineHeight: 18, flex: 1 },
  ctaBtn:       { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, borderWidth: 1, alignSelf: "flex-start", marginTop: 2 },
  ctaBtnText:   { fontSize: 12, fontFamily: "Nunito_600SemiBold" },
});
