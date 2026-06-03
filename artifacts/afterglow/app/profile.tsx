import { useApp } from "@/context/AppContext";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PremiumGate } from "@/components/PremiumGate";

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionCard}>{children}</View>
    </View>
  );
}

function ActionRow({
  icon,
  label,
  sublabel,
  color,
  onPress,
  showChevron = true,
}: {
  icon: string;
  label: string;
  sublabel?: string;
  color?: string;
  onPress: () => void;
  showChevron?: boolean;
}) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.actionRow}>
      <View style={[styles.actionIcon, { backgroundColor: (color || "#E85C7A") + "18" }]}>
        <Feather name={icon as any} size={16} color={color || "#E85C7A"} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.actionLabel, color ? { color } : {}]}>{label}</Text>
        {sublabel ? <Text style={styles.actionSublabel}>{sublabel}</Text> : null}
      </View>
      {showChevron && (
        <Feather name="chevron-right" size={16} color="rgba(240,235,248,0.2)" />
      )}
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, partner, isPremium, upgradeToPremium, resetApp } = useApp();
  const [showPremiumGate, setShowPremiumGate] = useState(false);

  if (!user || !partner) return null;

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  };

  const relTypeLabel: Record<string, string> = {
    crush: "Crush",
    situationship: "Situationship",
    relationship: "Relationship",
    ex: "Ex",
  };

  const handleReset = () => {
    Alert.alert(
      "Reset connection?",
      "This will clear all your data and take you back to onboarding. This can't be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            await resetApp();
            router.replace("/onboarding");
          },
        },
      ]
    );
  };

  return (
    <LinearGradient colors={["#080611", "#0D0A1E"]} style={{ flex: 1 }}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="chevron-left" size={24} color="rgba(240,235,248,0.7)" />
        </Pressable>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 40 }]}
      >
        {/* Avatar area */}
        <View style={styles.avatarSection}>
          <LinearGradient
            colors={["#E85C7A", "#B855E0"]}
            style={styles.avatar}
          >
            <Text style={styles.avatarInitial}>{user.name[0]}</Text>
          </LinearGradient>
          <Text style={styles.userName}>{user.name}</Text>
          {isPremium ? (
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumBadgeText}>◈ Premium</Text>
            </View>
          ) : (
            <View style={styles.freeBadge}>
              <Text style={styles.freeBadgeText}>Free plan</Text>
            </View>
          )}
        </View>

        {/* Your info */}
        <Section title="You">
          <InfoRow label="Name" value={user.name} />
          <View style={styles.separator} />
          <InfoRow label="Birthday" value={formatDate(user.birthDate)} />
          {user.birthTime ? (
            <>
              <View style={styles.separator} />
              <InfoRow label="Birth time" value={user.birthTime} />
            </>
          ) : null}
        </Section>

        {/* Partner info */}
        <Section title="Your Connection">
          <View style={styles.partnerRow}>
            <View style={styles.partnerAvatar}>
              <Text style={styles.partnerInitial}>{partner.name[0]}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.partnerName}>{partner.name}</Text>
              <Text style={styles.partnerType}>
                {relTypeLabel[partner.relationshipType]}
              </Text>
            </View>
          </View>
          <View style={styles.separator} />
          <InfoRow label="Their birthday" value={formatDate(partner.birthDate)} />
        </Section>

        {/* Premium */}
        {!isPremium && (
          <Section title="Subscription">
            <TouchableOpacity
              onPress={() => setShowPremiumGate(true)}
              activeOpacity={0.85}
              style={styles.upgradeCard}
            >
              <LinearGradient
                colors={["rgba(232,92,122,0.2)", "rgba(184,85,224,0.1)"]}
                style={styles.upgradeCardInner}
              >
                <View style={{ flex: 1, gap: 4 }}>
                  <Text style={styles.upgradeTitle}>Unlock Premium</Text>
                  <Text style={styles.upgradeSub}>
                    All insights · Unlimited guidance · Deep reads
                  </Text>
                </View>
                <Text style={styles.upgradePrice}>$9.99/mo</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Section>
        )}

        {isPremium && (
          <Section title="Subscription">
            <View style={styles.premiumActiveCard}>
              <Text style={styles.premiumActiveIcon}>◈</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.premiumActiveTitle}>Premium Active</Text>
                <Text style={styles.premiumActiveSub}>
                  All features unlocked · Unlimited guidance
                </Text>
              </View>
            </View>
          </Section>
        )}

        {/* Actions */}
        <Section title="Account">
          <ActionRow
            icon="refresh-cw"
            label="Change connection"
            sublabel="Update who you're analyzing"
            onPress={handleReset}
          />
          <View style={styles.separator} />
          <ActionRow
            icon="trash-2"
            label="Reset everything"
            sublabel="Start completely fresh"
            color="#ef4444"
            onPress={handleReset}
            showChevron={false}
          />
        </Section>

        {/* App info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>Afterglow · Version 1.0</Text>
          <Text style={styles.appInfoText}>Emotional intelligence, not astrology</Text>
        </View>
      </ScrollView>

      <PremiumGate
        visible={showPremiumGate}
        onClose={() => setShowPremiumGate(false)}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(240,235,248,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 17,
    fontFamily: "Inter_600SemiBold",
    color: "#F0EBF8",
  },
  scroll: {
    paddingHorizontal: 20,
    gap: 20,
    paddingTop: 8,
  },
  avatarSection: {
    alignItems: "center",
    gap: 10,
    paddingVertical: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: {
    fontSize: 34,
    fontFamily: "Inter_700Bold",
    color: "#fff",
  },
  userName: {
    fontSize: 24,
    fontFamily: "Inter_700Bold",
    color: "#F0EBF8",
  },
  premiumBadge: {
    backgroundColor: "rgba(232,92,122,0.12)",
    borderWidth: 1,
    borderColor: "rgba(232,92,122,0.3)",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 5,
  },
  premiumBadgeText: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    color: "#E85C7A",
  },
  freeBadge: {
    backgroundColor: "rgba(240,235,248,0.05)",
    borderWidth: 1,
    borderColor: "rgba(240,235,248,0.1)",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 5,
  },
  freeBadgeText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: "rgba(240,235,248,0.35)",
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    color: "rgba(240,235,248,0.35)",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    paddingHorizontal: 4,
  },
  sectionCard: {
    backgroundColor: "#110F1E",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(240,235,248,0.07)",
    overflow: "hidden",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  infoLabel: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    color: "rgba(240,235,248,0.55)",
  },
  infoValue: {
    fontSize: 15,
    fontFamily: "Inter_500Medium",
    color: "#F0EBF8",
  },
  separator: {
    height: 1,
    backgroundColor: "rgba(240,235,248,0.05)",
    marginHorizontal: 18,
  },
  partnerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  partnerAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(184,85,224,0.15)",
    borderWidth: 1,
    borderColor: "rgba(184,85,224,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  partnerInitial: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    color: "#B855E0",
  },
  partnerName: {
    fontSize: 17,
    fontFamily: "Inter_600SemiBold",
    color: "#F0EBF8",
  },
  partnerType: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: "rgba(240,235,248,0.4)",
    marginTop: 2,
  },
  upgradeCard: {
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(232,92,122,0.2)",
  },
  upgradeCardInner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    gap: 12,
  },
  upgradeTitle: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    color: "#F0EBF8",
  },
  upgradeSub: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: "rgba(240,235,248,0.45)",
  },
  upgradePrice: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    color: "#E85C7A",
  },
  premiumActiveCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  premiumActiveIcon: {
    fontSize: 24,
    color: "#E85C7A",
  },
  premiumActiveTitle: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    color: "#F0EBF8",
  },
  premiumActiveSub: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: "rgba(240,235,248,0.4)",
    marginTop: 2,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  actionIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  actionLabel: {
    fontSize: 15,
    fontFamily: "Inter_500Medium",
    color: "#F0EBF8",
  },
  actionSublabel: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: "rgba(240,235,248,0.35)",
    marginTop: 1,
  },
  appInfo: {
    alignItems: "center",
    gap: 4,
    paddingVertical: 8,
  },
  appInfoText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: "rgba(240,235,248,0.2)",
  },
});
