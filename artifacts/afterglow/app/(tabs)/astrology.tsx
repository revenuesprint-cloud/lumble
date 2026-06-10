import { useApp } from "@/context/AppContext";
import { getAstrologyReading, NAKSHATRAS, RASHIS } from "@/utils/astrology";
import {
  DASHA_CHAPTERS,
  MOON_PROFILES_DEEP,
  NAKSHATRA_PROFILES,
  KOOTA_NARRATIVES,
  type MoonProfile,
  type NakshatraProfile,
  type DashaChapter,
  type KootaNarrative,
} from "@/utils/content-library";
import { getContentBundle } from "@/utils/dbContent";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { KundliLoading } from "@/components/KundliLoading";
import { useRouter } from "expo-router";
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

// ─── DB content resolvers — DB bundle first, local fallback ───────────────────

function getMoonProfile(rashiIdx: number): MoonProfile {
  const bundle = getContentBundle();
  if (bundle?.moonProfiles?.length) {
    const item = bundle.moonProfiles.find((i) => (i.meta as any)?.moonRashiIdx === rashiIdx);
    if (item) return item.meta as unknown as MoonProfile;
  }
  return MOON_PROFILES_DEEP[rashiIdx] ?? MOON_PROFILES_DEEP[0];
}

function getNakshatraProfile(nakshatraIdx: number): NakshatraProfile {
  const bundle = getContentBundle();
  if (bundle?.nakshatraProfiles?.length) {
    const item = bundle.nakshatraProfiles.find((i) => (i.meta as any)?.nakshatraIdx === nakshatraIdx);
    if (item) return item.meta as unknown as NakshatraProfile;
  }
  return NAKSHATRA_PROFILES[nakshatraIdx] ?? NAKSHATRA_PROFILES[0];
}

function getDashaChapter(dashaLord: string): DashaChapter | undefined {
  const bundle = getContentBundle();
  if (bundle?.dashaChapters?.length) {
    const item = bundle.dashaChapters.find((i) => (i.meta as any)?.dashaLord === dashaLord);
    if (item) return item.meta as unknown as DashaChapter;
  }
  return DASHA_CHAPTERS[dashaLord];
}

function getKootaNarrative(kootaName: string): KootaNarrative | undefined {
  const bundle = getContentBundle();
  if (bundle?.kootaNarratives?.length) {
    const item = bundle.kootaNarratives.find((i) => (i.meta as any)?.kootaName === kootaName);
    if (item) return item.meta as unknown as KootaNarrative;
  }
  return KOOTA_NARRATIVES[kootaName];
}

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

function PersonProfile({ name, kundliData, onOpenFull }: {
  name: string;
  kundliData: ReturnType<typeof getAstrologyReading>["user"];
  onOpenFull?: () => void;
}) {
  const moonRashi = RASHIS[kundliData.moonRashi];
  const sunRashi  = RASHIS[kundliData.sunRashi];
  const lagna     = RASHIS[kundliData.lagnaRashi];
  const nak       = NAKSHATRAS[kundliData.nakshatra];
  // DB bundle first, local fallback
  const mp        = getMoonProfile(kundliData.moonRashi);
  const np        = getNakshatraProfile(kundliData.nakshatra);
  const dc        = getDashaChapter(kundliData.dasha.current);

  return (
    <View style={styles.profileContainer}>

      {/* Signs */}
      <View style={styles.sectionBlock}>
        <Text style={styles.sectionLabel}>Your signs</Text>
        <SignsRow
          sunEn={sunRashi.en} moonEn={moonRashi.en} lagnaEn={lagna.en}
          sunColor={sunRashi.color} moonColor={moonRashi.color} lagnaColor={lagna.color}
        />
      </View>

      {/* How you love */}
      <View style={styles.sectionBlock}>
        <Text style={styles.sectionLabel}>How {name} loves</Text>
        <View style={[styles.card, { borderColor: moonRashi.color + "22" }]}>
          <LinearGradient colors={[moonRashi.color + "12", "transparent"]} style={styles.cardGrad}>
            <Text style={styles.cardBodyText}>"{mp.insight}"</Text>
            <View style={styles.divider} />
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
            {mp.solution ? (
              <View style={styles.bulletRow}>
                <Feather name="compass" size={13} color="#52C8B8" />
                <Text style={styles.bulletText}>
                  <Text style={{ color: "#52C8B8" }}>Try this: </Text>{mp.solution}
                </Text>
              </View>
            ) : null}
            <View style={styles.bulletRow}>
              <Feather name="heart" size={13} color={moonRashi.color} />
              <Text style={[styles.bulletText, { color: "rgba(240,235,248,0.92)", fontFamily: "PlusJakartaSans_500Medium" }]}>{mp.needsToHear}</Text>
            </View>
          </LinearGradient>
        </View>
      </View>

      {/* Relationship pattern */}
      <View style={styles.sectionBlock}>
        <Text style={styles.sectionLabel}>Your pattern in love</Text>
        <View style={styles.patternGrid}>
          <InsightCard icon="↻" label="Your pattern" value={np.pattern} color="#B855E0" />
          <InsightCard icon="✦" label="You're drawn to" value={np.craving} color="#7C52C8" />
          <InsightCard icon="▲" label="Your strength" value={np.strength} color="#52C8B8" />
          <InsightCard icon="◎" label="Watch out for" value={np.trap} color="#F5A623" />
        </View>
      </View>

      {/* Life chapter */}
      {dc && (
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionLabel}>Right now in life</Text>
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
                <Text style={styles.timeText}>{kundliData.dasha.remaining} left in this life phase</Text>
              </View>
            </LinearGradient>
          </View>
        </View>
      )}

      {/* Deep dive CTA */}
      {onOpenFull && (
        <TouchableOpacity onPress={() => { Haptics.selectionAsync(); onOpenFull(); }} activeOpacity={0.75} style={styles.deepDiveBtn}>
          <Text style={styles.deepDiveText}>See the full picture about {name}</Text>
          <Feather name="arrow-right" size={14} color="rgba(184,85,224,0.8)" />
        </TouchableOpacity>
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
    // DB bundle first, then local
    const narrative = getKootaNarrative(k.name) ?? KOOTA_NARRATIVES[k.name];
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
            <Text style={styles.sectionLabel}>What flows between you</Text>
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
            <Text style={styles.sectionLabel}>Where it gets hard</Text>
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
        <Text style={styles.sectionLabel}>How your emotions meet</Text>
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
                ? `Both ${uMoon.element} types. You process emotions in similar ways — this creates natural understanding, but you can share the same blind spots too.`
                : `${uMoon.element} meets ${pMoon.element}. You process emotions differently. That difference can create friction, but it's often the same thing that creates the spark between you.`}
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
  const router = useRouter();
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
  if (!reading) return <KundliLoading label="Building your profile…" />;

  const tabs: { key: Tab; label: string }[] = [
    { key: "user",     label: user.name },
    { key: "partner",  label: partner.name },
    { key: "combined", label: "Together" },
  ];

  return (
    <LinearGradient colors={["#080611", "#0D0A1E"]} style={{ flex: 1 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={Platform.OS === "web" ? { maxWidth: 640, alignSelf: "center", width: "100%" } : undefined}
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + (Platform.OS === "web" ? 67 : 20), paddingBottom: insets.bottom + 100 },
        ]}
      >
        {/* Title */}
        <View style={styles.titleRow}>
          <View>
            <Text style={styles.screenTitle}>Your Stars</Text>
            <Text style={styles.screenSub}>Who you are, how you love, what connects you</Text>
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
              onPress={() => { Haptics.selectionAsync(); setActiveTab(t.key); }}
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
            onOpenFull={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push({ pathname: "/profile-detail", params: { person: activeTab } });
            }}
          />
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: 20, gap: 0 },

  titleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 },
  screenTitle: { fontSize: 32, fontFamily: "PlusJakartaSans_700Bold", color: "#F0EBF8" },
  screenSub:   { fontSize: 15, fontFamily: "PlusJakartaSans_400Regular", color: "rgba(240,235,248,0.45)", marginTop: 4 },
  starsIcon:   { width: 44, height: 44, borderRadius: 22, backgroundColor: "rgba(245,166,35,0.12)", alignItems: "center", justifyContent: "center" },
  starsText:   { fontSize: 20, color: "#F5A623" },

  tabBar:          { flexDirection: "row", backgroundColor: "rgba(26,22,48,0.8)", borderRadius: 14, padding: 4, gap: 2, marginBottom: 22 },
  tabBtn:          { flex: 1, paddingVertical: 11, borderRadius: 10, alignItems: "center" },
  tabBtnActive:    { backgroundColor: "#1E1A30" },
  tabBtnText:      { fontSize: 14, fontFamily: "PlusJakartaSans_500Medium", color: "rgba(240,235,248,0.4)" },
  tabBtnTextActive:{ color: "#F0EBF8", fontFamily: "PlusJakartaSans_600SemiBold" },

  profileContainer: { gap: 22 },
  sectionBlock:     { gap: 12 },
  sectionLabel:     { fontSize: 13, fontFamily: "PlusJakartaSans_600SemiBold", color: "rgba(240,235,248,0.55)", letterSpacing: 0 },

  // Signs row
  signsRow: { flexDirection: "row", gap: 8 },
  signPill: {
    flex: 1, borderWidth: 1, borderRadius: 16,
    padding: 14, alignItems: "center", gap: 5,
  },
  signPillIcon:  { fontSize: 20 },
  signPillName:  { fontSize: 16, fontFamily: "PlusJakartaSans_700Bold" },
  signPillLabel: { fontSize: 11, fontFamily: "PlusJakartaSans_400Regular", color: "rgba(240,235,248,0.4)", letterSpacing: 0 },

  // Cards
  card:     { borderRadius: 18, borderWidth: 1, overflow: "hidden" },
  cardGrad: { padding: 20, gap: 12 },
  cardBodyText: { fontSize: 16, fontFamily: "PlusJakartaSans_400Regular", color: "rgba(240,235,248,0.83)", lineHeight: 25 },
  divider: { height: 1, backgroundColor: "rgba(240,235,248,0.08)" },
  bulletRow: { flexDirection: "row", alignItems: "flex-start", gap: 9 },
  bulletText: { flex: 1, fontSize: 15, fontFamily: "PlusJakartaSans_400Regular", color: "rgba(240,235,248,0.7)", lineHeight: 23 },

  // Dasha / life chapter
  chapterHeadline: { fontSize: 17, fontFamily: "PlusJakartaSans_600SemiBold", color: "#F0EBF8", lineHeight: 25 },
  timeRow: { alignItems: "center" },
  timeText: { fontSize: 13, fontFamily: "PlusJakartaSans_500Medium", color: "rgba(245,166,35,0.65)" },

  // Pattern grid
  patternGrid:      { flexDirection: "row", flexWrap: "wrap", gap: 9 },
  insightCard:      { width: "47.5%", borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  insightCardGrad:  { padding: 16, gap: 8, minHeight: 100 },
  insightCardHeader:{ flexDirection: "row", alignItems: "center", gap: 7 },
  insightCardIcon:  { fontSize: 16 },
  insightCardLabel: { fontSize: 11, fontFamily: "PlusJakartaSans_600SemiBold", letterSpacing: 0 },
  insightCardValue: { fontSize: 13, fontFamily: "PlusJakartaSans_400Regular", color: "rgba(240,235,248,0.72)", lineHeight: 20 },

  // Score
  scoreCard:     { borderRadius: 22, borderWidth: 1, overflow: "hidden", marginBottom: 4 },
  scoreCardGrad: { padding: 28, alignItems: "center", gap: 10 },
  scoreBig:      { fontSize: 68, fontFamily: "PlusJakartaSans_800ExtraBold" },
  scorePct:      { fontSize: 34, fontFamily: "PlusJakartaSans_400Regular", color: "rgba(240,235,248,0.5)" },
  scoreVerdictText:{ fontSize: 20, fontFamily: "PlusJakartaSans_700Bold", color: "#F0EBF8" },
  scoreSubText:    { fontSize: 15, fontFamily: "PlusJakartaSans_400Regular", color: "rgba(240,235,248,0.55)", lineHeight: 23, textAlign: "center" },

  // Koota insights
  kootaLabel: { fontSize: 12, fontFamily: "PlusJakartaSans_600SemiBold", letterSpacing: 0 },

  // Moon dynamic
  moonDynamicRow:   { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
  moonPill:         { flex: 1, borderRadius: 14, borderWidth: 1, padding: 14, alignItems: "center", gap: 4 },
  moonPillText:     { fontSize: 14, fontFamily: "PlusJakartaSans_700Bold" },
  moonPillSign:     { fontSize: 12, fontFamily: "PlusJakartaSans_400Regular" },
  moonDynamicArrow: { fontSize: 22, color: "rgba(240,235,248,0.25)" },
  deepDiveBtn:  { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 14, borderRadius: 16, borderWidth: 1, borderColor: "rgba(184,85,224,0.2)", backgroundColor: "rgba(184,85,224,0.06)" },
  deepDiveText: { fontSize: 14, fontFamily: "PlusJakartaSans_600SemiBold", color: "rgba(184,85,224,0.8)" },
});
