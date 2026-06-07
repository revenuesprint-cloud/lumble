import { useApp } from "@/context/AppContext";
import { getAstrologyReading, RASHIS, NAKSHATRAS } from "@/utils/astrology";
import { getPersonalizedHero, getTodayBetweenYou } from "@/utils/personalization";
import { DASHA_CHAPTERS } from "@/utils/content-library";
import { getContentBundle } from "@/utils/dbContent";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
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

function Block({ label, value, accent }: { label: string; value: string; accent: string }) {
  if (!value) return null;
  return (
    <View style={blkStyles.wrap}>
      <Text style={blkStyles.label}>{label}</Text>
      <Text style={[blkStyles.value, { color: accent + "DD" }]}>{value}</Text>
    </View>
  );
}

const blkStyles = StyleSheet.create({
  wrap:  { gap: 5 },
  label: { fontSize: 11, fontFamily: "Nunito_500Medium", color: "rgba(240,235,248,0.33)" },
  value: { fontSize: 15, fontFamily: "Nunito_400Regular", lineHeight: 23 },
});

export default function ReadingDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, partner } = useApp();
  const params = useLocalSearchParams<{ headline?:string; insight?:string; action?:string; moonTag?:string }>();

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
  const accent   = "#E85C7A";

  const date = new Date().toLocaleDateString("en-US", { weekday:"long", month:"long", day:"numeric" });

  return (
    <LinearGradient colors={["#080611","#0D0A1E"]} style={{ flex:1 }}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === "web" ? 80 : 16) }]}>
        <TouchableOpacity
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.back(); }}
          activeOpacity={0.7} style={styles.backBtn}
        >
          <Feather name="arrow-left" size={20} color="rgba(240,235,248,0.7)" />
        </TouchableOpacity>
        <View style={{ flex:1 }}>
          <Text style={styles.headerTitle}>Today's read</Text>
          <Text style={styles.headerSub}>{date}</Text>
        </View>
        <View style={{ width:40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={Platform.OS === "web" ? { maxWidth:640, alignSelf:"center", width:"100%" } : undefined}
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 40 }]}
      >
        {/* Moon tag */}
        <View style={styles.moonTagWrap}>
          <View style={[styles.moonTag, { backgroundColor: uRashi.color+"18", borderColor: uRashi.color+"44" }]}>
            <Text style={[styles.moonTagText, { color: uRashi.color }]}>{uRashi.en} · {pRashi.en}</Text>
          </View>
          <Text style={styles.nakLabel}>{nak.name} nakshatra</Text>
        </View>

        {/* Main insight */}
        <View style={[styles.insightBlock, { borderColor: accent+"22" }]}>
          <LinearGradient colors={[accent+"10","transparent"]} style={styles.insightInner}>
            <Text style={styles.insightHeadline}>{hero.headline}</Text>
            <Text style={styles.insightBody}>{hero.insight}</Text>
          </LinearGradient>
        </View>

        {/* Today's action */}
        <View style={[styles.actionBlock, { borderLeftColor: "#F5A623" }]}>
          <View style={styles.actionIconRow}>
            <Feather name="sun" size={14} color="#F5A623" />
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

        {/* Life phase context */}
        {dc && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your life phase</Text>
            <View style={[styles.dashaCard, { borderColor: "rgba(245,166,35,0.2)" }]}>
              <LinearGradient colors={["rgba(245,166,35,0.08)","transparent"]} style={styles.dashaInner}>
                <Text style={styles.dashaHeadline}>{dc.headline}</Text>
                <Block label="The gift"            value={dc.gift          ?? ""} accent="#F5A623" />
                <Block label="The challenge"        value={dc.challenge     ?? ""} accent="#F5A623" />
                <Block label="What this means for love" value={dc.lessonForLove ?? ""} accent="#F5A623" />
              </LinearGradient>
            </View>
          </View>
        )}

        {/* How reading is generated */}
        <View style={styles.explainerCard}>
          <Text style={styles.explainerTitle}>How this is personalized</Text>
          <Text style={styles.explainerBody}>
            Today's read comes from four signals working together: your {uRashi.en} moon (how you feel and need), {partner.name}'s {pRashi.en} moon (how they process and give), your {nak.name} nakshatra (the specific quality of your emotional nature), and your current {reading.user.dasha.current} life phase (what's active in your life right now).{"\n\n"}The same combination of inputs always produces the same insight — but the daily seed shifts it slightly each day, so what you read today won't be identical to tomorrow. The Right Now section above is the most time-sensitive part — it reflects where each of you is at this specific moment.
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header:         { flexDirection:"row", alignItems:"flex-start", paddingHorizontal:20, paddingBottom:16, gap:12 },
  backBtn:        { width:40, height:40, borderRadius:20, backgroundColor:"rgba(240,235,248,0.06)", alignItems:"center", justifyContent:"center", marginTop:2 },
  headerTitle:    { fontSize:20, fontFamily:"Nunito_700Bold", color:"#F0EBF8" },
  headerSub:      { fontSize:13, fontFamily:"Nunito_400Regular", color:"rgba(240,235,248,0.38)", marginTop:2 },
  scroll:         { paddingHorizontal:20, gap:20 },

  moonTagWrap:    { flexDirection:"row", alignItems:"center", gap:10 },
  moonTag:        { borderRadius:20, borderWidth:1, paddingHorizontal:12, paddingVertical:5 },
  moonTagText:    { fontSize:12, fontFamily:"Nunito_600SemiBold" },
  nakLabel:       { fontSize:12, fontFamily:"Nunito_400Regular", color:"rgba(240,235,248,0.35)" },

  insightBlock:   { borderRadius:22, borderWidth:1, overflow:"hidden" },
  insightInner:   { padding:24, gap:14 },
  insightHeadline:{ fontSize:22, fontFamily:"Nunito_700Bold", color:"#F0EBF8", lineHeight:30 },
  insightBody:    { fontSize:16, fontFamily:"Nunito_400Regular", color:"rgba(240,235,248,0.85)", lineHeight:26 },

  actionBlock:    { borderLeftWidth:3, paddingLeft:16, gap:8 },
  actionIconRow:  { flexDirection:"row", alignItems:"center", gap:8 },
  actionLabel:    { fontSize:11, fontFamily:"Nunito_600SemiBold", color:"rgba(245,166,35,0.7)" },
  actionText:     { fontSize:15, fontFamily:"Nunito_600SemiBold", color:"#F5A623", lineHeight:23 },

  section:        { gap:12 },
  sectionTitle:   { fontSize:13, fontFamily:"Nunito_600SemiBold", color:"rgba(240,235,248,0.45)" },

  rnCard:         { backgroundColor:"#0C0A18", borderRadius:18, borderWidth:1, borderColor:"rgba(240,235,248,0.07)", padding:18, gap:14 },
  rnRow:          { gap:5 },
  rnName:         { fontSize:11, fontFamily:"Nunito_600SemiBold", color:"rgba(240,235,248,0.35)" },
  rnBody:         { fontSize:15, fontFamily:"Nunito_400Regular", color:"rgba(240,235,248,0.82)", lineHeight:23 },
  rnDivider:      { height:1, backgroundColor:"rgba(240,235,248,0.06)" },

  dashaCard:      { borderRadius:18, borderWidth:1, overflow:"hidden" },
  dashaInner:     { padding:18, gap:14 },
  dashaHeadline:  { fontSize:16, fontFamily:"Nunito_600SemiBold", color:"#F0EBF8", lineHeight:24 },

  explainerCard:  { backgroundColor:"rgba(240,235,248,0.03)", borderRadius:16, borderWidth:1, borderColor:"rgba(240,235,248,0.06)", padding:18, gap:8 },
  explainerTitle: { fontSize:12, fontFamily:"Nunito_600SemiBold", color:"rgba(240,235,248,0.35)" },
  explainerBody:  { fontSize:13, fontFamily:"Nunito_400Regular", color:"rgba(240,235,248,0.45)", lineHeight:21 },
});
