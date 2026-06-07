import { useApp } from "@/context/AppContext";
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

function Section({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) {
  return (
    <View style={secStyles.section}>
      <View style={[secStyles.titleRow, { borderLeftColor: accent }]}>
        <Text style={secStyles.title}>{title}</Text>
      </View>
      <View style={secStyles.content}>{children}</View>
    </View>
  );
}

const secStyles = StyleSheet.create({
  section:  { gap: 14 },
  titleRow: { borderLeftWidth: 3, paddingLeft: 12 },
  title:    { fontSize: 13, fontFamily: "Nunito_600SemiBold", color: "#9CA3AF" },
  content:  { gap: 14, paddingLeft: 4 },
});

function DataRow({ label, value, accent }: { label: string; value: string; accent: string }) {
  if (!value) return null;
  return (
    <View style={drStyles.row}>
      <Text style={drStyles.label}>{label}</Text>
      <Text style={[drStyles.value, { color: accent }]}>{value}</Text>
    </View>
  );
}

const drStyles = StyleSheet.create({
  row:   { gap: 4 },
  label: { fontSize: 11, fontFamily: "Nunito_500Medium", color: "#9CA3AF" },
  value: { fontSize: 15, fontFamily: "Nunito_400Regular", lineHeight: 23, color: "#374151" },
});

function QuoteBlock({ text, accent }: { text: string; accent: string }) {
  if (!text) return null;
  return (
    <View style={[qbStyles.wrap, { borderColor: accent + "30", backgroundColor: accent + "08" }]}>
      <Text style={qbStyles.text}>"{text}"</Text>
    </View>
  );
}

const qbStyles = StyleSheet.create({
  wrap: { borderRadius: 14, borderWidth: 1, padding: 16 },
  text: { fontSize: 15, fontFamily: "Nunito_400Regular", color: "#374151", lineHeight: 24, fontStyle: "italic" },
});

export default function ProfileDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { person } = useLocalSearchParams<{ person: string }>();
  const { user, partner } = useApp();

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
    <View style={{ flex: 1, backgroundColor: "#F4F5F7" }}>
      <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === "web" ? 80 : 16) }]}>
        <TouchableOpacity
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.back(); }}
          activeOpacity={0.7}
          style={styles.backBtn}
        >
          <Feather name="arrow-left" size={20} color="#6B7280" />
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
                  <Text style={[styles.signVal,  { color: s.color }]}>{s.val}</Text>
                  <Text style={styles.signLabel}>{s.label}</Text>
                </View>
              ))}
            </View>
            <View style={styles.nakRow}>
              <View style={[styles.nakChip, { backgroundColor: accent + "12", borderColor: accent + "30" }]}>
                <Text style={[styles.nakText, { color: accent }]}>{nak.name} nakshatra</Text>
              </View>
              {!isPartner && (
                <View style={[styles.nakChip, { backgroundColor: "#FFFBEB", borderColor: "#FDE68A" }]}>
                  <Text style={[styles.nakText, { color: "#D97706" }]}>{kundliData.dasha.current} dasha</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        <Section title={`How ${name} loves`} accent={accent}>
          <QuoteBlock text={mp.insight ?? ""} accent={accent} />
          <DataRow label="What hurt them most"    value={mp.coreWound   ?? ""} accent={accent} />
          <DataRow label="What they're scared of" value={mp.fear        ?? ""} accent={accent} />
          <DataRow label="What they need to hear" value={mp.needsToHear ?? ""} accent={accent} />
        </Section>

        <Section title={`${name}'s love pattern — ${nak.name} nakshatra`} accent={accent}>
          <DataRow label="What they do in love"             value={np.pattern  ?? ""} accent={accent} />
          <DataRow label="What they're actually chasing"    value={np.craving  ?? ""} accent={accent} />
          <DataRow label="Their real strength"              value={np.strength ?? ""} accent={accent} />
          <DataRow label="Where they get stuck"             value={np.trap     ?? ""} accent={accent} />
          <DataRow label="What they won't admit"            value={np.shadow   ?? ""} accent={accent} />
        </Section>

        <Section title="Things they don't see" accent={accent}>
          <DataRow label="What they can't see about themselves" value={mp.blindspot      ?? ""} accent={accent} />
          <DataRow label="What they keep overlooking"          value={mp.redFlag        ?? ""} accent={accent} />
          <DataRow label="How they act in relationships"       value={mp.attachment     ?? ""} accent={accent} />
          <DataRow label="What makes them want to leave"       value={mp.dealbreaker    ?? ""} accent={accent} />
          <DataRow label="What makes them feel most insecure"  value={mp.insecurityHook ?? ""} accent={accent} />
        </Section>

        {!isPartner && dc && (
          <Section title={`Right now — ${kundliData.dasha.current} dasha`} accent="#F59E0B">
            <QuoteBlock text={dc.headline ?? ""} accent="#F59E0B" />
            <DataRow label="How this affects your relationship" value={dc.relationshipEffect ?? ""} accent="#D97706" />
            <DataRow label="The gift of this period"            value={dc.gift              ?? ""} accent="#D97706" />
            <DataRow label="The challenge"                      value={dc.challenge         ?? ""} accent="#D97706" />
            <DataRow label="What to watch out for"             value={dc.warning           ?? ""} accent="#D97706" />
            <DataRow label="What this means for love"          value={dc.lessonForLove     ?? ""} accent="#D97706" />
          </Section>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header:          { flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingBottom: 16, gap: 12, backgroundColor: "#F4F5F7" },
  backBtn:         { width: 40, height: 40, borderRadius: 20, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E5E7EB", alignItems: "center", justifyContent: "center" },
  headerTitle:     { flex: 1, fontSize: 20, fontFamily: "Nunito_700Bold", color: "#111827", textAlign: "center" },
  headerSpacer:    { width: 40 },
  scroll:          { paddingHorizontal: 20, gap: 24 },

  moonHero:        { borderRadius: 20, borderWidth: 1, backgroundColor: "#FFFFFF", flexDirection: "row", overflow: "hidden",
                     shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 2 },
  moonHeroAccent:  { width: 4 },
  moonHeroContent: { flex: 1, padding: 20, gap: 14 },
  signsRow:        { flexDirection: "row", gap: 8 },
  signPill:        { flex: 1, borderRadius: 14, borderWidth: 1, padding: 12, alignItems: "center", gap: 4 },
  signIcon:        { fontSize: 18 },
  signVal:         { fontSize: 14, fontFamily: "Nunito_700Bold" },
  signLabel:       { fontSize: 10, fontFamily: "Nunito_400Regular", color: "#9CA3AF" },
  nakRow:          { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  nakChip:         { borderRadius: 20, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 5 },
  nakText:         { fontSize: 12, fontFamily: "Nunito_500Medium" },
});
