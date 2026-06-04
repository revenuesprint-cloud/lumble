import { useApp } from "@/context/AppContext";
import {
  getAstrologyReading,
  KundliData,
  NAKSHATRAS,
  PLANETS_META,
  RASHIS,
} from "@/utils/astrology";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
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

type Tab = "user" | "partner" | "combined";

// ─── Kundli Chart (North Indian style grid) ──────────────────────────────────

function KundliGrid({ kundli }: { kundli: KundliData }) {
  const lagna = kundli.lagnaRashi;

  // Build house (0-indexed from lagna) → planets mapping
  const housePlanets: Record<number, string[]> = {};
  for (let h = 0; h < 12; h++) housePlanets[h] = [];
  for (const [planet, data] of Object.entries(kundli.planets)) {
    const house = (data.rashi - lagna + 12) % 12;
    housePlanets[house].push(planet);
  }

  const rashiInHouse = (house: number) => RASHIS[(lagna + house) % 12];

  const HouseCell = ({ house, style }: { house: number; style?: object }) => {
    const rashi   = rashiInHouse(house);
    const planets = housePlanets[house] || [];
    return (
      <View style={[styles.gridCell, style]}>
        <Text style={[styles.houseNum, { color: rashi.color + "99" }]}>{house + 1}</Text>
        <Text style={styles.gridRashi}>{rashi.symbol}</Text>
        {planets.slice(0, 3).map((p) => (
          <Text key={p} style={[styles.gridPlanet, { color: PLANETS_META[p]?.color || "#F0EBF8" }]}>
            {PLANETS_META[p]?.symbol || p.slice(0, 2)}
          </Text>
        ))}
      </View>
    );
  };

  const S = 72; // cell size

  // Standard North Indian 4×4 grid:
  //   (0,0)=H12  (0,1)=H1   (0,2)=H2   (0,3)=H3
  //   (1,0)=H11  [ CENTER 2×2 ]          (1,3)=H4
  //   (2,0)=H10  [ CENTER 2×2 ]          (2,3)=H5
  //   (3,0)=H9   (3,1)=H8   (3,2)=H7   (3,3)=H6
  // Houses are 0-indexed from lagna (house 0 = 1st house).
  const cells: { h: number; row: number; col: number }[] = [
    { h: 11, row: 0, col: 0 }, { h: 0, row: 0, col: 1 }, { h: 1, row: 0, col: 2 }, { h: 2, row: 0, col: 3 },
    { h: 10, row: 1, col: 0 },                                                        { h: 3, row: 1, col: 3 },
    { h: 9,  row: 2, col: 0 },                                                        { h: 4, row: 2, col: 3 },
    { h: 8,  row: 3, col: 0 }, { h: 7, row: 3, col: 1 }, { h: 6, row: 3, col: 2 }, { h: 5, row: 3, col: 3 },
  ];

  return (
    <View style={[styles.gridContainer, { width: S * 4, height: S * 4 }]}>
      {cells.map(({ h, row, col }) => (
        <HouseCell
          key={`h${h}`}
          house={h}
          style={{ position: "absolute", top: row * S, left: col * S, width: S, height: S }}
        />
      ))}

      {/* Center block (rows 1-2, cols 1-2) */}
      <View style={[styles.gridCenter, {
        position: "absolute",
        top: S, left: S,
        width: S * 2, height: S * 2,
      }]}>
        <Text style={styles.gridCenterText}>Lagna</Text>
        <Text style={[styles.gridCenterRashi, { color: RASHIS[lagna].color }]}>
          {RASHIS[lagna].symbol}
        </Text>
        <Text style={styles.gridCenterName}>{RASHIS[lagna].name}</Text>
      </View>
    </View>
  );
}

// ─── Planet row ───────────────────────────────────────────────────────────────

function PlanetRow({ planetKey, data, delay }: {
  planetKey: string;
  data: { rashi: number; degrees: number; retrograde: boolean };
  delay: number;
}) {
  const meta = PLANETS_META[planetKey];
  const rashi = RASHIS[data.rashi];
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 300, delay, useNativeDriver: true }).start();
  }, []);

  return (
    <Animated.View style={[styles.planetRow, { opacity: fadeAnim }]}>
      <View style={[styles.planetSymbol, { backgroundColor: (meta?.color || "#F0EBF8") + "18" }]}>
        <Text style={[styles.planetSymbolText, { color: meta?.color || "#F0EBF8" }]}>
          {meta?.symbol || "?"}
        </Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.planetName}>{meta?.name || planetKey} <Text style={styles.planetEn}>({meta?.en})</Text></Text>
        <Text style={styles.planetRashi}>
          {rashi.symbol} {rashi.name} · {data.degrees.toFixed(1)}°
          {data.retrograde ? " ℞" : ""}
        </Text>
      </View>
      <View style={[styles.rashiTag, { borderColor: rashi.color + "44", backgroundColor: rashi.color + "12" }]}>
        <Text style={[styles.rashiTagText, { color: rashi.color }]}>{rashi.en}</Text>
      </View>
    </Animated.View>
  );
}

// ─── Guna Milan score bar ─────────────────────────────────────────────────────

function GunaBar({ score, max, delay }: { score: number; max: number; delay: number }) {
  const widthAnim = useRef(new Animated.Value(0)).current;
  const pct = score / max;
  const color = pct >= 0.7 ? "#52C8B8" : pct >= 0.4 ? "#F5A623" : "#E85C7A";

  useEffect(() => {
    Animated.timing(widthAnim, { toValue: pct * 100, duration: 700, delay, useNativeDriver: false }).start();
  }, []);

  return (
    <View style={styles.gunaTrack}>
      <Animated.View style={{
        width: widthAnim.interpolate({ inputRange: [0, 100], outputRange: ["0%", "100%"] }),
        height: "100%",
        backgroundColor: color,
        borderRadius: 3,
      }} />
    </View>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function AstrologyScreen() {
  const insets = useSafeAreaInsets();
  const { user, partner } = useApp();
  const [activeTab, setActiveTab] = useState<Tab>("user");
  const [showGrid, setShowGrid] = useState(false);

  const reading = useMemo(() => {
    if (!user || !partner) return null;
    return getAstrologyReading(
      user.name, user.birthDate,
      partner.name, partner.birthDate,
      user.birthTime,
    );
  }, [user?.birthDate, user?.name, user?.birthTime, partner?.birthDate, partner?.name]);

  if (!user || !partner) return null;
  if (!reading) return <KundliLoading label="Calculating your birth chart…" />;

  const sameDates = user.birthDate.slice(0, 10) === partner.birthDate.slice(0, 10);
  const kundli = activeTab === "user" ? reading.user : reading.partner;
  const displayName = activeTab === "user" ? user.name : partner.name;

  const nakshatra = NAKSHATRAS[kundli.nakshatra];
  const sunRashi = RASHIS[kundli.sunRashi];
  const moonRashi = RASHIS[kundli.moonRashi];
  const lagnaRashi = RASHIS[kundli.lagnaRashi];

  const PLANET_ORDER = ["Surya","Chandra","Mangal","Budh","Brihaspati","Shukra","Shani","Rahu","Ketu"];

  const tabs: { key: Tab; label: string }[] = [
    { key: "user", label: user.name },
    { key: "partner", label: partner.name },
    { key: "combined", label: "Compatibility" },
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
        {/* Screen title */}
        <View style={styles.titleRow}>
          <View>
            <Text style={styles.screenTitle}>Kundli</Text>
            <Text style={styles.screenSub}>Vedic birth chart analysis</Text>
          </View>
          <View style={styles.starsIcon}>
            <Text style={styles.starsText}>✦</Text>
          </View>
        </View>

        {/* Tab selector */}
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

        {sameDates && (
          <View style={styles.sameDateBanner}>
            <Feather name="alert-circle" size={14} color="#F5A623" />
            <Text style={styles.sameDateText}>
              Both birth dates are the same — go to Profile → Edit Connection to fix them.
            </Text>
          </View>
        )}

        {activeTab !== "combined" ? (
          <>
            {/* Core trinity */}
            <View style={styles.trinityRow}>
              <TrinityCard label="Lagna" sub="Rising Sign" rashi={lagnaRashi} icon="↑" />
              <TrinityCard label="Rashi" sub="Moon Sign" rashi={moonRashi} icon="☽" />
              <TrinityCard label="Surya" sub="Sun Sign" rashi={sunRashi} icon="☉" />
            </View>

            {/* Nakshatra */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Janma Nakshatra</Text>
                <Text style={styles.cardBadge}>Birth Star</Text>
              </View>
              <View style={styles.nakshatraMain}>
                <View style={styles.nakshatraCircle}>
                  <Text style={styles.nakshatraCircleText}>{kundli.nakshatraPada}</Text>
                  <Text style={styles.nakshatraCircleSub}>Pada</Text>
                </View>
                <View style={{ flex: 1, gap: 4 }}>
                  <Text style={styles.nakshatraName}>{nakshatra.name}</Text>
                  <Text style={styles.nakshatraLord}>Lord: <Text style={{ color: "#E85C7A" }}>{nakshatra.lord}</Text></Text>
                  <Text style={styles.nakshatraDiety}>Deity: {nakshatra.deity}</Text>
                  <Text style={styles.nakshatraSymbol}>Symbol: {nakshatra.symbol}</Text>
                </View>
              </View>
              <View style={styles.nakshatraTagRow}>
                <View style={styles.nakshatraTag}>
                  <Text style={styles.nakshatraTagText}>{nakshatra.gana} Gana</Text>
                </View>
                <View style={styles.nakshatraTag}>
                  <Text style={styles.nakshatraTagText}>{nakshatra.yoni} Yoni</Text>
                </View>
                <View style={styles.nakshatraTag}>
                  <Text style={styles.nakshatraTagText}>{kundli.nakshatraDeg.toFixed(1)}° in Nak.</Text>
                </View>
              </View>
            </View>

            {/* Vimshottari Dasha */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Vimshottari Dasha</Text>
                <Text style={styles.cardBadge}>Current Period</Text>
              </View>
              <View style={styles.dashaRow}>
                <View style={styles.dashaMahaCard}>
                  <Text style={styles.dashaLabel}>Maha Dasha</Text>
                  <Text style={[styles.dashaLord, { color: PLANETS_META[kundli.dasha.current]?.color || "#E85C7A" }]}>
                    {PLANETS_META[kundli.dasha.current]?.symbol} {kundli.dasha.current}
                  </Text>
                  <Text style={styles.dashaYears}>{kundli.dasha.years} years total</Text>
                </View>
                <View style={styles.dashaSep} />
                <View style={styles.dashaAntarCard}>
                  <Text style={styles.dashaLabel}>Antar Dasha</Text>
                  <Text style={[styles.dashaLord, { color: PLANETS_META[kundli.dasha.antardasha]?.color || "#B855E0" }]}>
                    {PLANETS_META[kundli.dasha.antardasha]?.symbol} {kundli.dasha.antardasha}
                  </Text>
                </View>
              </View>
              <View style={styles.dashaTimeRow}>
                <View style={styles.dashaTimeItem}>
                  <Text style={styles.dashaTimeLabel}>Elapsed</Text>
                  <Text style={styles.dashaTimeValue}>{kundli.dasha.elapsed}</Text>
                </View>
                <View style={[styles.dashaTimeItem, { alignItems: "flex-end" }]}>
                  <Text style={styles.dashaTimeLabel}>Remaining</Text>
                  <Text style={[styles.dashaTimeValue, { color: "#52C8B8" }]}>{kundli.dasha.remaining}</Text>
                </View>
              </View>
            </View>

            {/* Kundli grid toggle */}
            <TouchableOpacity
              onPress={() => setShowGrid(!showGrid)}
              style={styles.gridToggle}
              activeOpacity={0.8}
            >
              <Text style={styles.gridToggleText}>
                {showGrid ? "Hide" : "Show"} Birth Chart Grid
              </Text>
              <Feather name={showGrid ? "chevron-up" : "chevron-down"} size={16} color="rgba(240,235,248,0.4)" />
            </TouchableOpacity>

            {showGrid && (
              <View style={styles.gridWrapper}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <KundliGrid kundli={kundli} />
                </ScrollView>
              </View>
            )}

            {/* Planet positions */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Graha Positions</Text>
                <Text style={styles.cardBadge}>All 9 Planets</Text>
              </View>
              <View style={styles.planetList}>
                {PLANET_ORDER.map((p, i) => {
                  const data = kundli.planets[p];
                  if (!data) return null;
                  return <PlanetRow key={p} planetKey={p} data={data} delay={i * 50} />;
                })}
              </View>
            </View>

            {/* Key observations */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Key Observations</Text>
                <Text style={styles.cardBadge}>For {displayName}</Text>
              </View>
              <View style={styles.observationList}>
                {[
                  `Lagna in ${lagnaRashi.name} gives ${lagnaRashi.element} qualities — ${lagnaRashi.quality} in nature, ruled by ${lagnaRashi.lord}.`,
                  `Moon in ${moonRashi.name} shapes emotional nature. ${moonRashi.element} sign ruled by ${moonRashi.lord}.`,
                  `Janma nakshatra ${nakshatra.name} (${nakshatra.deity}) — ${nakshatra.gana} Gana with ${nakshatra.yoni} Yoni.`,
                  `Currently under ${kundli.dasha.current} Maha Dasha with ${kundli.dasha.antardasha} sub-period. ${kundli.dasha.remaining} remaining in this cycle.`,
                ].map((obs, i) => (
                  <View key={i} style={styles.observationRow}>
                    <Text style={styles.obsDot}>✦</Text>
                    <Text style={styles.obsText}>{obs}</Text>
                  </View>
                ))}
              </View>
            </View>
          </>
        ) : (
          /* ─── Combined / Guna Milan view ─── */
          <>
            {/* Score card */}
            <View style={styles.gunaScoreCard}>
              <LinearGradient
                colors={
                  reading.guna.total >= 28
                    ? ["rgba(82,200,184,0.2)", "rgba(82,200,184,0.05)"]
                    : reading.guna.total >= 18
                    ? ["rgba(245,166,35,0.2)", "rgba(245,166,35,0.05)"]
                    : ["rgba(232,92,122,0.2)", "rgba(232,92,122,0.05)"]
                }
                style={styles.gunaScoreInner}
              >
                <Text style={styles.gunaScoreNum}>
                  {reading.guna.total}
                  <Text style={styles.gunaScoreMax}>/36</Text>
                </Text>
                <Text style={styles.gunaScoreLabel}>Guna Milan Score</Text>
                <Text style={styles.gunaScoreVerdict}>{
                  reading.guna.total >= 28 ? "Excellent Match" :
                  reading.guna.total >= 21 ? "Good Match" :
                  reading.guna.total >= 18 ? "Average Match" : "Needs Attention"
                }</Text>
              </LinearGradient>
            </View>

            {/* Compatibility text */}
            <View style={styles.card}>
              <Text style={styles.compatibilityText}>{reading.compatibility}</Text>
            </View>

            {/* Doshas */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Dosha Analysis</Text>
              </View>
              <View style={styles.doshaRow}>
                <DoeshaItem
                  label="Nadi Dosha"
                  present={reading.guna.nadiDosha}
                  desc={reading.guna.nadiDosha ? "Same nadi — health concerns possible" : "Different nadi — no nadi dosha"}
                />
                <DoeshaItem
                  label="Mangal Dosha"
                  present={reading.guna.mangalDosha}
                  desc={reading.guna.mangalDosha ? "One chart has Mangal dosha" : "No Mangal dosha detected"}
                />
                <DoeshaItem
                  label="Bhakoot Dosha"
                  present={reading.guna.breakdown[6].score === 0}
                  desc={reading.guna.breakdown[6].score === 0 ? "6-8 rashi distance — requires attention" : "Bhakoot is favorable"}
                />
              </View>
            </View>

            {/* Ashtakoot breakdown */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Ashtakoot Breakdown</Text>
                <Text style={styles.cardBadge}>8 Factors</Text>
              </View>
              <View style={styles.kootaList}>
                {reading.guna.breakdown.map((k, i) => (
                  <View key={k.name} style={styles.kootaRow}>
                    <View style={styles.kootaLeft}>
                      <Text style={styles.kootaName}>{k.name}</Text>
                      <Text style={styles.kootaDesc}>{k.description}</Text>
                    </View>
                    <View style={styles.kootaRight}>
                      <Text style={[styles.kootaScore, {
                        color: k.score >= k.max * 0.7 ? "#52C8B8" : k.score > 0 ? "#F5A623" : "#E85C7A"
                      }]}>
                        {k.score}/{k.max}
                      </Text>
                      <GunaBar score={k.score} max={k.max} delay={i * 60} />
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* Nakshatra comparison */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Nakshatra Comparison</Text>
              </View>
              {[
                { label: user.name, kundli: reading.user },
                { label: partner.name, kundli: reading.partner },
              ].map(({ label, kundli: k }) => {
                const nak = NAKSHATRAS[k.nakshatra];
                return (
                  <View key={label} style={styles.nakCompRow}>
                    <View style={styles.nakCompAvatar}>
                      <Text style={styles.nakCompInitial}>{label[0]}</Text>
                    </View>
                    <View style={{ flex: 1, gap: 2 }}>
                      <Text style={styles.nakCompName}>{label}</Text>
                      <Text style={styles.nakCompNak}>{nak.name} · Pada {k.nakshatraPada} · {nak.lord}</Text>
                      <View style={styles.nakCompTags}>
                        <View style={styles.nakCompTag}><Text style={styles.nakCompTagText}>{nak.gana}</Text></View>
                        <View style={styles.nakCompTag}><Text style={styles.nakCompTagText}>{nak.yoni} Yoni</Text></View>
                        <View style={styles.nakCompTag}><Text style={styles.nakCompTagText}>{RASHIS[k.moonRashi].name} Moon</Text></View>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          </>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

function TrinityCard({ label, sub, rashi, icon }: { label: string; sub: string; rashi: (typeof RASHIS)[0]; icon: string }) {
  return (
    <View style={[styles.trinityCard, { borderColor: rashi.color + "33" }]}>
      <LinearGradient colors={[rashi.color + "18", "transparent"]} style={styles.trinityGrad}>
        <Text style={[styles.trinityIcon, { color: rashi.color }]}>{icon}</Text>
        <Text style={[styles.trinitySymbol, { color: rashi.color }]}>{rashi.symbol}</Text>
        <Text style={styles.trinityName}>{rashi.name}</Text>
        <Text style={styles.trinityLabel}>{label}</Text>
        <Text style={styles.trinitySub}>{sub}</Text>
      </LinearGradient>
    </View>
  );
}

function DoeshaItem({ label, present, desc }: { label: string; present: boolean; desc: string }) {
  return (
    <View style={[styles.doshaItem, { borderColor: present ? "rgba(232,92,122,0.3)" : "rgba(82,200,184,0.3)" }]}>
      <Text style={[styles.doshaIndicator, { color: present ? "#E85C7A" : "#52C8B8" }]}>
        {present ? "●" : "○"}
      </Text>
      <Text style={styles.doshaLabel}>{label}</Text>
      <Text style={styles.doshaDesc}>{desc}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: 20, gap: 14 },
  titleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  screenTitle: { fontSize: 28, fontFamily: "Nunito_700Bold", color: "#F0EBF8" },
  screenSub: { fontSize: 13, fontFamily: "Nunito_400Regular", color: "rgba(240,235,248,0.4)", marginTop: 2 },
  starsIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(245,166,35,0.12)", alignItems: "center", justifyContent: "center" },
  starsText: { fontSize: 18, color: "#F5A623" },

  sameDateBanner: { flexDirection: "row", alignItems: "flex-start", gap: 8, backgroundColor: "rgba(245,166,35,0.1)", borderRadius: 12, borderWidth: 1, borderColor: "rgba(245,166,35,0.3)", padding: 12 },
  sameDateText: { flex: 1, fontSize: 13, fontFamily: "Nunito_400Regular", color: "#F5A623", lineHeight: 19 },
  tabBar: { flexDirection: "row", backgroundColor: "rgba(26,22,48,0.8)", borderRadius: 14, padding: 4, gap: 2 },
  tabBtn: { flex: 1, paddingVertical: 9, borderRadius: 10, alignItems: "center" },
  tabBtnActive: { backgroundColor: "#1E1A30" },
  tabBtnText: { fontSize: 13, fontFamily: "Nunito_500Medium", color: "rgba(240,235,248,0.4)" },
  tabBtnTextActive: { color: "#F0EBF8" },

  trinityRow: { flexDirection: "row", gap: 10 },
  trinityCard: { flex: 1, borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  trinityGrad: { padding: 12, gap: 2, alignItems: "center" },
  trinityIcon: { fontSize: 16, marginBottom: 2 },
  trinitySymbol: { fontSize: 22 },
  trinityName: { fontSize: 13, fontFamily: "Nunito_600SemiBold", color: "#F0EBF8", textAlign: "center" },
  trinityLabel: { fontSize: 11, fontFamily: "Nunito_700Bold", color: "rgba(240,235,248,0.6)", textTransform: "uppercase", letterSpacing: 0.5 },
  trinitySub: { fontSize: 10, fontFamily: "Nunito_400Regular", color: "rgba(240,235,248,0.3)" },

  card: { backgroundColor: "#110F1E", borderRadius: 18, borderWidth: 1, borderColor: "rgba(240,235,248,0.07)", padding: 18, gap: 14 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cardTitle: { fontSize: 15, fontFamily: "Nunito_700Bold", color: "#F0EBF8" },
  cardBadge: { fontSize: 11, fontFamily: "Nunito_500Medium", color: "rgba(232,92,122,0.7)", backgroundColor: "rgba(232,92,122,0.08)", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },

  nakshatraMain: { flexDirection: "row", gap: 14, alignItems: "flex-start" },
  nakshatraCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: "rgba(184,85,224,0.15)", borderWidth: 1, borderColor: "rgba(184,85,224,0.35)", alignItems: "center", justifyContent: "center" },
  nakshatraCircleText: { fontSize: 22, fontFamily: "Nunito_700Bold", color: "#B855E0" },
  nakshatraCircleSub: { fontSize: 9, fontFamily: "Nunito_400Regular", color: "rgba(240,235,248,0.4)" },
  nakshatraName: { fontSize: 18, fontFamily: "Nunito_700Bold", color: "#F0EBF8" },
  nakshatraLord: { fontSize: 13, fontFamily: "Nunito_400Regular", color: "rgba(240,235,248,0.55)" },
  nakshatraDiety: { fontSize: 13, fontFamily: "Nunito_400Regular", color: "rgba(240,235,248,0.45)" },
  nakshatraSymbol: { fontSize: 12, fontFamily: "Nunito_400Regular", color: "rgba(240,235,248,0.35)" },
  nakshatraTagRow: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  nakshatraTag: { backgroundColor: "rgba(240,235,248,0.06)", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  nakshatraTagText: { fontSize: 12, fontFamily: "Nunito_400Regular", color: "rgba(240,235,248,0.5)" },

  dashaRow: { flexDirection: "row", gap: 0 },
  dashaMahaCard: { flex: 1, gap: 4 },
  dashaSep: { width: 1, backgroundColor: "rgba(240,235,248,0.08)", marginHorizontal: 16 },
  dashaAntarCard: { flex: 1, gap: 4 },
  dashaLabel: { fontSize: 11, fontFamily: "Nunito_600SemiBold", color: "rgba(240,235,248,0.3)", textTransform: "uppercase", letterSpacing: 0.5 },
  dashaLord: { fontSize: 18, fontFamily: "Nunito_700Bold" },
  dashaYears: { fontSize: 12, fontFamily: "Nunito_400Regular", color: "rgba(240,235,248,0.35)" },
  dashaTimeRow: { flexDirection: "row", justifyContent: "space-between", backgroundColor: "rgba(240,235,248,0.04)", borderRadius: 10, padding: 12 },
  dashaTimeItem: { gap: 3 },
  dashaTimeLabel: { fontSize: 11, fontFamily: "Nunito_400Regular", color: "rgba(240,235,248,0.35)" },
  dashaTimeValue: { fontSize: 16, fontFamily: "Nunito_700Bold", color: "#F0EBF8" },

  gridToggle: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "rgba(26,22,48,0.6)", borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, borderWidth: 1, borderColor: "rgba(240,235,248,0.07)" },
  gridToggleText: { fontSize: 14, fontFamily: "Nunito_500Medium", color: "rgba(240,235,248,0.5)" },
  gridWrapper: { backgroundColor: "#0D0A1E", borderRadius: 16, padding: 12, borderWidth: 1, borderColor: "rgba(240,235,248,0.07)", alignItems: "center", overflow: "hidden" },
  gridContainer: { position: "relative" },
  gridCell: { borderWidth: 1, borderColor: "rgba(240,235,248,0.08)", padding: 4, alignItems: "center", justifyContent: "center", gap: 1, backgroundColor: "rgba(8,6,17,0.7)" },
  gridCenter: { borderWidth: 1, borderColor: "rgba(232,92,122,0.2)", alignItems: "center", justifyContent: "center", gap: 2, backgroundColor: "rgba(232,92,122,0.05)" },
  gridCenterText: { fontSize: 9, color: "rgba(240,235,248,0.35)", textTransform: "uppercase" },
  gridCenterRashi: { fontSize: 22 },
  gridCenterName: { fontSize: 10, fontFamily: "Nunito_600SemiBold", color: "rgba(240,235,248,0.6)" },
  houseNum: { fontSize: 8, fontFamily: "Nunito_600SemiBold" },
  gridRashi: { fontSize: 14 },
  gridPlanet: { fontSize: 12 },
  diag1: { position: "absolute", height: 1, backgroundColor: "rgba(240,235,248,0.08)", transform: [{ rotate: "45deg" }] },
  diag2: { position: "absolute", height: 1, backgroundColor: "rgba(240,235,248,0.08)", transform: [{ rotate: "-45deg" }] },

  planetList: { gap: 0 },
  planetRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "rgba(240,235,248,0.04)" },
  planetSymbol: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  planetSymbolText: { fontSize: 18 },
  planetName: { fontSize: 14, fontFamily: "Nunito_600SemiBold", color: "#F0EBF8" },
  planetEn: { fontSize: 12, fontFamily: "Nunito_400Regular", color: "rgba(240,235,248,0.4)" },
  planetRashi: { fontSize: 12, fontFamily: "Nunito_400Regular", color: "rgba(240,235,248,0.45)", marginTop: 1 },
  rashiTag: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 7, paddingVertical: 2 },
  rashiTagText: { fontSize: 11, fontFamily: "Nunito_500Medium" },

  observationList: { gap: 12 },
  observationRow: { flexDirection: "row", gap: 10, alignItems: "flex-start" },
  obsDot: { fontSize: 10, color: "#E85C7A", marginTop: 3 },
  obsText: { flex: 1, fontSize: 14, fontFamily: "Nunito_400Regular", color: "rgba(240,235,248,0.7)", lineHeight: 22 },

  // Combined
  gunaScoreCard: { borderRadius: 20, overflow: "hidden", borderWidth: 1, borderColor: "rgba(82,200,184,0.2)" },
  gunaScoreInner: { padding: 28, alignItems: "center", gap: 8 },
  gunaScoreNum: { fontSize: 64, fontFamily: "Nunito_700Bold", color: "#F0EBF8" },
  gunaScoreMax: { fontSize: 28, fontFamily: "Nunito_400Regular", color: "rgba(240,235,248,0.4)" },
  gunaScoreLabel: { fontSize: 13, fontFamily: "Nunito_400Regular", color: "rgba(240,235,248,0.5)", textTransform: "uppercase", letterSpacing: 1 },
  gunaScoreVerdict: { fontSize: 16, fontFamily: "Nunito_700Bold", color: "#52C8B8" },
  compatibilityText: { fontSize: 15, fontFamily: "Nunito_400Regular", color: "rgba(240,235,248,0.75)", lineHeight: 24 },

  doshaRow: { gap: 10 },
  doshaItem: { borderRadius: 12, borderWidth: 1, padding: 14, gap: 4 },
  doshaIndicator: { fontSize: 16 },
  doshaLabel: { fontSize: 14, fontFamily: "Nunito_700Bold", color: "#F0EBF8" },
  doshaDesc: { fontSize: 13, fontFamily: "Nunito_400Regular", color: "rgba(240,235,248,0.45)" },

  kootaList: { gap: 0 },
  kootaRow: { flexDirection: "row", alignItems: "center", paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "rgba(240,235,248,0.04)", gap: 12 },
  kootaLeft: { flex: 1, gap: 2 },
  kootaName: { fontSize: 14, fontFamily: "Nunito_600SemiBold", color: "#F0EBF8" },
  kootaDesc: { fontSize: 11, fontFamily: "Nunito_400Regular", color: "rgba(240,235,248,0.35)" },
  kootaRight: { width: 70, gap: 5, alignItems: "flex-end" },
  kootaScore: { fontSize: 15, fontFamily: "Nunito_700Bold" },
  gunaTrack: { width: 70, height: 4, backgroundColor: "rgba(240,235,248,0.08)", borderRadius: 3, overflow: "hidden" },

  nakCompRow: { flexDirection: "row", gap: 12, alignItems: "flex-start", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "rgba(240,235,248,0.04)" },
  nakCompAvatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: "rgba(232,92,122,0.15)", borderWidth: 1, borderColor: "rgba(232,92,122,0.3)", alignItems: "center", justifyContent: "center" },
  nakCompInitial: { fontSize: 16, fontFamily: "Nunito_700Bold", color: "#E85C7A" },
  nakCompName: { fontSize: 15, fontFamily: "Nunito_700Bold", color: "#F0EBF8" },
  nakCompNak: { fontSize: 12, fontFamily: "Nunito_400Regular", color: "rgba(240,235,248,0.5)" },
  nakCompTags: { flexDirection: "row", gap: 6, flexWrap: "wrap", marginTop: 4 },
  nakCompTag: { backgroundColor: "rgba(240,235,248,0.06)", borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  nakCompTagText: { fontSize: 11, fontFamily: "Nunito_400Regular", color: "rgba(240,235,248,0.5)" },
});
