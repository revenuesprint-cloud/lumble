import { GuidanceMessage, useApp } from "@/context/AppContext";
import { getAstrologyReading } from "@/utils/astrology";
import { getOracleResponse } from "@/utils/oracle";
import { getPersonalizedChips, getPersonalizedSuggestions } from "@/utils/personalization";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Fallback cards used before kundli is ready
const FALLBACK_CARDS = [
  { q: "Why did they pull away?",      category: "distance", icon: "🌙" },
  { q: "Do they still feel something?",category: "feelings", icon: "✦" },
  { q: "Should I reach out?",          category: "action",   icon: "◎" },
  { q: "Why can't I move on?",         category: "healing",  icon: "⟡" },
  { q: "Are we compatible?",           category: "insight",  icon: "◈" },
  { q: "What does the future hold?",   category: "future",   icon: "✧" },
];
const FALLBACK_CHIPS = ["Why did they pull away?","Do they miss me?","Should I text?","Why do we fight?","Will it work out?"];

// ─── Typing indicator ─────────────────────────────────────────────────────────

function TypingIndicator() {
  const dots = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];

  useEffect(() => {
    const loops = dots.map((dot, i) => {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.delay(i * 160),
          Animated.timing(dot, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0.2, duration: 300, useNativeDriver: true }),
          Animated.delay(320),
        ])
      );
      loop.start();
      return loop;
    });
    return () => loops.forEach((l) => l.stop());
  }, []);

  return (
    <View style={styles.typingRow}>
      <View style={styles.botAvatar}>
        <Text style={styles.botAvatarText}>◉</Text>
      </View>
      <View style={styles.typingBubble}>
        {dots.map((dot, i) => (
          <Animated.View key={i} style={[styles.typingDot, { opacity: dot }]} />
        ))}
      </View>
    </View>
  );
}

// ─── Message bubble ───────────────────────────────────────────────────────────

function MessageBubble({ message, index }: { message: GuidanceMessage; index: number }) {
  const isUser = message.role === "user";
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(isUser ? 12 : -12)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 280, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 280, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.bubbleRow,
        isUser ? styles.bubbleRowUser : styles.bubbleRowBot,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      {!isUser && (
        <View style={styles.botAvatar}>
          <Text style={styles.botAvatarText}>◉</Text>
        </View>
      )}
      <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleBot]}>
        {!isUser && (
          <View style={styles.botLabel}>
            <Text style={styles.botLabelText}>Lumble Guide</Text>
          </View>
        )}
        <Text style={[styles.bubbleText, isUser ? styles.bubbleTextUser : styles.bubbleTextBot]}>
          {message.text}
        </Text>
      </View>
    </Animated.View>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ onSelect, cards }: { onSelect: (q: string) => void; cards: { q: string; category: string; icon: string }[] }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, delay: 100, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, delay: 100, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[styles.emptyState, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      {/* Oracle sigil */}
      <View style={styles.oracleContainer}>
        <LinearGradient
          colors={["rgba(232,92,122,0.15)", "rgba(184,85,224,0.08)", "transparent"]}
          style={styles.oracleOrb}
        >
          <Text style={styles.oracleGlyph}>◉</Text>
        </LinearGradient>
        <Text style={styles.oracleLabel}>ORACLE</Text>
      </View>

      <View style={styles.emptyTextGroup}>
        <Text style={styles.emptyTitle}>What's on your mind?</Text>
        <Text style={styles.emptySub}>
          Ask anything about this connection.{"\n"}Your answers are read from the stars.
        </Text>
      </View>

      {/* Question cards */}
      <View style={styles.cardGrid}>
        {cards.map((card, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onSelect(card.q);
            }}
            activeOpacity={0.75}
            style={styles.suggestionCard}
          >
            <LinearGradient
              colors={["rgba(26,22,48,0.9)", "rgba(17,15,30,0.95)"]}
              style={styles.suggestionCardInner}
            >
              <Text style={styles.suggestionCardIcon}>{card.icon}</Text>
              <Text style={styles.suggestionCardQ}>{card.q}</Text>
              <Text style={styles.suggestionCardCat}>{card.category}</Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function GuidanceScreen() {
  const insets      = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const { user, partner, guidanceMessages, addGuidanceMessage, clearGuidanceMessages, isPremium } = useApp();
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const isTypingRef = useRef(false);
  const userMessages = guidanceMessages.filter((m) => m.role === "user").length;
  const hitLimit = !isPremium && userMessages >= 5;

  const reading = useMemo(() => {
    if (!user || !partner) return null;
    return getAstrologyReading(user.name, user.birthDate, partner.name, partner.birthDate, user.birthTime);
  }, [user?.birthDate, user?.name, user?.birthTime, partner?.birthDate, partner?.name]);

  const suggestionCards = useMemo(() =>
    reading && partner ? getPersonalizedSuggestions(reading, partner.relationshipType) : FALLBACK_CARDS,
  [reading, partner?.relationshipType]);

  const quickChips = useMemo(() =>
    reading && partner ? getPersonalizedChips(reading, partner.relationshipType) : FALLBACK_CHIPS,
  [reading, partner?.relationshipType]);

  // Keep a ref so the async sendMessage always reads the latest isTyping value
  useEffect(() => { isTypingRef.current = isTyping; }, [isTyping]);

  const sendMessage = useCallback(async (text: string) => {
    if (!user || !partner) return;
    if (!text.trim() || isTypingRef.current) return;
    const currentUserMessages = guidanceMessages.filter((m) => m.role === "user").length;
    if (!isPremium && currentUserMessages >= 5) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 5);
    addGuidanceMessage({ id, role: "user", text: text.trim(), timestamp: Date.now() });
    setInput("");
    setIsTyping(true);
    isTypingRef.current = true;

    try {
      const delay = 900 + Math.random() * 800 + text.length * 8;
      await new Promise((r) => setTimeout(r, delay));

      const responseText = getOracleResponse(
        text, user.name, user.birthDate,
        partner.name, partner.birthDate,
        partner.relationshipType
      );
      addGuidanceMessage({ id: id + "_bot", role: "assistant", text: responseText, timestamp: Date.now() });
    } catch {
      addGuidanceMessage({
        id: id + "_bot",
        role: "assistant",
        text: "The stars are quiet right now. Ask again in a moment.",
        timestamp: Date.now(),
      });
    } finally {
      setIsTyping(false);
      isTypingRef.current = false;
    }
  }, [user, partner, guidanceMessages, addGuidanceMessage, isPremium]);

  if (!user || !partner) return null;

  const hasMessages = guidanceMessages.length > 0;

  return (
    <LinearGradient colors={["#080611", "#0D0A1E"]} style={{ flex: 1 }}>
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }} keyboardVerticalOffset={0}>

        {/* ── Header ── */}
        <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === "web" ? 67 : 16) }]}>
          <View style={styles.headerLeft}>
            <View style={styles.headerOrbSmall}>
              <Text style={styles.headerOrbText}>◉</Text>
            </View>
            <View>
              <Text style={styles.headerTitle}>Guide</Text>
              <Text style={styles.headerSub}>
                {user.name} · {partner.name}
              </Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            {hasMessages && (
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  clearGuidanceMessages();
                }}
                style={styles.clearBtn}
                activeOpacity={0.7}
              >
                <Feather name="trash-2" size={15} color="rgba(240,235,248,0.35)" />
              </TouchableOpacity>
            )}
            <View style={[styles.headerPill, hitLimit && styles.headerPillWarn]}>
              <View style={[styles.headerPillDot, hitLimit && { backgroundColor: "#E85C7A" }]} />
              <Text style={[styles.headerPillText, hitLimit && { color: "#E85C7A" }]}>
                {isPremium ? "Unlimited" : hitLimit ? "Limit reached" : `${5 - userMessages} left`}
              </Text>
            </View>
          </View>
        </View>

        {/* ── Message list / empty state ── */}
        {!hasMessages ? (
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={[styles.emptyScroll, { paddingBottom: tabBarHeight + 80 }]}
            showsVerticalScrollIndicator={false}
          >
            <EmptyState onSelect={sendMessage} cards={suggestionCards} />
          </ScrollView>
        ) : (
          <FlatList
            ref={flatListRef}
            data={guidanceMessages}
            keyExtractor={(m) => m.id}
            style={{ flex: 1 }}
            contentContainerStyle={[styles.messageList, { paddingBottom: isTyping ? 8 : 16 }]}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            renderItem={({ item, index }) => <MessageBubble message={item} index={index} />}
            ListFooterComponent={
              <>
                {isTyping && <TypingIndicator />}
                {hitLimit && (
                  <View style={styles.limitCard}>
                    <Text style={styles.limitIcon}>◈</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.limitTitle}>Unlock Unlimited Guidance</Text>
                      <Text style={styles.limitSub}>Continue this conversation with Premium</Text>
                    </View>
                    <Feather name="chevron-right" size={16} color="rgba(232,92,122,0.5)" />
                  </View>
                )}
              </>
            }
          />
        )}

        {/* ── Input area ── */}
        <View style={[
          styles.inputArea,
          { paddingBottom: tabBarHeight + (Platform.OS === "web" ? 30 : 12) },
        ]}>
          {/* Quick chips (only when conversation started) */}
          {hasMessages && !hitLimit && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.chipsScroll}
              contentContainerStyle={styles.chipsContent}
            >
              {quickChips.map((chip, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => sendMessage(chip)}
                  disabled={isTyping}
                  style={[styles.chip, isTyping && { opacity: 0.4 }]}
                  activeOpacity={0.75}
                >
                  <Text style={styles.chipText}>{chip}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          {/* Text row */}
          <View style={styles.inputRow}>
            <TextInput
              style={styles.inputField}
              value={input}
              onChangeText={setInput}
              placeholder={
                hitLimit ? "Upgrade for more guidance"
                : isTyping ? "Reading your chart…"
                : "Ask about this connection…"
              }
              placeholderTextColor="rgba(240,235,248,0.22)"
              editable={!hitLimit && !isTyping}
              multiline
              maxLength={300}
              onSubmitEditing={() => sendMessage(input)}
            />
            <Pressable
              onPress={() => sendMessage(input)}
              disabled={!input.trim() || hitLimit || isTyping}
              style={({ pressed }) => [
                styles.sendBtn,
                (!input.trim() || hitLimit || isTyping) && { opacity: 0.3 },
                pressed && { transform: [{ scale: 0.94 }] },
              ]}
            >
              <LinearGradient
                colors={["#E85C7A", "#B855E0"]}
                style={styles.sendBtnGrad}
              >
                <Feather name="send" size={15} color="#fff" />
              </LinearGradient>
            </Pressable>
          </View>
        </View>

      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  // Header
  header: {
    paddingHorizontal: 20,
    paddingBottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(240,235,248,0.05)",
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  headerOrbSmall: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(232,92,122,0.1)",
    borderWidth: 1,
    borderColor: "rgba(232,92,122,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerOrbText: { fontSize: 17, color: "#E85C7A" },
  headerTitle: { fontSize: 20, fontFamily: "Nunito_700Bold", color: "#F0EBF8" },
  headerSub: { fontSize: 12, fontFamily: "Nunito_400Regular", color: "rgba(240,235,248,0.35)", marginTop: 1 },
  headerPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(124,82,200,0.12)",
    borderWidth: 1,
    borderColor: "rgba(124,82,200,0.25)",
    borderRadius: 20,
    paddingHorizontal: 11,
    paddingVertical: 6,
  },
  headerPillWarn: {
    backgroundColor: "rgba(232,92,122,0.1)",
    borderColor: "rgba(232,92,122,0.25)",
  },
  headerPillDot: {
    width: 5, height: 5, borderRadius: 2.5,
    backgroundColor: "#B855E0",
  },
  headerPillText: {
    fontSize: 12,
    fontFamily: "Nunito_600SemiBold",
    color: "#B855E0",
  },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  clearBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(240,235,248,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },

  // Empty state
  emptyScroll: { flexGrow: 1, paddingHorizontal: 20 },
  emptyState: { paddingTop: 20, gap: 28, alignItems: "center" },
  oracleContainer: { alignItems: "center", gap: 8 },
  oracleOrb: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(232,92,122,0.15)",
  },
  oracleGlyph: { fontSize: 36, color: "#E85C7A" },
  oracleLabel: {
    fontSize: 10,
    fontFamily: "Nunito_700Bold",
    color: "rgba(232,92,122,0.4)",
    letterSpacing: 3,
  },
  emptyTextGroup: { alignItems: "center", gap: 8 },
  emptyTitle: { fontSize: 24, fontFamily: "Nunito_700Bold", color: "#F0EBF8" },
  emptySub: {
    fontSize: 14,
    fontFamily: "Nunito_400Regular",
    color: "rgba(240,235,248,0.4)",
    textAlign: "center",
    lineHeight: 22,
  },

  // Card grid
  cardGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, width: "100%" },
  suggestionCard: {
    width: "47.5%",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(240,235,248,0.07)",
  },
  suggestionCardInner: { padding: 16, gap: 8, minHeight: 110 },
  suggestionCardIcon: { fontSize: 22 },
  suggestionCardQ: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Nunito_600SemiBold",
    color: "#F0EBF8",
    lineHeight: 20,
  },
  suggestionCardCat: {
    fontSize: 10,
    fontFamily: "Nunito_500Medium",
    color: "rgba(232,92,122,0.5)",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },

  // Messages
  messageList: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 14,
  },
  bubbleRow: { flexDirection: "row", gap: 10, alignItems: "flex-end" },
  bubbleRowUser: { justifyContent: "flex-end" },
  bubbleRowBot: { justifyContent: "flex-start" },
  botAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(232,92,122,0.1)",
    borderWidth: 1,
    borderColor: "rgba(232,92,122,0.25)",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginBottom: 2,
  },
  botAvatarText: { fontSize: 13, color: "#E85C7A" },
  bubble: { maxWidth: "80%", borderRadius: 18, padding: 14, gap: 6 },
  bubbleUser: {
    backgroundColor: "rgba(232,92,122,0.12)",
    borderWidth: 1,
    borderColor: "rgba(232,92,122,0.22)",
    borderBottomRightRadius: 5,
  },
  bubbleBot: {
    backgroundColor: "#141128",
    borderWidth: 1,
    borderColor: "rgba(240,235,248,0.07)",
    borderBottomLeftRadius: 5,
  },
  botLabel: { marginBottom: 2 },
  botLabelText: {
    fontSize: 10,
    fontFamily: "Nunito_600SemiBold",
    color: "rgba(232,92,122,0.5)",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  bubbleText: { lineHeight: 24 },
  bubbleTextUser: {
    fontSize: 15,
    fontFamily: "Nunito_400Regular",
    color: "#F0EBF8",
  },
  bubbleTextBot: {
    fontSize: 15,
    fontFamily: "Nunito_400Regular",
    color: "rgba(240,235,248,0.88)",
  },

  // Typing
  typingRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  typingBubble: {
    backgroundColor: "#141128",
    borderRadius: 18,
    borderBottomLeftRadius: 5,
    borderWidth: 1,
    borderColor: "rgba(240,235,248,0.07)",
    paddingHorizontal: 18,
    paddingVertical: 14,
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
  },
  typingDot: {
    width: 7, height: 7, borderRadius: 3.5,
    backgroundColor: "#E85C7A",
  },

  // Limit card
  limitCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginHorizontal: 16,
    marginTop: 14,
    backgroundColor: "rgba(232,92,122,0.06)",
    borderWidth: 1,
    borderColor: "rgba(232,92,122,0.18)",
    borderRadius: 16,
    padding: 16,
  },
  limitIcon: { fontSize: 22, color: "#E85C7A" },
  limitTitle: { fontSize: 14, fontFamily: "Nunito_700Bold", color: "#F0EBF8" },
  limitSub: { fontSize: 12, fontFamily: "Nunito_400Regular", color: "rgba(240,235,248,0.4)", marginTop: 2 },

  // Input area
  inputArea: {
    paddingHorizontal: 16,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(240,235,248,0.05)",
    gap: 10,
    backgroundColor: "rgba(8,6,17,0.96)",
  },
  chipsScroll: { flexGrow: 0 },
  chipsContent: { gap: 8, paddingRight: 8 },
  chip: {
    backgroundColor: "rgba(26,22,48,0.8)",
    borderWidth: 1,
    borderColor: "rgba(184,85,224,0.2)",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipText: {
    fontSize: 13,
    fontFamily: "Nunito_400Regular",
    color: "rgba(240,235,248,0.55)",
  },
  inputRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-end",
  },
  inputField: {
    flex: 1,
    backgroundColor: "#141128",
    borderWidth: 1,
    borderColor: "rgba(240,235,248,0.08)",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 13,
    paddingBottom: 13,
    fontSize: 15,
    fontFamily: "Nunito_400Regular",
    color: "#F0EBF8",
    maxHeight: 100,
  },
  sendBtn: { borderRadius: 14, overflow: "hidden" },
  sendBtnGrad: {
    width: 46,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
  },
});
