import { useApp } from "@/context/AppContext";
import { getAstrologyReading, NAKSHATRAS, RASHIS } from "@/utils/astrology";
import {
  DASHA_CHAPTERS,
  MOON_PROFILES_DEEP,
  NAKSHATRA_PROFILES,
  KOOTA_NARRATIVES,
} from "@/utils/content-library";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { KundliLoading } from "@/components/KundliLoading";
import React, { useMemo, useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Tab = "user" | "partner" | "combined";

// ─── Small reusable card ──────────────────────────────────────────────────────

function InsightCard({ icon, label, value, color = "#E85C7A" }: {
  icon: string; label: string; value: string; color?: string;
}) {
  return (
    <View style={[styles.insightCard, { borderColor: color + "22" }]}>
      <LinearGradient colors={[color + "14", "transparent"]} style={styles.insightCardGrad}>
        <View style={styles.insightCardHeader}>
          <Text style={[styles.insightCardIcon, { color }]}>{icon}</Text>
          <Text style={[styles.insightCardLabel, { color: color + "CC" }]}>{label}</Text>
        </View>
        <Text style={styles.insightCardValue}>{value}</Text>
      </LinearGradient>
    </View>
  );
}

function SignsRow({ sunEn, moonEn, lagnaEn, sunColor, moonColor, lagnaColor }: {
  sunEn: string; moonEn: string; lagnaEn: string;
  sunColor: string; moonColor: string; lagnaColor: string;
}) {
  return (
    <View style={styles.signsRow}>
      {[
        { icon: "☉", label: "Sun", value: sunEn, color: sunColor },
        { icon: "☽", label: "Moon", value: moonEn, color: moonColor },
        { icon: "↑", label: "Rising", value: lagnaEn, color: lagnaColor },
      ].map((s) => (
        <View key={s.label} style={[styles.signPill, { borderColor: s.color + "33", backgroundColor: s.color + "10" }]}>
          <Text style={[styles.signPillIcon, { color: s.color }]}>{s.icon}</Text>
          <Text style={[styles.signPillName, { color: s.color }]}>{s.value}</Text>
          <Text style={styles.signPillLabel}>{s.label}</Text>
        </View>
      ))}
    </View>
  );
}

// ─── Profile section ──────────────────────────────────────────────────────────

function PersonProfile({ name, kundliData }: {
  name: string;
  kundliData: ReturnType<typeof getAstrologyReading>["user"];
}) {
  const moonRashi = RASHIS[kundliData.moonRashi];
  const sunRashi  = RASHIS[kundliData.sunRashi];
  const lagna     = RASHIS[kundliData.lagnaRashi];
  const nak       = NAKSHATRAS[kundliData.nakshatra];
  const mp        = MOON_PROFILES_DEEP[kundliData.moonRashi] ?? MOON_PROFILES_DEEP[0];
  const np        = NAKSHATRA_PROFILES[kundliData.nakshatra] ?? NAKSHATRA_PROFILES[0];
  const dc        = DASHA_CHAPTERS[kundliData.dasha.current];

  return (
    <View style={styles.profileContainer}>

      {/* Signs */}
      <View style={styles.sectionBlock}>
        <Text style={styles.sectionLabel}>✦  Your Signs</Text>
        <SignsRow
          sunEn={sunRashi.en} moonEn={moonRashi.en} lagnaEn={lagna.en}
          sunColor={sunRashi.color} moonColor={moonRashi.color} lagnaColor={lagna.color}
        />
      </View>

      {/* How you love */}
      <View style={styles.sectionBlock}>
        <Text style={styles.sectionLabel}>◉  How {name} Loves</Text>
        <View style={[styles.card, { borderColor: moonRashi.color + "22" }]}>
          <LinearGradient colors={[moonRashi.color + "12", "transparent"]} style={styles.cardGrad}>
            <Text style={styles.cardBodyText}>"{mp.insight}"</Text>
            <View style={styles.divider} />
            <View style={styles.bulletRow}>
              <Feather name="heart" size={13} color={moonRashi.color} />
              <Text style={styles.bulletText}>{mp.needsToHear}</Text>
            </View>
            {mp.coreWound ? (
              <View style={styles.bulletRow}>
                <Feather name="anchor" size={13} color="rgba(240,235,248,0.35)" />
                <Text style={styles.bulletText}>{mp.coreWound}</Text>
              </View>
            ) : null}
            {mp.blindspot ? (
              <View style={styles.bulletRow}>
                <Feather name="eye-off" size={13} color="rgba(240,235,248,0.35)" />
                <Text style={styles.bulletText}>{mp.blindspot}</Text>
              </View>
            ) : null}
          </LinearGradient>
        </View>
      </View>

      {/* Relationship pattern */}
      <View style={styles.sectionBlock}>
        <Text style={styles.sectionLabel}>◈  Relationship Pattern</Text>
        <View style={styles.patternGrid}>
          <InsightCard icon="↻" label="Pattern" value={np.pattern} color="#B855E0" />
          <InsightCard icon="✦" label="Drawn to" value={np.craving} color="#7C52C8" />
          <InsightCard icon="▲" label="Strength" value={np.strength} color="#52C8B8" />
          <InsightCard icon="◎" label="Watch out for" value={np.trap} color="#F5A623" />
        </View>
      </View>

      {/* Life chapter */}
      {dc && (
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionLabel}>◐  Right Now in Life</Text>
          <View style={[styles.card, { borderColor: "rgba(245,166,35,0.2)" }]}>
            <LinearGradient colors={["rgba(245,166,35,0.1)", "transparent"]} style={styles.cardGrad}>
              <Text style={styles.chapterHeadline}>{dc.headline}</Text>
              <View style={styles.divider} />
              <View style={styles.bulletRow}>
                <Feather name="gift" size={13} color="#52C8B8" />
                <Text style={styles.bulletText}><Text style={{ color: "#52C8B8" }}>Gift: </Text>{dc.gift}</Text>
              </View>
              <View style={styles.bulletRow}>
                <Feather name="alert-triangle" size={13} color="#F5A623" />
                <Text style={styles.bulletText}><Text style={{ color: "#F5A623" }}>Watch: </Text>{dc.challenge}</Text>
              </View>
              <View style={styles.bulletRow}>
                <Feather name="heart" size={13} color="#E85C7A" />
                <Text style={styles.bulletText}><Text style={{ color: "#E85C7A" }}>For love: </Text>{dc.lessonForLove}</Text>
              </View>
              <View style={[styles.timeRow, { marginTop: 10 }]}>
                <Text style={styles.timeText}>{kundliData.dasha.remaining} left in this chapter</Text>
              </View>
            </LinearGradient>
          </View>
        </View>
      )}
    </View>
  );
}

// ─── Together (compatibility) section ────────────────────────────────────────

function TogetherView({ reading, userName, partnerName }: {
  reading: ReturnType<typeof getAstrologyReading>;
  userName: string;
  partnerName: string;
}) {
  const { guna } = reading;
  const score = guna.total;
  const pct   = Math.round((score / 36) * 100);

  const scoreColor  = score >= 28 ? "#52C8B8" : score >= 21 ? "#F5A623" : "#E85C7A";
  const scoreVerdict = score >= 28
    ? "Strong natural connection"
    : score >= 21 ? "Good foundation with room to grow"
    : score >= 18 ? "Can work with honest effort"
    : "Challenging but not impossible";

  // Pick 3 most interesting koota insights to surface
  const sorted = [...guna.breakdown].sort((a, b) => (b.score / b.max) - (a.score / a.max));
  const topKoota    = sorted[0];
  const bottomKoota = sorted[sorted.length - 1];
  const midKoota    = sorted[Math.floor(sorted.length / 2)];

  const kootaToInsight = (k: typeof sorted[0], type: "strength" | "challenge") => {
    const narrative = KOOTA_NARRATIVES[k.name];
    if (!narrative) return null;
    return {
      label: k.name === "Graha Maitri" ? "Mental Connection"
           : k.name === "Gana"         ? "Temperament Match"
           : k.name === "Bhakoot"      ? "Emotional Rhythm"
           : k.name === "Nadi"         ? "Energy Compatibility"
           : k.name === "Yoni"         ? "Physical Closeness"
           : k.name === "Tara"         ? "Timing & Readiness"
           : k.name === "Vashya"       ? "Influence Balance"
           : "Compatibility Factor",
      text: type === "strength" ? narrative.strongText : narrative.weakText,
      color: type === "strength" ? "#52C8B8" : "#E85C7A",
      icon: type === "strength" ? "✦" : "◎",
    };
  };

  const uMoon = RASHIS[reading.user.moonRashi];
  const pMoon = RASHIS[reading.partner.moonRashi];

  return (
    <View style={styles.profileContainer}>

      {/* Score */}
      <View style={[styles.scoreCard, { borderColor: scoreColor + "33" }]}>
        <LinearGradient colors={[scoreColor + "18", "transparent"]} style={styles.scoreCardGrad}>
          <Text style={[styles.scoreBig, { color: scoreColor }]}>
            {pct}<Text style={styles.scorePct}>%</Text>
          </Text>
          <Text style={styles.scoreVerdictText}>{scoreVerdict}</Text>
          <Text style={styles.scoreSubText}>{reading.compatibility}</Text>
        </LinearGradient>
      </View>

      {/* What flows naturally */}
      {(() => {
        const insight = kootaToInsight(topKoota, "strength");
        return insight ? (
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionLabel}>✦  What Flows Naturally</Text>
            <View style={[styles.card, { borderColor: insight.color + "22" }]}>
              <LinearGradient colors={[insight.color + "10", "transparent"]} style={styles.cardGrad}>
                <Text style={[styles.kootaLabel, { color: insight.color }]}>{insight.label}</Text>
                <Text style={styles.cardBodyText}>{insight.text}</Text>
              </LinearGradient>
            </View>
          </View>
        ) : null;
      })()}

      {/* The friction point */}
      {(() => {
        const insight = kootaToInsight(bottomKoota, "challenge");
        return insight ? (
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionLabel}>◎  Where It Gets Hard</Text>
            <View style={[styles.card, { borderColor: insight.color + "22" }]}>
              <LinearGradient colors={[insight.color + "08", "transparent"]} style={styles.cardGrad}>
                <Text style={[styles.kootaLabel, { color: insight.color }]}>{insight.label}</Text>
                <Text style={styles.cardBodyText}>{insight.text}</Text>
                {KOOTA_NARRATIVES[bottomKoota.name]?.fix ? (
                  <View style={[styles.bulletRow, { marginTop: 8 }]}>
                    <Feather name="compass" size={13} color="#52C8B8" />
                    <Text style={styles.bulletText}>
                      <Text style={{ color: "#52C8B8" }}>What helps: </Text>
                      {KOOTA_NARRATIVES[bottomKoota.name].fix}
                    </Text>
                  </View>
                ) : null}
              </LinearGradient>
            </View>
          </View>
        ) : null;
      })()}

      {/* Moon dynamic */}
      <View style={styles.sectionBlock}>
        <Text style={styles.sectionLabel}>☽  How Your Emotions Meet</Text>
        <View style={[styles.card, { borderColor: "rgba(184,85,224,0.2)" }]}>
          <LinearGradient colors={["rgba(184,85,224,0.08)", "transparent"]} style={styles.cardGrad}>
            <View style={styles.moonDynamicRow}>
              <View style={[styles.moonPill, { backgroundColor: uMoon.color + "18", borderColor: uMoon.color + "44" }]}>
                <Text style={[styles.moonPillText, { color: uMoon.color }]}>{userName}</Text>
                <Text style={[styles.moonPillSign, { color: uMoon.color }]}>{uMoon.en} Moon</Text>
              </View>
              <Text style={styles.moonDynamicArrow}>⟷</Text>
              <View style={[styles.moonPill, { backgroundColor: pMoon.color + "18", borderColor: pMoon.color + "44" }]}>
                <Text style={[styles.moonPillText, { color: pMoon.color }]}>{partnerName}</Text>
                <Text style={[styles.moonPillSign, { color: pMoon.color }]}>{pMoon.en} Moon</Text>
              </View>
            </View>
            <Text style={[styles.cardBodyText, { marginTop: 12 }]}>
              {uMoon.element === pMoon.element
                ? `Both ${uMoon.element} signs. You process emotions in similar ways. This creates natural understanding but also similar blind spots.`
                : `${uMoon.element} meets ${pMoon.element}. You have different emotional styles. This difference is also what creates the chemistry between you.`}
            </Text>
          </LinearGradient>
        </View>
      </View>

    </View>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function AstrologyScreen() {
  const insets = useSafeAreaInsets();
  const { user, partner } = useApp();
  const [activeTab, setActiveTab] = useState<Tab>("user");

  const reading = useMemo(() => {
    if (!user || !partner) return null;
    return getAstrologyReading(
      user.name, user.birthDate,
      partner.name, partner.birthDate,
      user.birthTime,
    );
  }, [user?.birthDate, user?.name, user?.birthTime, partner?.birthDate, partner?.name]);

  if (!user || !partner) return null;
  if (!reading) return <KundliLoading label="Reading your stars…" />;

  const tabs: { key: Tab; label: string }[] = [
    { key: "user",     label: user.name },
    { key: "partner",  label: partner.name },
    { key: "combined", label: "Together" },
  ];

  return (
    <LinearGradient colors={["#080611", "#0D0A1E"]} style={{ flex: 1 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + (Platform.OS === "web" ? 67 : 20), paddingBottom: insets.bottom + 100 },
        ]}
      >
        {/* Title */}
        <View style={styles.titleRow}>
          <View>
            <Text style={styles.screenTitle}>Your Stars</Text>
            <Text style={styles.screenSub}>What the cosmos says about how you love</Text>
          </View>
          <View style={styles.starsIcon}>
            <Text style={styles.starsText}>✦</Text>
          </View>
        </View>

        {/* Tab bar */}
        <View style={styles.tabBar}>
          {tabs.map((t) => (
            <TouchableOpacity
              key={t.key}
              onPress={() => setActiveTab(t.key)}
              style={[styles.tabBtn, activeTab === t.key && styles.tabBtnActive]}
            >
              <Text style={[styles.tabBtnText, activeTab === t.key && styles.tabBtnTextActive]}>
                {t.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {activeTab === "combined" ? (
          <TogetherView
            reading={reading}
            userName={user.name}
            partnerName={partner.name}
          />
        ) : (
          <PersonProfile
            name={activeTab === "user" ? user.name : partner.name}
            kundliData={activeTab === "user" ? reading.user : reading.partner}
          />
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: 20, gap: 0 },

  titleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 },
  screenTitle: { fontSize: 28, fontFamily: "Nunito_700Bold", color: "#F0EBF8" },
  screenSub:   { fontSize: 13, fontFamily: "Nunito_400Regular", color: "rgba(240,235,248,0.4)", marginTop: 2 },
  starsIcon:   { width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(245,166,35,0.12)", alignItems: "center", justifyContent: "center" },
  starsText:   { fontSize: 18, color: "#F5A623" },

  tabBar:          { flexDirection: "row", backgroundColor: "rgba(26,22,48,0.8)", borderRadius: 14, padding: 4, gap: 2, marginBottom: 20 },
  tabBtn:          { flex: 1, paddingVertical: 9, borderRadius: 10, alignItems: "center" },
  tabBtnActive:    { backgroundColor: "#1E1A30" },
  tabBtnText:      { fontSize: 13, fontFamily: "Nunito_500Medium", color: "rgba(240,235,248,0.4)" },
  tabBtnTextActive:{ color: "#F0EBF8", fontFamily: "Nunito_600SemiBold" },

  profileContainer: { gap: 20 },
  sectionBlock:     { gap: 10 },
  sectionLabel:     { fontSize: 12, fontFamily: "Nunito_700Bold", color: "rgba(240,235,248,0.45)", letterSpacing: 1, textTransform: "uppercase" },

  // Signs row
  signsRow: { flexDirection: "row", gap: 8 },
  signPill: {
    flex: 1, borderWidth: 1, borderRadius: 14,
    padding: 12, alignItems: "center", gap: 4,
  },
  signPillIcon:  { fontSize: 18 },
  signPillName:  { fontSize: 14, fontFamily: "Nunito_700Bold" },
  signPillLabel: { fontSize: 10, fontFamily: "Nunito_400Regular", color: "rgba(240,235,248,0.35)", textTransform: "uppercase", letterSpacing: 0.5 },

  // Cards
  card:     { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  cardGrad: { padding: 16, gap: 10 },
  cardBodyText: { fontSize: 14, fontFamily: "Nunito_400Regular", color: "rgba(240,235,248,0.8)", lineHeight: 22 },
  divider: { height: 1, backgroundColor: "rgba(240,235,248,0.06)" },
  bulletRow: { flexDirection: "row", alignItems: "flex-start", gap: 8 },
  bulletText: { flex: 1, fontSize: 13, fontFamily: "Nunito_400Regular", color: "rgba(240,235,248,0.65)", lineHeight: 20 },

  // Dasha / life chapter
  chapterHeadline: { fontSize: 15, fontFamily: "Nunito_600SemiBold", color: "#F0EBF8", lineHeight: 22 },
  timeRow: { alignItems: "center" },
  timeText: { fontSize: 12, fontFamily: "Nunito_500Medium", color: "rgba(245,166,35,0.6)" },

  // Pattern grid
  patternGrid:      { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  insightCard:      { width: "47.5%", borderRadius: 14, borderWidth: 1, overflow: "hidden" },
  insightCardGrad:  { padding: 14, gap: 6, minHeight: 90 },
  insightCardHeader:{ flexDirection: "row", alignItems: "center", gap: 6 },
  insightCardIcon:  { fontSize: 14 },
  insightCardLabel: { fontSize: 10, fontFamily: "Nunito_600SemiBold", textTransform: "uppercase", letterSpacing: 0.5 },
  insightCardValue: { fontSize: 12, fontFamily: "Nunito_400Regular", color: "rgba(240,235,248,0.7)", lineHeight: 18 },

  // Score
  scoreCard:     { borderRadius: 20, borderWidth: 1, overflow: "hidden", marginBottom: 4 },
  scoreCardGrad: { padding: 24, alignItems: "center", gap: 8 },
  scoreBig:      { fontSize: 64, fontFamily: "Nunito_700Bold" },
  scorePct:      { fontSize: 32, fontFamily: "Nunito_400Regular", color: "rgba(240,235,248,0.5)" },
  scoreVerdictText:{ fontSize: 17, fontFamily: "Nunito_700Bold", color: "#F0EBF8" },
  scoreSubText:    { fontSize: 13, fontFamily: "Nunito_400Regular", color: "rgba(240,235,248,0.55)", lineHeight: 20, textAlign: "center" },

  // Koota insights
  kootaLabel: { fontSize: 11, fontFamily: "Nunito_700Bold", textTransform: "uppercase", letterSpacing: 0.8 },

  // Moon dynamic
  moonDynamicRow:   { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
  moonPill:         { flex: 1, borderRadius: 12, borderWidth: 1, padding: 12, alignItems: "center", gap: 3 },
  moonPillText:     { fontSize: 13, fontFamily: "Nunito_700Bold" },
  moonPillSign:     { fontSize: 11, fontFamily: "Nunito_400Regular" },
  moonDynamicArrow: { fontSize: 20, color: "rgba(240,235,248,0.25)" },
});
