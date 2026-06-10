import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import { getAstrologyReading, RASHIS, NAKSHATRAS } from "@/utils/astrology";
import { getPersonalizedHero, getTodayBetweenYou } from "@/utils/personalization";
import { DASHA_CHAPTERS } from "@/utils/content-library";
import { getContentBundle } from "@/utils/dbContent";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function resolveDasha(lord: string) {
  const b = getContentBundle();
  if (b?.dashaChapters?.length) {
    const it = b.dashaChapters.find((i) => (i.meta as any)?.dashaLord === lord);
    if (it) return it.meta as any;
  }
  return DASHA_CHAPTERS[lord];
}

function Block({ label, value, color, c }: { label: string; value: string; color: string; c: ReturnType<typeof useColors> }) {
  const blkStylesMemo = useMemo(() => createBlkStyles(c), [c]);
  if (!value) return null;
  return (
    <View style={blkStylesMemo.wrap}>
      <Text style={blkStylesMemo.label}>{label}</Text>
      <Text style={[blkStylesMemo.value, { color }]}>{value}</Text>
    </View>
  );
}

function createBlkStyles(c: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    wrap:  { gap: 4 },
    label: { fontSize: 11, fontFamily: "PlusJakartaSans_500Medium", color: c.textFaint },
    value: { fontSize: 15, fontFamily: "PlusJakartaSans_400Regular", lineHeight: 23 },
  });
}

export default function ReadingDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, partner } = useApp();
  const c = useColors();
  const styles = useMemo(() => createStyles(c), [c]);
  const params = useLocalSearchParams<{ headline?: string; insight?: string; action?: string; moonTag?: string }>();

  const reading = useMemo(() => {
    if (!user || !partner) return null;
    return getAstrologyReading(user.name, user.birthDate, partner.name, partner.birthDate, user.birthTime);
  }, [user?.birthDate, user?.name, user?.birthTime, partner?.birthDate, partner?.name]);

  if (!user || !partner || !reading) return null;

  const hero     = getPersonalizedHero(user.name, partner.name, reading, partner.relationshipType);
  const rightNow = getTodayBetweenYou(reading, partner.relationshipType, user.name, partner.name);
  const uRashi   = RASHIS[reading.user.moonRashi];
  const pRashi   = RASHIS[reading.partner.moonRashi];
  const nak      = NAKSHATRAS[reading.user.nakshatra];
  const dc       = resolveDasha(reading.user.dasha.current);
  const date     = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  return (
    <View style={{ flex: 1, backgroundColor: c.background }}>
      <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === "web" ? 80 : 16) }]}>
        <TouchableOpacity
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.back(); }}
          activeOpacity={0.7} style={styles.backBtn}
        >
          <Feather name="arrow-left" size={20} color={c.textMuted} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Today's read</Text>
          <Text style={styles.headerSub}>{date}</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={Platform.OS === "web" ? { maxWidth: 640, alignSelf: "center", width: "100%" } : undefined}
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 40 }]}
      >
        {/* Moon tag */}
        <View style={styles.moonTagWrap}>
          <View style={[styles.moonTag, { backgroundColor: uRashi.color + "14", borderColor: uRashi.color + "40" }]}>
            <Text style={[styles.moonTagText, { color: uRashi.color }]}>{uRashi.en} · {pRashi.en}</Text>
          </View>
          <Text style={styles.nakLabel}>{nak.name} nakshatra</Text>
        </View>

        {/* Main insight */}
        <View style={[styles.insightBlock, { borderColor: c.primaryBorder, backgroundColor: c.primaryLight }]}>
          <Text style={styles.insightHeadline}>{hero.headline}</Text>
          <Text style={styles.insightBody}>{hero.insight}</Text>
        </View>

        {/* Today's action */}
        <View style={[styles.actionBlock, { backgroundColor: c.goldLight }]}>
          <View style={styles.actionIconRow}>
            <Feather name="sun" size={14} color="#F59E0B" />
            <Text style={styles.actionLabel}>What to do today</Text>
          </View>
          <Text style={styles.actionText}>{hero.action}</Text>
        </View>

        {/* Right now */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Right now between you</Text>
          <View style={styles.rnCard}>
            <View style={styles.rnRow}>
              <Text style={styles.rnName}>{user.name}</Text>
              <Text style={styles.rnBody}>{rightNow.userMoment}</Text>
            </View>
            <View style={styles.rnDivider} />
            <View style={styles.rnRow}>
              <Text style={styles.rnName}>{partner.name}</Text>
              <Text style={styles.rnBody}>{rightNow.partnerSignal}</Text>
            </View>
          </View>
        </View>

        {/* Life phase */}
        {dc && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your life phase</Text>
            <View style={styles.dashaCard}>
              <Text style={styles.dashaHeadline}>{dc.headline}</Text>
              <Block label="The gift"                value={dc.gift          ?? ""} color="#D97706" c={c} />
              <Block label="The challenge"           value={dc.challenge     ?? ""} color="#D97706" c={c} />
              <Block label="What this means for love" value={dc.lessonForLove ?? ""} color="#D97706" c={c} />
            </View>
          </View>
        )}

        {/* Explainer */}
        <View style={styles.explainerCard}>
          <Text style={styles.explainerTitle}>How this is personalized</Text>
          <Text style={styles.explainerBody}>
            Today's read comes from four signals: your {uRashi.en} moon, {partner.name}'s {pRashi.en} moon, your {nak.name} nakshatra, and your current {reading.user.dasha.current} life phase. The Right Now section is the most time-sensitive part — it reflects where each of you is at this specific moment.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

function createStyles(c: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    header:          { flexDirection: "row", alignItems: "flex-start", paddingHorizontal: 20, paddingBottom: 16, gap: 12, backgroundColor: c.background },
    backBtn:         { width: 40, height: 40, borderRadius: 14, backgroundColor: c.card, borderWidth: 1, borderColor: c.border, alignItems: "center", justifyContent: "center", marginTop: 2 },
    headerTitle:     { fontSize: 20, fontFamily: "PlusJakartaSans_700Bold", color: c.text },
    headerSub:       { fontSize: 13, fontFamily: "PlusJakartaSans_400Regular", color: c.textFaint, marginTop: 2 },
    scroll:          { paddingHorizontal: 20, gap: 18 },

    moonTagWrap:     { flexDirection: "row", alignItems: "center", gap: 10 },
    moonTag:         { borderRadius: 20, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 5 },
    moonTagText:     { fontSize: 12, fontFamily: "PlusJakartaSans_600SemiBold" },
    nakLabel:        { fontSize: 12, fontFamily: "PlusJakartaSans_400Regular", color: c.textFaint },

    insightBlock:    { borderRadius: 16, borderWidth: 1, padding: 18, gap: 10,
                       shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
    insightHeadline: { fontSize: 20, fontFamily: "PlusJakartaSans_800ExtraBold", color: c.text, lineHeight: 27, letterSpacing: -0.2 },
    insightBody:     { fontSize: 15, fontFamily: "PlusJakartaSans_400Regular", color: c.textBody, lineHeight: 24 },

    actionBlock:     { borderRadius: 14, padding: 14, gap: 6 },
    actionIconRow:   { flexDirection: "row", alignItems: "center", gap: 8 },
    actionLabel:     { fontSize: 11, fontFamily: "PlusJakartaSans_600SemiBold", color: "#D97706" },
    actionText:      { fontSize: 15, fontFamily: "PlusJakartaSans_600SemiBold", color: "#D97706", lineHeight: 23 },

    section:         { gap: 10 },
    sectionTitle:    { fontSize: 11, fontFamily: "PlusJakartaSans_700Bold", color: c.textFaint, textTransform: "uppercase", letterSpacing: 1.2 },

    rnCard:          { backgroundColor: c.card, borderRadius: 18, borderWidth: 1, borderColor: c.border, padding: 18, gap: 12,
                       shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 1 },
    rnRow:           { gap: 4 },
    rnName:          { fontSize: 11, fontFamily: "PlusJakartaSans_600SemiBold", color: c.textFaint },
    rnBody:          { fontSize: 15, fontFamily: "PlusJakartaSans_400Regular", color: c.textBody, lineHeight: 23 },
    rnDivider:       { height: 1, backgroundColor: c.borderLight },

    dashaCard:       { backgroundColor: c.card, borderRadius: 14, borderWidth: 1, borderColor: c.border, padding: 16, gap: 12,
                       shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 1 },
    dashaHeadline:   { fontSize: 15, fontFamily: "PlusJakartaSans_600SemiBold", color: c.text, lineHeight: 22 },

    explainerCard:   { backgroundColor: c.card, borderRadius: 16, borderWidth: 1, borderColor: c.border, padding: 18, gap: 8,
                       shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 1 },
    explainerTitle:  { fontSize: 12, fontFamily: "PlusJakartaSans_600SemiBold", color: c.textFaint },
    explainerBody:   { fontSize: 13, fontFamily: "PlusJakartaSans_400Regular", color: c.textMuted, lineHeight: 21 },
  });
}
