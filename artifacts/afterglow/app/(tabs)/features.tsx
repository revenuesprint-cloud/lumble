import { PremiumGate } from "@/components/PremiumGate";
import { useApp } from "@/context/AppContext";
import { getAstrologyReading } from "@/utils/astrology";
import { getAllViralFeatures, ViralFeatureResult } from "@/utils/compatibility";
import { getPersonalizedFeatureText } from "@/utils/personalization";
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

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
      <TouchableOpacity
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onPress();
        }}
        activeOpacity={0.82}
        style={styles.cardOuter}
      >
        <LinearGradient
          colors={[color + "18", color + "08", "#110F1E"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.card, { borderColor: color + "33" }]}
        >
          <View style={styles.cardTop}>
            <View style={[styles.iconCircle, { backgroundColor: color + "22", borderColor: color + "44" }]}>
              <Feather name={feature.icon as any} size={18} color={color} />
            </View>
            {isLocked && (
              <View style={styles.lockBadge}>
                <Text style={styles.lockBadgeText}>Premium</Text>
              </View>
            )}
          </View>

          <Text style={styles.cardTitle}>{feature.title}</Text>

          {!isLocked ? (
            <>
              <View style={[styles.intensityChip, { backgroundColor: color + "16", borderColor: color + "44" }]}>
                <Text style={[styles.intensityText, { color }]}>
                  {feature.score >= 70 ? "High" : feature.score >= 52 ? "Moderate" : "Low"}
                </Text>
              </View>
              <Text style={styles.cardPreview} numberOfLines={3}>
                {feature.text}
              </Text>
            </>
          ) : (
            <View style={styles.lockedRow}>
              <Text style={styles.lockedText}>Tap to unlock</Text>
              <Feather name="lock" size={14} color={color} />
            </View>
          )}
        </LinearGradient>
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

  const baseFeatures = getAllViralFeatures(user.birthDate, partner.birthDate, user.name, partner.name);
  // Override text with kundli-personalised versions
  const features = baseFeatures.map((f) => ({
    ...f,
    text: getPersonalizedFeatureText(f.key, reading, user.name, partner.name),
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
        <Text style={styles.title}>Relationship Insights</Text>
        <Text style={styles.subtitle}>
          10 deep reads on {user.name} & {partner.name}
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
  cardOuter: {
    borderRadius: 18,
    overflow: "hidden",
  },
  card: {
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    gap: 10,
    minHeight: 160,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  lockBadge: {
    backgroundColor: "rgba(240,235,248,0.08)",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
  },
  lockBadgeText: {
    fontSize: 9,
    fontFamily: "Nunito_600SemiBold",
    color: "rgba(240,235,248,0.4)",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  cardTitle: {
    fontSize: 14,
    fontFamily: "Nunito_700Bold",
    color: "#F0EBF8",
    lineHeight: 20,
  },
  intensityChip: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  intensityText: {
    fontSize: 11,
    fontFamily: "Nunito_600SemiBold",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  cardPreview: {
    fontSize: 11,
    fontFamily: "Nunito_400Regular",
    color: "rgba(240,235,248,0.45)",
    lineHeight: 17,
  },
  lockedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  lockedText: {
    fontSize: 12,
    fontFamily: "Nunito_400Regular",
    color: "rgba(240,235,248,0.3)",
  },
});
