import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import { getAstrologyReading } from "@/utils/astrology";
import {
  recordDailyOpen, streakLine, type StreakState,
  getStartDate, setStartDate, getTimelineInfo, type TimelineInfo,
  getDailyPrediction, getDailyRitual, getDailyQuestion,
} from "@/utils/daily";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  Modal,
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const BAND_GRADIENT: Record<string, [string, string]> = {
  glowing: ["#4A3DE8", "#8B5CF6"],
  warm:    ["#F59E0B", "#F43F5E"],
  steady:  ["#10B981", "#059669"],
  tender:  ["#8B5CF6", "#64748B"],
};

// ─── Streak chip ──────────────────────────────────────────────────────────────

function StreakChip({ streak }: { streak: StreakState }) {
  const c = useColors();
  const s = useMemo(() => createStyles(c), [c]);
  return (
    <View style={s.streakCard}>
      <View style={s.streakFlame}>
        <Feather name="zap" size={20} color="#F59E0B" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={s.streakNumber}>{streak.current}<Text style={s.streakDayWord}> day{streak.current === 1 ? "" : "s"}</Text></Text>
        <Text style={s.streakSub}>{streakLine(streak.current)}</Text>
      </View>
      {streak.longest > streak.current && (
        <View style={s.streakBest}>
          <Text style={s.streakBestVal}>{streak.longest}</Text>
          <Text style={s.streakBestLabel}>BEST</Text>
        </View>
      )}
    </View>
  );
}

// ─── Couple timeline card ─────────────────────────────────────────────────────

function TimelineCard({
  info, userName, partnerName, onEdit, onShare,
}: {
  info: TimelineInfo; userName: string; partnerName: string;
  onEdit: () => void; onShare: () => void;
}) {
  const c = useColors();
  const s = useMemo(() => createStyles(c), [c]);
  return (
    <LinearGradient
      colors={["#4A3DE8", "#6D28D9"]}
      start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
      style={s.timelineCard}
    >
      <View style={s.timelineTopRow}>
        <Text style={s.timelineNames}>{userName} & {partnerName}</Text>
        <TouchableOpacity onPress={onEdit} hitSlop={10} style={s.timelineEdit}>
          <Feather name="edit-2" size={13} color="#FFFFFFCC" />
        </TouchableOpacity>
      </View>

      <Text style={s.timelineDays}>{info.days.toLocaleString()}</Text>
      <Text style={s.timelineDaysLabel}>days together</Text>
      <Text style={s.timelineSince}>{info.monthsLine} · since {info.startLabel}</Text>

      {info.next && (
        <View style={s.milestoneBlock}>
          <View style={s.milestoneRow}>
            <Text style={s.milestoneText}>{info.daysToNext} days to {info.next.label}</Text>
            <Text style={s.milestonePct}>{Math.round(info.pctToNext * 100)}%</Text>
          </View>
          <View style={s.milestoneTrack}>
            <View style={[s.milestoneFill, { width: `${Math.max(4, info.pctToNext * 100)}%` }]} />
          </View>
        </View>
      )}

      <TouchableOpacity onPress={onShare} style={s.timelineShare} activeOpacity={0.85}>
        <Feather name="share-2" size={13} color="#4A3DE8" />
        <Text style={s.timelineShareText}>Share our count</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

// ─── Set-date prompt (no anniversary stored yet) ──────────────────────────────

function TimelineEmpty({ onSet }: { onSet: () => void }) {
  const c = useColors();
  const s = useMemo(() => createStyles(c), [c]);
  return (
    <TouchableOpacity onPress={onSet} activeOpacity={0.9} style={s.emptyTimeline}>
      <View style={s.emptyIcon}>
        <Feather name="calendar" size={20} color="#4A3DE8" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={s.emptyTitle}>Start your couple timeline</Text>
        <Text style={s.emptySub}>Set the day it began and watch the days add up.</Text>
      </View>
      <Feather name="plus-circle" size={22} color="#4A3DE8" />
    </TouchableOpacity>
  );
}

// ─── Generic section card ─────────────────────────────────────────────────────

function SectionCard({
  icon, iconColor, iconBg, label, children,
}: {
  icon: keyof typeof Feather.glyphMap; iconColor: string; iconBg: string;
  label: string; children: React.ReactNode;
}) {
  const c = useColors();
  const s = useMemo(() => createStyles(c), [c]);
  return (
    <View style={s.card}>
      <View style={s.cardHead}>
        <View style={[s.cardIcon, { backgroundColor: iconBg }]}>
          <Feather name={icon} size={15} color={iconColor} />
        </View>
        <Text style={s.cardLabel}>{label}</Text>
      </View>
      {children}
    </View>
  );
}

// ─── Date picker modal (simple wheels via text) ───────────────────────────────

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function DateSheet({
  visible, initial, onClose, onSave,
}: {
  visible: boolean; initial: string | null;
  onClose: () => void; onSave: (stamp: string) => void;
}) {
  const c = useColors();
  const s = useMemo(() => createStyles(c), [c]);
  const init = initial ? new Date(initial.slice(0, 10) + "T00:00:00") : new Date();
  const [y, setY] = useState(String(init.getFullYear()));
  const [m, setM] = useState(init.getMonth());
  const [d, setD] = useState(init.getDate());

  useEffect(() => {
    if (visible) {
      const dt = initial ? new Date(initial.slice(0, 10) + "T00:00:00") : new Date();
      setY(String(dt.getFullYear())); setM(dt.getMonth()); setD(dt.getDate());
    }
  }, [visible]);

  const maxDay = new Date(Number(y) || 2024, m + 1, 0).getDate();
  const days = Array.from({ length: maxDay }, (_, i) => i + 1);

  const save = () => {
    const yr = Math.max(1980, Math.min(new Date().getFullYear(), Number(y) || new Date().getFullYear()));
    const stamp = `${yr}-${String(m + 1).padStart(2, "0")}-${String(Math.min(d, maxDay)).padStart(2, "0")}`;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onSave(stamp);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={s.sheetOverlay}>
        <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={onClose} />
        <View style={s.sheet}>
          <View style={s.sheetHandle} />
          <Text style={s.sheetTitle}>When did it begin?</Text>
          <Text style={s.sheetSub}>The first date, the day you made it official — whatever marks the start for you.</Text>

          {/* Month chips */}
          <Text style={s.sheetFieldLabel}>MONTH</Text>
          <View style={s.monthGrid}>
            {MONTHS.map((mm, i) => (
              <TouchableOpacity
                key={mm}
                onPress={() => { Haptics.selectionAsync(); setM(i); }}
                style={[s.monthChip, m === i && s.monthChipActive]}
              >
                <Text style={[s.monthChipText, m === i && s.monthChipTextActive]}>{mm}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={s.sheetRow}>
            <View style={{ flex: 1 }}>
              <Text style={s.sheetFieldLabel}>DAY</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
                {days.map((dd) => (
                  <TouchableOpacity
                    key={dd}
                    onPress={() => { Haptics.selectionAsync(); setD(dd); }}
                    style={[s.dayChip, d === dd && s.monthChipActive]}
                  >
                    <Text style={[s.monthChipText, d === dd && s.monthChipTextActive]}>{dd}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            <View style={{ width: 96 }}>
              <Text style={s.sheetFieldLabel}>YEAR</Text>
              <TextInput
                style={s.yearInput}
                value={y}
                onChangeText={(t) => setY(t.replace(/[^0-9]/g, "").slice(0, 4))}
                keyboardType="number-pad"
                maxLength={4}
              />
            </View>
          </View>

          <TouchableOpacity onPress={save} style={s.sheetSave} activeOpacity={0.85}>
            <Text style={s.sheetSaveText}>Save start date</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// ─── Daily hub screen ─────────────────────────────────────────────────────────

export default function TogetherScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, partner, challenges } = useApp();
  const c = useColors();
  const s = useMemo(() => createStyles(c), [c]);

  const reading = useMemo(() => {
    if (!user || !partner) return null;
    return getAstrologyReading(user.name, user.birthDate, partner.name, partner.birthDate, user.birthTime);
  }, [user?.birthDate, user?.name, user?.birthTime, partner?.birthDate, partner?.name]);

  const [streak, setStreak] = useState<StreakState | null>(null);
  const [startStamp, setStartStamp] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [revealQ, setRevealQ] = useState(false);

  useEffect(() => {
    recordDailyOpen().then(setStreak).catch(() => {});
    getStartDate().then(setStartStamp).catch(() => {});
  }, []);

  if (!user || !partner || !reading) return null;

  const prediction = getDailyPrediction(reading, partner.relationshipType);
  const ritual     = getDailyRitual(reading);
  const question   = getDailyQuestion(reading);
  const timeline   = startStamp ? getTimelineInfo(startStamp) : null;

  const grad = BAND_GRADIENT[prediction.band] ?? BAND_GRADIENT.steady;
  const haptic = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

  const saveDate = async (stamp: string) => {
    await setStartDate(stamp);
    setStartStamp(stamp);
    setSheetOpen(false);
  };

  const shareTimeline = async () => {
    if (!timeline) return;
    haptic();
    try {
      await Share.share({
        message: `${user.name} & ${partner.name} — ${timeline.days} days together and counting ✦\n\ntrack yours on Lumble:\nhttps://play.google.com/store/apps/details?id=com.lumble.app`,
      });
    } catch {}
  };

  return (
    <View style={s.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={Platform.OS === "web" ? s.webScroll : undefined}
        contentContainerStyle={[s.scroll, {
          paddingTop: insets.top + (Platform.OS === "web" ? 67 : 20),
          paddingBottom: insets.bottom + 100,
        }]}
      >
        {/* Header */}
        <View>
          <Text style={s.kicker}>YOUR DAILY</Text>
          <Text style={s.title}>Together</Text>
          <Text style={s.subtitle}>{prediction.date}</Text>
        </View>

        {/* Streak */}
        {streak && <StreakChip streak={streak} />}

        {/* Couple timeline */}
        {timeline
          ? <TimelineCard info={timeline} userName={user.name} partnerName={partner.name} onEdit={() => { haptic(); setSheetOpen(true); }} onShare={shareTimeline} />
          : <TimelineEmpty onSet={() => { haptic(); setSheetOpen(true); }} />}

        {/* Daily prediction */}
        <LinearGradient colors={grad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.predCard}>
          <View style={s.predTopRow}>
            <View style={s.predBadge}>
              <View style={s.predLiveDot} />
              <Text style={s.predBadgeText}>TODAY'S PREDICTION</Text>
            </View>
            <View style={s.predScoreWrap}>
              <Text style={s.predScore}>{prediction.score}</Text>
              <Text style={s.predScoreLabel}>love{"\n"}weather</Text>
            </View>
          </View>
          <Text style={s.predHeadline}>{prediction.headline}</Text>
          <Text style={s.predForecast}>{prediction.forecast}</Text>

          <View style={s.predSplit}>
            <View style={s.predHalf}>
              <Text style={s.predHalfLabel}>LEAN INTO</Text>
              <Text style={s.predHalfText}>{prediction.leanInto}</Text>
            </View>
            <View style={s.predHalfDivider} />
            <View style={s.predHalf}>
              <Text style={s.predHalfLabel}>WATCH FOR</Text>
              <Text style={s.predHalfText}>{prediction.watchFor}</Text>
            </View>
          </View>

          <View style={s.predWindow}>
            <Feather name="clock" size={13} color="#FFFFFFDD" />
            <Text style={s.predWindowText}><Text style={s.predWindowBold}>Best window — {prediction.bestWindow}.</Text> {prediction.windowWhy}</Text>
          </View>
        </LinearGradient>

        {/* Today's ritual */}
        <SectionCard icon="heart" iconColor="#F43F5E" iconBg={c.roseLight} label="TODAY'S RITUAL">
          <View style={s.ritualHead}>
            <Text style={s.ritualTitle}>{ritual.title}</Text>
            <View style={s.ritualMins}>
              <Feather name="clock" size={11} color={c.textFaint} />
              <Text style={s.ritualMinsText}>{ritual.minutes} min</Text>
            </View>
          </View>
          <Text style={s.bodyText}>{ritual.body}</Text>
        </SectionCard>

        {/* Question of the day */}
        <SectionCard icon="message-circle" iconColor="#8B5CF6" iconBg={c.violetLight} label="QUESTION OF THE DAY">
          {revealQ ? (
            <Text style={s.questionText}>{question}</Text>
          ) : (
            <TouchableOpacity onPress={() => { haptic(); setRevealQ(true); }} activeOpacity={0.85} style={s.questionReveal}>
              <Text style={s.questionRevealText}>Tap to reveal today's question</Text>
              <Feather name="eye" size={15} color="#8B5CF6" />
            </TouchableOpacity>
          )}
          {revealQ && (
            <Text style={s.questionHint}>Ask {partner.name} this today. The answer is the point, not the asking.</Text>
          )}
        </SectionCard>

        {/* Couple challenges link */}
        <TouchableOpacity
          onPress={() => { haptic(); router.push("/challenges"); }}
          activeOpacity={0.85}
          style={s.challengeRow}
        >
          <View style={[s.cardIcon, { backgroundColor: c.emeraldLight }]}>
            <Feather name="target" size={16} color="#10B981" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.challengeTitle}>Couple challenges</Text>
            <Text style={s.challengeSub}>
              {(challenges?.length ?? 0) > 0 ? `${challenges.length} matched to your charts` : "Personalized to your connection"}
            </Text>
          </View>
          <Feather name="chevron-right" size={18} color={c.textFaint} />
        </TouchableOpacity>

        <Text style={s.footerHint}>Everything here refreshes at midnight ✦</Text>
      </ScrollView>

      <DateSheet visible={sheetOpen} initial={startStamp} onClose={() => setSheetOpen(false)} onSave={saveDate} />
    </View>
  );
}

function createStyles(c: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    root:      { flex: 1, backgroundColor: c.background },
    webScroll: { maxWidth: 640, alignSelf: "center", width: "100%" },
    scroll:    { paddingHorizontal: 18, gap: 14 },

    kicker:   { fontSize: 11, fontFamily: "PlusJakartaSans_700Bold", color: c.textFaint, letterSpacing: 1.4 },
    title:    { fontSize: 30, fontFamily: "PlusJakartaSans_800ExtraBold", color: c.text, letterSpacing: -0.6, marginTop: 2 },
    subtitle: { fontSize: 13, fontFamily: "PlusJakartaSans_500Medium", color: c.textMuted, marginTop: 2 },

    // Streak
    streakCard:   { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: c.card, borderRadius: 16, borderWidth: 1, borderColor: c.border, padding: 14, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
    streakFlame:  { width: 40, height: 40, borderRadius: 12, backgroundColor: c.goldLight, alignItems: "center", justifyContent: "center" },
    streakNumber: { fontSize: 22, fontFamily: "PlusJakartaSans_800ExtraBold", color: c.text, letterSpacing: -0.4 },
    streakDayWord:{ fontSize: 14, fontFamily: "PlusJakartaSans_600SemiBold", color: c.textMuted },
    streakSub:    { fontSize: 12, fontFamily: "PlusJakartaSans_400Regular", color: c.textMuted, marginTop: 1 },
    streakBest:   { alignItems: "center", paddingHorizontal: 10, paddingVertical: 6, backgroundColor: c.goldLight, borderRadius: 12 },
    streakBestVal:{ fontSize: 16, fontFamily: "PlusJakartaSans_800ExtraBold", color: "#D97706" },
    streakBestLabel:{ fontSize: 8, fontFamily: "PlusJakartaSans_700Bold", color: "#D97706", letterSpacing: 0.8 },

    // Timeline
    timelineCard:    { borderRadius: 20, padding: 20, gap: 4, shadowColor: "#4A3DE8", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 14, elevation: 5 },
    timelineTopRow:  { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
    timelineNames:   { fontSize: 13, fontFamily: "PlusJakartaSans_700Bold", color: "#FFFFFF", letterSpacing: 0.2 },
    timelineEdit:    { width: 30, height: 30, borderRadius: 9, backgroundColor: "#FFFFFF22", alignItems: "center", justifyContent: "center" },
    timelineDays:    { fontSize: 52, fontFamily: "PlusJakartaSans_800ExtraBold", color: "#FFFFFF", letterSpacing: -1.5, lineHeight: 56 },
    timelineDaysLabel:{ fontSize: 14, fontFamily: "PlusJakartaSans_600SemiBold", color: "#FFFFFFDD", marginTop: -2 },
    timelineSince:   { fontSize: 12, fontFamily: "PlusJakartaSans_400Regular", color: "#FFFFFFAA", marginTop: 4 },
    milestoneBlock:  { marginTop: 14, gap: 6 },
    milestoneRow:    { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    milestoneText:   { fontSize: 12, fontFamily: "PlusJakartaSans_600SemiBold", color: "#FFFFFFEE" },
    milestonePct:    { fontSize: 12, fontFamily: "PlusJakartaSans_700Bold", color: "#FFFFFF" },
    milestoneTrack:  { height: 6, borderRadius: 3, backgroundColor: "#FFFFFF33", overflow: "hidden" },
    milestoneFill:   { height: 6, borderRadius: 3, backgroundColor: "#FFFFFF" },
    timelineShare:   { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, backgroundColor: "#FFFFFF", borderRadius: 12, paddingVertical: 10, marginTop: 16 },
    timelineShareText:{ fontSize: 13, fontFamily: "PlusJakartaSans_700Bold", color: "#4A3DE8" },

    // Empty timeline
    emptyTimeline: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: c.card, borderRadius: 16, borderWidth: 1, borderStyle: "dashed", borderColor: c.primaryBorder, padding: 16 },
    emptyIcon:     { width: 40, height: 40, borderRadius: 12, backgroundColor: c.primaryLight, alignItems: "center", justifyContent: "center" },
    emptyTitle:    { fontSize: 15, fontFamily: "PlusJakartaSans_700Bold", color: c.text },
    emptySub:      { fontSize: 12, fontFamily: "PlusJakartaSans_400Regular", color: c.textMuted, marginTop: 2 },

    // Prediction
    predCard:      { borderRadius: 20, padding: 20, gap: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.18, shadowRadius: 12, elevation: 4 },
    predTopRow:    { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
    predBadge:     { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#FFFFFF22", borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5, alignSelf: "flex-start" },
    predLiveDot:   { width: 6, height: 6, borderRadius: 3, backgroundColor: "#FFFFFF" },
    predBadgeText: { fontSize: 10, fontFamily: "PlusJakartaSans_700Bold", color: "#FFFFFF", letterSpacing: 0.8 },
    predScoreWrap: { alignItems: "center" },
    predScore:     { fontSize: 38, fontFamily: "PlusJakartaSans_800ExtraBold", color: "#FFFFFF", lineHeight: 40, letterSpacing: -1 },
    predScoreLabel:{ fontSize: 8, fontFamily: "PlusJakartaSans_700Bold", color: "#FFFFFFCC", letterSpacing: 0.6, textAlign: "center", textTransform: "uppercase" },
    predHeadline:  { fontSize: 20, fontFamily: "PlusJakartaSans_800ExtraBold", color: "#FFFFFF", lineHeight: 26, letterSpacing: -0.3 },
    predForecast:  { fontSize: 14, fontFamily: "PlusJakartaSans_400Regular", color: "#FFFFFFEE", lineHeight: 22 },
    predSplit:     { flexDirection: "row", gap: 12, backgroundColor: "#FFFFFF1A", borderRadius: 14, padding: 14, marginTop: 2 },
    predHalf:      { flex: 1, gap: 4 },
    predHalfDivider:{ width: 1, backgroundColor: "#FFFFFF33" },
    predHalfLabel: { fontSize: 9, fontFamily: "PlusJakartaSans_700Bold", color: "#FFFFFFBB", letterSpacing: 0.8 },
    predHalfText:  { fontSize: 12.5, fontFamily: "PlusJakartaSans_500Medium", color: "#FFFFFF", lineHeight: 18 },
    predWindow:    { flexDirection: "row", gap: 8, alignItems: "flex-start" },
    predWindowText:{ flex: 1, fontSize: 12, fontFamily: "PlusJakartaSans_400Regular", color: "#FFFFFFDD", lineHeight: 18 },
    predWindowBold:{ fontFamily: "PlusJakartaSans_700Bold", color: "#FFFFFF" },

    // Generic card
    card:      { backgroundColor: c.card, borderRadius: 16, borderWidth: 1, borderColor: c.border, padding: 16, gap: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
    cardHead:  { flexDirection: "row", alignItems: "center", gap: 10 },
    cardIcon:  { width: 32, height: 32, borderRadius: 10, alignItems: "center", justifyContent: "center" },
    cardLabel: { fontSize: 11, fontFamily: "PlusJakartaSans_700Bold", color: c.textFaint, letterSpacing: 1, textTransform: "uppercase" },
    bodyText:  { fontSize: 14, fontFamily: "PlusJakartaSans_400Regular", color: c.textBody, lineHeight: 22 },

    // Ritual
    ritualHead:   { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    ritualTitle:  { fontSize: 17, fontFamily: "PlusJakartaSans_700Bold", color: c.text, flex: 1 },
    ritualMins:   { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: c.borderLight, borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3 },
    ritualMinsText:{ fontSize: 11, fontFamily: "PlusJakartaSans_600SemiBold", color: c.textMuted },

    // Question
    questionReveal:    { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: c.violetLight, borderRadius: 12, paddingVertical: 16, borderWidth: 1, borderColor: c.violetBorder },
    questionRevealText:{ fontSize: 14, fontFamily: "PlusJakartaSans_700Bold", color: "#8B5CF6" },
    questionText:      { fontSize: 19, fontFamily: "PlusJakartaSans_700Bold", color: c.text, lineHeight: 27, letterSpacing: -0.2 },
    questionHint:      { fontSize: 12, fontFamily: "PlusJakartaSans_400Regular", color: c.textMuted, lineHeight: 18 },

    // Challenge row
    challengeRow:   { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: c.card, borderRadius: 16, borderWidth: 1, borderColor: c.border, padding: 14, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
    challengeTitle: { fontSize: 15, fontFamily: "PlusJakartaSans_700Bold", color: c.text },
    challengeSub:   { fontSize: 12, fontFamily: "PlusJakartaSans_400Regular", color: c.textFaint, marginTop: 1 },

    footerHint: { textAlign: "center", fontSize: 11, fontFamily: "PlusJakartaSans_500Medium", color: c.textFaint, marginTop: 4 },

    // Date sheet
    sheetOverlay:  { flex: 1, backgroundColor: c.overlay, justifyContent: "flex-end" },
    sheet:         { backgroundColor: c.card, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 36, gap: 12 },
    sheetHandle:   { width: 40, height: 4, borderRadius: 2, backgroundColor: c.border, alignSelf: "center", marginBottom: 4 },
    sheetTitle:    { fontSize: 20, fontFamily: "PlusJakartaSans_800ExtraBold", color: c.text, letterSpacing: -0.3 },
    sheetSub:      { fontSize: 13, fontFamily: "PlusJakartaSans_400Regular", color: c.textMuted, lineHeight: 19 },
    sheetFieldLabel:{ fontSize: 10, fontFamily: "PlusJakartaSans_700Bold", color: c.textFaint, letterSpacing: 1, marginBottom: 6, marginTop: 4 },
    monthGrid:     { flexDirection: "row", flexWrap: "wrap", gap: 6 },
    monthChip:     { width: "22%", paddingVertical: 9, borderRadius: 10, backgroundColor: c.input, borderWidth: 1, borderColor: c.border, alignItems: "center" },
    monthChipActive:{ backgroundColor: c.primaryLight, borderColor: c.primaryBorder },
    monthChipText: { fontSize: 13, fontFamily: "PlusJakartaSans_600SemiBold", color: c.textMuted },
    monthChipTextActive:{ color: "#4A3DE8", fontFamily: "PlusJakartaSans_700Bold" },
    sheetRow:      { flexDirection: "row", gap: 12, alignItems: "flex-start" },
    dayChip:       { minWidth: 38, paddingHorizontal: 10, paddingVertical: 9, borderRadius: 10, backgroundColor: c.input, borderWidth: 1, borderColor: c.border, alignItems: "center" },
    yearInput:     { backgroundColor: c.input, borderWidth: 1, borderColor: c.border, borderRadius: 10, paddingVertical: 9, paddingHorizontal: 12, fontSize: 15, fontFamily: "PlusJakartaSans_600SemiBold", color: c.text, textAlign: "center" },
    sheetSave:     { backgroundColor: c.cta, borderRadius: 14, paddingVertical: 15, alignItems: "center", marginTop: 12 },
    sheetSaveText: { fontSize: 15, fontFamily: "PlusJakartaSans_700Bold", color: c.ctaForeground },
  });
}
