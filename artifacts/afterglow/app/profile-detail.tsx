import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import { getAstrologyReading, RASHIS, NAKSHATRAS } from "@/utils/astrology";
import {
  MOON_PROFILES_DEEP,
  NAKSHATRA_PROFILES,
  DASHA_CHAPTERS,
} from "@/utils/content-library";
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

function resolveMoonProfile(rashiIdx: number) {
  const b = getContentBundle();
  if (b?.moonProfiles?.length) {
    const it = b.moonProfiles.find((i) => (i.meta as any)?.moonRashiIdx === rashiIdx);
    if (it) return it.meta as any;
  }
  return MOON_PROFILES_DEEP[rashiIdx] ?? MOON_PROFILES_DEEP[0];
}

function resolveNakProfile(nakIdx: number) {
  const b = getContentBundle();
  if (b?.nakshatraProfiles?.length) {
    const it = b.nakshatraProfiles.find((i) => (i.meta as any)?.nakshatraIdx === nakIdx);
    if (it) return it.meta as any;
  }
  return NAKSHATRA_PROFILES[nakIdx] ?? NAKSHATRA_PROFILES[0];
}

function resolveDasha(lord: string) {
  const b = getContentBundle();
  if (b?.dashaChapters?.length) {
    const it = b.dashaChapters.find((i) => (i.meta as any)?.dashaLord === lord);
    if (it) return it.meta as any;
  }
  return DASHA_CHAPTERS[lord];
}

function Section({ title, accent, children, c }: { title: string; accent: string; children: React.ReactNode; c: ReturnType<typeof useColors> }) {
  const secStylesMemo = useMemo(() => createSecStyles(c), [c]);
  return (
    <View style={secStylesMemo.section}>
      <View style={[secStylesMemo.titleRow, { borderLeftColor: accent }]}>
        <Text style={secStylesMemo.title}>{title}</Text>
      </View>
      <View style={secStylesMemo.content}>{children}</View>
    </View>
  );
}

function createSecStyles(c: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    section:  { gap: 14 },
    titleRow: { borderLeftWidth: 3, paddingLeft: 12 },
    title:    { fontSize: 11, fontFamily: "PlusJakartaSans_700Bold", color: c.textFaint, textTransform: "uppercase", letterSpacing: 1.2 },
    content:  { gap: 14, paddingLeft: 4 },
  });
}

function DataRow({ label, value, accent, c }: { label: string; value: string; accent: string; c: ReturnType<typeof useColors> }) {
  const drStylesMemo = useMemo(() => createDrStyles(c), [c]);
  if (!value) return null;
  return (
    <View style={drStylesMemo.row}>
      <Text style={drStylesMemo.label}>{label}</Text>
      <Text style={[drStylesMemo.value, { color: accent }]}>{value}</Text>
    </View>
  );
}

function createDrStyles(c: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    row:   { gap: 4 },
    label: { fontSize: 11, fontFamily: "PlusJakartaSans_500Medium", color: c.textFaint },
    value: { fontSize: 15, fontFamily: "PlusJakartaSans_400Regular", lineHeight: 23, color: c.textBody },
  });
}

function QuoteBlock({ text, accent, c }: { text: string; accent: string; c: ReturnType<typeof useColors> }) {
  const qbStylesMemo = useMemo(() => createQbStyles(c), [c]);
  if (!text) return null;
  return (
    <View style={[qbStylesMemo.wrap, { borderColor: accent + "30", backgroundColor: accent + "08" }]}>
      <Text style={qbStylesMemo.text}>"{text}"</Text>
    </View>
  );
}

function createQbStyles(c: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    wrap: { borderRadius: 14, borderWidth: 1, padding: 16 },
    text: { fontSize: 15, fontFamily: "PlusJakartaSans_400Regular", color: c.textBody, lineHeight: 24, fontStyle: "italic" },
  });
}

export default function ProfileDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { person } = useLocalSearchParams<{ person: string }>();
  const { user, partner } = useApp();
  const c = useColors();
  const styles = useMemo(() => createStyles(c), [c]);

  const reading = useMemo(() => {
    if (!user || !partner) return null;
    return getAstrologyReading(user.name, user.birthDate, partner.name, partner.birthDate, user.birthTime);
  }, [user?.birthDate, user?.name, user?.birthTime, partner?.birthDate, partner?.name]);

  if (!user || !partner || !reading) return null;

  const isPartner  = person === "partner";
  const name       = isPartner ? partner.name : user.name;
  const kundliData = isPartner ? reading.partner : reading.user;

  const rashi      = RASHIS[kundliData.moonRashi];
  const sunRashi   = RASHIS[kundliData.sunRashi];
  const lagnaRashi = RASHIS[kundliData.lagnaRashi];
  const nak        = NAKSHATRAS[kundliData.nakshatra];
  const mp         = resolveMoonProfile(kundliData.moonRashi);
  const np         = resolveNakProfile(kundliData.nakshatra);
  const dc         = !isPartner ? resolveDasha(kundliData.dasha.current) : null;

  const accent = rashi.color;

  return (
    <View style={{ flex: 1, backgroundColor: c.background }}>
      <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === "web" ? 80 : 16) }]}>
        <TouchableOpacity
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.back(); }}
          activeOpacity={0.7}
          style={styles.backBtn}
        >
          <Feather name="arrow-left" size={20} color={c.textMuted} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{name}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={Platform.OS === "web" ? { maxWidth: 640, alignSelf: "center", width: "100%" } : undefined}
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 40 }]}
      >
        {/* Moon hero */}
        <View style={[styles.moonHero, { borderColor: accent + "30" }]}>
          <View style={[styles.moonHeroAccent, { backgroundColor: accent }]} />
          <View style={styles.moonHeroContent}>
            <View style={styles.signsRow}>
              {[
                { icon: "☉", label: "Sun",    val: sunRashi.en,   color: sunRashi.color },
                { icon: "☽", label: "Moon",   val: rashi.en,      color: accent },
                { icon: "↑", label: "Rising", val: lagnaRashi.en, color: lagnaRashi.color },
              ].map((s) => (
                <View key={s.label} style={[styles.signPill, { borderColor: s.color + "40", backgroundColor: s.color + "10" }]}>
                  <Text style={[styles.signIcon, { color: s.color }]}>{s.icon}</Text>
                  <Text style={[styles.signVal,  { color: s.color }]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>{s.val}</Text>
                  <Text style={styles.signLabel}>{s.label}</Text>
                </View>
              ))}
            </View>
            <View style={styles.nakRow}>
              <View style={[styles.nakChip, { backgroundColor: accent + "12", borderColor: accent + "30" }]}>
                <Text style={[styles.nakText, { color: accent }]}>{nak.name} nakshatra</Text>
              </View>
              {!isPartner && (
                <View style={[styles.nakChip, { backgroundColor: c.goldLight, borderColor: c.goldBorder }]}>
                  <Text style={[styles.nakText, { color: "#D97706" }]}>{kundliData.dasha.current} dasha</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        <Section title={`How ${name} loves`} accent={accent} c={c}>
          <QuoteBlock text={mp.insight ?? ""} accent={accent} c={c} />
          <DataRow label="What hurt them most"    value={mp.coreWound   ?? ""} accent={accent} c={c} />
          <DataRow label="What they're scared of" value={mp.fear        ?? ""} accent={accent} c={c} />
          <DataRow label="What they need to hear" value={mp.needsToHear ?? ""} accent={accent} c={c} />
        </Section>

        <Section title={`${name}'s love pattern — ${nak.name} nakshatra`} accent={accent} c={c}>
          <DataRow label="What they do in love"             value={np.pattern  ?? ""} accent={accent} c={c} />
          <DataRow label="What they're actually chasing"    value={np.craving  ?? ""} accent={accent} c={c} />
          <DataRow label="Their real strength"              value={np.strength ?? ""} accent={accent} c={c} />
          <DataRow label="Where they get stuck"             value={np.trap     ?? ""} accent={accent} c={c} />
          <DataRow label="What they won't admit"            value={np.shadow   ?? ""} accent={accent} c={c} />
        </Section>

        <Section title="Things they don't see" accent={accent} c={c}>
          <DataRow label="What they can't see about themselves" value={mp.blindspot      ?? ""} accent={accent} c={c} />
          <DataRow label="What they keep overlooking"          value={mp.redFlag        ?? ""} accent={accent} c={c} />
          <DataRow label="How they act in relationships"       value={mp.attachment     ?? ""} accent={accent} c={c} />
          <DataRow label="What makes them want to leave"       value={mp.dealbreaker    ?? ""} accent={accent} c={c} />
          <DataRow label="What makes them feel most insecure"  value={mp.insecurityHook ?? ""} accent={accent} c={c} />
        </Section>

        {!isPartner && dc && (
          <Section title={`Right now — ${kundliData.dasha.current} dasha`} accent="#F59E0B" c={c}>
            <QuoteBlock text={dc.headline ?? ""} accent="#F59E0B" c={c} />
            <DataRow label="How this affects your relationship" value={dc.relationshipEffect ?? ""} accent="#D97706" c={c} />
            <DataRow label="The gift of this period"            value={dc.gift              ?? ""} accent="#D97706" c={c} />
            <DataRow label="The challenge"                      value={dc.challenge         ?? ""} accent="#D97706" c={c} />
            <DataRow label="What to watch out for"             value={dc.warning           ?? ""} accent="#D97706" c={c} />
            <DataRow label="What this means for love"          value={dc.lessonForLove     ?? ""} accent="#D97706" c={c} />
          </Section>
        )}
      </ScrollView>
    </View>
  );
}

function createStyles(c: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    header:          { flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingBottom: 16, gap: 12, backgroundColor: c.background },
    backBtn:         { width: 40, height: 40, borderRadius: 14, backgroundColor: c.card, borderWidth: 1, borderColor: c.border, alignItems: "center", justifyContent: "center" },
    headerTitle:     { flex: 1, fontSize: 20, fontFamily: "PlusJakartaSans_700Bold", color: c.text, textAlign: "center" },
    headerSpacer:    { width: 40 },
    scroll:          { paddingHorizontal: 20, gap: 24 },

    moonHero:        { borderRadius: 20, borderWidth: 1, backgroundColor: c.card, flexDirection: "row", overflow: "hidden",
                       shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 2 },
    moonHeroAccent:  { width: 4 },
    moonHeroContent: { flex: 1, padding: 20, gap: 14 },
    signsRow:        { flexDirection: "row", gap: 8 },
    signPill:        { flex: 1, borderRadius: 14, borderWidth: 1, padding: 12, alignItems: "center", gap: 4 },
    signIcon:        { fontSize: 18 },
    signVal:         { fontSize: 14, fontFamily: "PlusJakartaSans_700Bold" },
    signLabel:       { fontSize: 10, fontFamily: "PlusJakartaSans_400Regular", color: c.textFaint },
    nakRow:          { flexDirection: "row", gap: 8, flexWrap: "wrap" },
    nakChip:         { borderRadius: 20, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 5 },
    nakText:         { fontSize: 12, fontFamily: "PlusJakartaSans_500Medium" },
  });
}
