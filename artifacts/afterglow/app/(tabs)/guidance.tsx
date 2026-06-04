import { GuidanceMessage, useApp } from "@/context/AppContext";
import { getAstrologyReading } from "@/utils/astrology";
import { extractKundliAttributes } from "@/utils/challenges";
import { fetchQuestions, type QuestionsResult, type QuestionItem } from "@/utils/dbContent";
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

type Mode = "browse" | "ask";

// ─── Local fallback questions (before API loads) ──────────────────────────────

const LOCAL_QUESTIONS: QuestionsResult = {
  about_them: [
    { id:"l1", title:"Why do they pull away when things get good?", body:"Their Moon sign goes into self-protection mode exactly when closeness peaks — it's not about you, it's about their fear of how much they feel.", meta:{ question:"Why do they pull away when things get good?", shortAnswer:"Scared of how much they feel.", category:"about_them", icon:"💨" }, tags:["universal"], match_score:1 },
    { id:"l2", title:"Do they actually miss me?", body:"Yes — but missing someone and being ready to do something about it are completely different things.", meta:{ question:"Do they actually miss me?", shortAnswer:"Yes, but not in a way that changes anything yet.", category:"about_them", icon:"💭" }, tags:["universal"], match_score:1 },
    { id:"l3", title:"Why do they go hot and cold?", body:"Hot-and-cold behavior almost always means someone is attracted to you but scared of what that attraction means.", meta:{ question:"Why do they go hot and cold?", shortAnswer:"Attracted but scared. Classic.", category:"about_them", icon:"🌡️" }, tags:["universal"], match_score:1 },
    { id:"l4", title:"Are they losing interest?", body:"Reduced energy doesn't always mean reduced interest — but if the pattern has lasted more than 3 weeks with no explanation, that's different information.", meta:{ question:"Are they losing interest?", shortAnswer:"Look at the pattern, not just today.", category:"about_them", icon:"📉" }, tags:["universal"], match_score:1 },
    { id:"l5", title:"Why did they ghost me?", body:"Ghosting is almost always about the ghoster's inability to handle conflict, not your lack of worth.", meta:{ question:"Why did they ghost me?", shortAnswer:"Their conflict-avoidance, not your worth.", category:"about_them", icon:"👻" }, tags:["universal"], match_score:1 },
  ],
  about_you: [
    { id:"l6", title:"Am I the toxic one?", body:"Asking this question usually means you're not — truly toxic people rarely audit themselves. You have patterns worth looking at. That's different.", meta:{ question:"Am I the toxic one?", shortAnswer:"Probably not. But you have patterns.", category:"about_you", icon:"🪞" }, tags:["universal"], match_score:1 },
    { id:"l7", title:"Why do I always fall for unavailable people?", body:"Your Moon sign finds familiarity in emotional inconsistency — somewhere in early life, inconsistent love was the only love available. Rewritable.", meta:{ question:"Why do I always fall for unavailable people?", shortAnswer:"Familiarity with inconsistency. Rewritable.", category:"about_you", icon:"🎯" }, tags:["universal"], match_score:1 },
    { id:"l8", title:"Why can't I stop thinking about them?", body:"Your attachment runs deep. The obsessive thoughts are your nervous system trying to resolve something that didn't get a clean ending.", meta:{ question:"Why can't I stop thinking about them?", shortAnswer:"Deep attachment needs a productive task.", category:"about_you", icon:"🌀" }, tags:["universal"], match_score:1 },
    { id:"l9", title:"Am I too much for them?", body:"You are not too much. You are the right amount for the wrong person.", meta:{ question:"Am I too much for them?", shortAnswer:"You're not too much. They're not enough.", category:"about_you", icon:"🌋" }, tags:["universal"], match_score:1 },
    { id:"l10", title:"Why do I always feel like I care more?", body:"You might actually care equally — but differently. Still worth asking: is this person matching your depth, or just benefiting from it?", meta:{ question:"Why do I always feel like I care more?", shortAnswer:"You might care equally, differently. Or you might be right.", category:"about_you", icon:"⚖️" }, tags:["universal"], match_score:1 },
  ],
  what_to_do: [
    { id:"l11", title:"Should I reach out first?", body:"Reach out if you have something genuine to say — not to test them, not strategically, just because you want to.", meta:{ question:"Should I reach out first?", shortAnswer:"Only if you have something real to say.", category:"what_to_do", icon:"📲" }, tags:["universal"], match_score:1 },
    { id:"l12", title:"Should I give them another chance?", body:"Second chances work when something genuinely changed — not when time passed. Can you name precisely what's different?", meta:{ question:"Should I give them another chance?", shortAnswer:"Only if something specifically changed.", category:"what_to_do", icon:"🎲" }, tags:["universal"], match_score:1 },
    { id:"l13", title:"Should I tell them how I feel?", body:"Unexpressed feelings become either resentment or obsession. Say it simply, without an ultimatum.", meta:{ question:"Should I tell them how I feel?", shortAnswer:"Say it without an ultimatum.", category:"what_to_do", icon:"💬" }, tags:["universal"], match_score:1 },
    { id:"l14", title:"How do I let go without closure?", body:"Closure is a myth. You can't get it from the person who caused the pain — only from yourself. Write the letter. That's the closure.", meta:{ question:"How do I let go without closure?", shortAnswer:"Closure comes from yourself, not from them.", category:"what_to_do", icon:"🕊️" }, tags:["universal"], match_score:1 },
  ],
  patterns: [
    { id:"l15", title:"Is this a trauma bond or real love?", body:"Real love expands you; trauma bonds contract you. If the connection makes you feel more yourself — love. If it makes you feel like you need to earn the good moments — that's a bond built on pain.", meta:{ question:"Is this a trauma bond or real love?", shortAnswer:"Real love expands you. Trauma bonds shrink you.", category:"patterns", icon:"🔬" }, tags:["universal"], match_score:1 },
    { id:"l16", title:"Are we compatible or just comfortable?", body:"Comfort masquerades as compatibility. When you imagine a better version of your life, are they in it? Or do they just fit your current version?", meta:{ question:"Are we compatible or just comfortable?", shortAnswer:"Comfort is real. Compatible means growing together.", category:"patterns", icon:"🛋️" }, tags:["universal"], match_score:1 },
    { id:"l17", title:"Why does this feel addictive even though it hurts?", body:"Intermittent reinforcement — unpredictable rewards — is the most powerful pattern for creating addiction. The highs feel higher because of the lows.", meta:{ question:"Why does this feel addictive even though it hurts?", shortAnswer:"Intermittent rewards create the strongest addictions.", category:"patterns", icon:"💊" }, tags:["universal"], match_score:1 },
  ],
  big_picture: [
    { id:"l18", title:"Is this worth fighting for?", body:"Worth fighting for means: the best version of this relationship is worth the cost of the worst moments. Answer honestly, not hopefully.", meta:{ question:"Is this worth fighting for?", shortAnswer:"Is the best version worth the worst moments' cost?", category:"big_picture", icon:"⚔️" }, tags:["universal"], match_score:1 },
    { id:"l19", title:"Why does love feel so hard for me?", body:"Love feels hard when there's a gap between what you believe you deserve and what you actually want. Your sensitivity is the same thing that makes you capable of extraordinary love.", meta:{ question:"Why does love feel so hard for me?", shortAnswer:"You feel the gap between real and performed love.", category:"big_picture", icon:"💙" }, tags:["universal"], match_score:1 },
  ],
};

const CATEGORY_CONFIG: { key: keyof QuestionsResult; label: string; icon: string; color: string }[] = [
  { key: "about_them",  label: "About Them",   icon: "👤", color: "#E85C7A" },
  { key: "about_you",   label: "About You",    icon: "🪞", color: "#B855E0" },
  { key: "what_to_do",  label: "What To Do",   icon: "⚡", color: "#52C8B8" },
  { key: "patterns",    label: "Patterns",     icon: "🔄", color: "#F5A623" },
  { key: "big_picture", label: "Big Picture",  icon: "🔮", color: "#7C52C8" },
];

// ─── Question Answer Sheet ────────────────────────────────────────────────────

function QuestionSheet({
  question,
  onAsk,
  onClose,
}: {
  question: QuestionItem;
  onAsk: (q: string) => void;
  onClose: () => void;
}) {
  const slideAnim = useRef(new Animated.Value(300)).current;
  const fadeAnim  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: 0, duration: 320, useNativeDriver: true }),
      Animated.timing(fadeAnim,  { toValue: 1, duration: 320, useNativeDriver: true }),
    ]).start();
  }, []);

  const close = () => {
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: 300, duration: 220, useNativeDriver: true }),
      Animated.timing(fadeAnim,  { toValue: 0,   duration: 220, useNativeDriver: true }),
    ]).start(onClose);
  };

  return (
    <Animated.View style={[StyleSheet.absoluteFill, { opacity: fadeAnim }]}>
      <Pressable style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(0,0,0,0.6)" }]} onPress={close} />
      <Animated.View style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.sheetHandle} />
        <Text style={styles.sheetQ}>{question.title}</Text>
        <View style={styles.sheetDivider} />
        <Text style={styles.sheetAnswer}>{question.body}</Text>
        <View style={styles.sheetActions}>
          <TouchableOpacity
            onPress={() => { onAsk(question.meta.question ?? question.title); close(); }}
            style={styles.sheetAskBtn}
            activeOpacity={0.85}
          >
            <LinearGradient colors={["#E85C7A","#B855E0"]} start={{x:0,y:0}} end={{x:1,y:0}} style={styles.sheetAskGrad}>
              <Text style={styles.sheetAskText}>Ask Oracle for more</Text>
              <Feather name="arrow-right" size={16} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity onPress={close} style={styles.sheetCloseBtn} activeOpacity={0.7}>
            <Text style={styles.sheetCloseText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Animated.View>
  );
}

// ─── Browse tab ───────────────────────────────────────────────────────────────

function BrowseTab({
  questions,
  onSelectQuestion,
}: {
  questions: QuestionsResult;
  onSelectQuestion: (q: QuestionItem) => void;
}) {
  const [activeCategory, setActiveCategory] = useState<keyof QuestionsResult>("about_them");

  const items = questions[activeCategory] ?? [];

  return (
    <View style={{ flex: 1 }}>
      {/* Category chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.catScroll}
        contentContainerStyle={styles.catContent}
      >
        {CATEGORY_CONFIG.map((cat) => {
          const active = activeCategory === cat.key;
          return (
            <TouchableOpacity
              key={cat.key}
              onPress={() => { setActiveCategory(cat.key); Haptics.selectionAsync(); }}
              style={[styles.catChip, active && { backgroundColor: cat.color + "22", borderColor: cat.color + "55" }]}
              activeOpacity={0.75}
            >
              <Text style={styles.catChipIcon}>{cat.icon}</Text>
              <Text style={[styles.catChipLabel, active && { color: cat.color }]}>{cat.label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Questions list */}
      <FlatList
        data={items}
        keyExtractor={(q) => q.id}
        style={{ flex: 1 }}
        contentContainerStyle={styles.qList}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onSelectQuestion(item); }}
            activeOpacity={0.8}
            style={styles.qCard}
          >
            <LinearGradient colors={["#1A1630","#110F1E"]} style={styles.qCardInner}>
              <Text style={styles.qCardIcon}>{item.meta?.icon ?? "✦"}</Text>
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={styles.qCardTitle}>{item.title}</Text>
                <Text style={styles.qCardShort} numberOfLines={2}>
                  {item.meta?.shortAnswer ?? item.body}
                </Text>
              </View>
              <Feather name="chevron-right" size={16} color="rgba(240,235,248,0.25)" />
            </LinearGradient>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyCategory}>
            <Text style={styles.emptyCategoryText}>Loading personalized questions…</Text>
          </View>
        }
      />
    </View>
  );
}

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
          Animated.timing(dot, { toValue: 1,   duration: 300, useNativeDriver: true }),
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

function MessageBubble({ message }: { message: GuidanceMessage }) {
  const isUser = message.role === "user";
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(isUser ? 12 : -12)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 280, useNativeDriver: true }),
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

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function GuidanceScreen() {
  const insets      = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const { user, partner, guidanceMessages, addGuidanceMessage, clearGuidanceMessages, isPremium } = useApp();

  const [mode,           setMode]           = useState<Mode>("browse");
  const [input,          setInput]          = useState("");
  const [isTyping,       setIsTyping]       = useState(false);
  const [questions,      setQuestions]      = useState<QuestionsResult>(LOCAL_QUESTIONS);
  const [selectedQ,      setSelectedQ]      = useState<QuestionItem | null>(null);
  const flatListRef  = useRef<FlatList>(null);
  const isTypingRef  = useRef(false);
  const userMessages = guidanceMessages.filter((m) => m.role === "user").length;
  const hitLimit     = !isPremium && userMessages >= 5;

  const reading = useMemo(() => {
    if (!user || !partner) return null;
    return getAstrologyReading(user.name, user.birthDate, partner.name, partner.birthDate, user.birthTime);
  }, [user?.birthDate, user?.name, user?.birthTime, partner?.birthDate, partner?.name]);

  const quickChips = useMemo(() =>
    reading && partner ? getPersonalizedChips(reading, partner.relationshipType) : ["Why did they pull away?","Do they miss me?","Should I text?","Why do we fight?","Will it work out?"],
  [reading, partner?.relationshipType]);

  // Fetch personalized questions when reading is ready
  useEffect(() => {
    if (!reading || !partner) return;
    const attrs = extractKundliAttributes(reading, partner.relationshipType);
    const tags = Object.entries(attrs).map(([k, v]) => `${k}:${v}`).filter(Boolean);
    fetchQuestions(tags).then((result) => { if (result) setQuestions(result); });
  }, [reading]);

  useEffect(() => { isTypingRef.current = isTyping; }, [isTyping]);

  const sendMessage = useCallback(async (text: string) => {
    if (!user || !partner) return;
    if (!text.trim() || isTypingRef.current) return;
    if (!isPremium && guidanceMessages.filter((m) => m.role === "user").length >= 5) return;

    // Auto-switch to ask mode when sending
    setMode("ask");

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 5);
    addGuidanceMessage({ id, role: "user", text: text.trim(), timestamp: Date.now() });
    setInput("");
    setIsTyping(true);
    isTypingRef.current = true;

    try {
      const delay = 900 + Math.random() * 800 + text.length * 8;
      await new Promise((r) => setTimeout(r, delay));
      const responseText = getOracleResponse(text, user.name, user.birthDate, partner.name, partner.birthDate, partner.relationshipType);
      addGuidanceMessage({ id: id + "_bot", role: "assistant", text: responseText, timestamp: Date.now() });
    } catch {
      addGuidanceMessage({ id: id + "_bot", role: "assistant", text: "The stars are quiet right now. Ask again in a moment.", timestamp: Date.now() });
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
            <View style={styles.headerOrb}>
              <Text style={styles.headerOrbText}>◉</Text>
            </View>
            <View>
              <Text style={styles.headerTitle}>Guide</Text>
              <Text style={styles.headerSub}>{user.name} · {partner.name}</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            {/* Mode toggle */}
            <View style={styles.modeToggle}>
              <TouchableOpacity
                onPress={() => setMode("browse")}
                style={[styles.modeBtn, mode === "browse" && styles.modeBtnActive]}
              >
                <Text style={[styles.modeBtnText, mode === "browse" && styles.modeBtnTextActive]}>Browse</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setMode("ask")}
                style={[styles.modeBtn, mode === "ask" && styles.modeBtnActive]}
              >
                <Text style={[styles.modeBtnText, mode === "ask" && styles.modeBtnTextActive]}>Ask</Text>
              </TouchableOpacity>
            </View>
            {hasMessages && mode === "ask" && (
              <TouchableOpacity
                onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); clearGuidanceMessages(); }}
                style={styles.clearBtn}
                activeOpacity={0.7}
              >
                <Feather name="trash-2" size={15} color="rgba(240,235,248,0.35)" />
              </TouchableOpacity>
            )}
            {mode === "ask" && (
              <View style={[styles.headerPill, hitLimit && styles.headerPillWarn]}>
                <View style={[styles.headerPillDot, hitLimit && { backgroundColor: "#E85C7A" }]} />
                <Text style={[styles.headerPillText, hitLimit && { color: "#E85C7A" }]}>
                  {isPremium ? "∞" : hitLimit ? "Limit" : `${5 - userMessages}`}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* ── Content ── */}
        {mode === "browse" ? (
          <BrowseTab questions={questions} onSelectQuestion={setSelectedQ} />
        ) : (
          <>
            {!hasMessages ? (
              /* Empty ask state */
              <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={[styles.emptyScroll, { paddingBottom: tabBarHeight + 80 }]}
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.emptyAsk}>
                  <LinearGradient
                    colors={["rgba(232,92,122,0.15)", "rgba(184,85,224,0.08)", "transparent"]}
                    style={styles.oracleOrb}
                  >
                    <Text style={styles.oracleGlyph}>◉</Text>
                  </LinearGradient>
                  <Text style={styles.oracleLabel}>ORACLE</Text>
                  <Text style={styles.emptyTitle}>What's on your mind?</Text>
                  <Text style={styles.emptySub}>Ask anything about this connection.{"\n"}Your answers are read from the stars.</Text>
                  <View style={styles.emptyChips}>
                    {quickChips.slice(0, 4).map((chip, i) => (
                      <TouchableOpacity key={i} onPress={() => sendMessage(chip)} style={styles.emptyChip} activeOpacity={0.75}>
                        <Text style={styles.emptyChipText}>{chip}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
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
                renderItem={({ item }) => <MessageBubble message={item} />}
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
          </>
        )}

        {/* ── Input area ── */}
        <View style={[styles.inputArea, { paddingBottom: tabBarHeight + (Platform.OS === "web" ? 30 : 12) }]}>
          {mode === "ask" && hasMessages && !hitLimit && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll} contentContainerStyle={styles.chipsContent}>
              {quickChips.map((chip, i) => (
                <TouchableOpacity key={i} onPress={() => sendMessage(chip)} disabled={isTyping} style={[styles.chip, isTyping && { opacity: 0.4 }]} activeOpacity={0.75}>
                  <Text style={styles.chipText}>{chip}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
          <View style={styles.inputRow}>
            <TextInput
              style={styles.inputField}
              value={input}
              onChangeText={setInput}
              placeholder={
                mode === "browse" ? "Ask a question or browse above…"
                : hitLimit ? "Upgrade for more guidance"
                : isTyping ? "Reading your chart…"
                : "Ask about this connection…"
              }
              placeholderTextColor="rgba(240,235,248,0.22)"
              editable={!hitLimit && !isTyping}
              multiline
              maxLength={300}
              onSubmitEditing={() => sendMessage(input)}
              onFocus={() => { if (mode === "browse") setMode("ask"); }}
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
              <LinearGradient colors={["#E85C7A","#B855E0"]} style={styles.sendBtnGrad}>
                <Feather name="send" size={15} color="#fff" />
              </LinearGradient>
            </Pressable>
          </View>
        </View>

      </KeyboardAvoidingView>

      {/* ── Question answer sheet ── */}
      {selectedQ && (
        <QuestionSheet
          question={selectedQ}
          onAsk={(q) => { sendMessage(q); }}
          onClose={() => setSelectedQ(null)}
        />
      )}
    </LinearGradient>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  // Header
  header: { paddingHorizontal: 20, paddingBottom: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", borderBottomWidth: 1, borderBottomColor: "rgba(240,235,248,0.05)" },
  headerLeft:    { flexDirection: "row", alignItems: "center", gap: 12 },
  headerOrb:     { width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(232,92,122,0.1)", borderWidth: 1, borderColor: "rgba(232,92,122,0.25)", alignItems: "center", justifyContent: "center" },
  headerOrbText: { fontSize: 15, color: "#E85C7A" },
  headerTitle:   { fontSize: 18, fontFamily: "Nunito_700Bold", color: "#F0EBF8" },
  headerSub:     { fontSize: 11, fontFamily: "Nunito_400Regular", color: "rgba(240,235,248,0.35)", marginTop: 1 },
  headerRight:   { flexDirection: "row", alignItems: "center", gap: 8 },

  // Mode toggle
  modeToggle:      { flexDirection: "row", backgroundColor: "rgba(26,22,48,0.8)", borderRadius: 10, padding: 3, gap: 2 },
  modeBtn:         { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 7, alignItems: "center" },
  modeBtnActive:   { backgroundColor: "#1E1A30" },
  modeBtnText:     { fontSize: 12, fontFamily: "Nunito_600SemiBold", color: "rgba(240,235,248,0.35)" },
  modeBtnTextActive:{ color: "#F0EBF8" },

  clearBtn: { width: 30, height: 30, borderRadius: 15, backgroundColor: "rgba(240,235,248,0.06)", alignItems: "center", justifyContent: "center" },
  headerPill: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "rgba(124,82,200,0.12)", borderWidth: 1, borderColor: "rgba(124,82,200,0.25)", borderRadius: 14, paddingHorizontal: 9, paddingVertical: 5 },
  headerPillWarn: { backgroundColor: "rgba(232,92,122,0.1)", borderColor: "rgba(232,92,122,0.25)" },
  headerPillDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: "#B855E0" },
  headerPillText: { fontSize: 11, fontFamily: "Nunito_600SemiBold", color: "#B855E0" },

  // Browse
  catScroll:  { flexGrow: 0, maxHeight: 50 },
  catContent: { paddingHorizontal: 16, paddingVertical: 8, gap: 8 },
  catChip:    { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, backgroundColor: "rgba(26,22,48,0.6)", borderWidth: 1, borderColor: "rgba(240,235,248,0.08)" },
  catChipIcon: { fontSize: 14 },
  catChipLabel:{ fontSize: 13, fontFamily: "Nunito_500Medium", color: "rgba(240,235,248,0.45)" },

  qList: { paddingHorizontal: 16, paddingTop: 10, gap: 10, paddingBottom: 20 },
  qCard: { borderRadius: 16, overflow: "hidden", borderWidth: 1, borderColor: "rgba(240,235,248,0.06)" },
  qCardInner: { flexDirection: "row", alignItems: "center", gap: 12, padding: 16 },
  qCardIcon:  { fontSize: 22, width: 32, textAlign: "center" },
  qCardTitle: { fontSize: 14, fontFamily: "Nunito_600SemiBold", color: "#F0EBF8", lineHeight: 20 },
  qCardShort: { fontSize: 12, fontFamily: "Nunito_400Regular", color: "rgba(240,235,248,0.45)", lineHeight: 18 },
  emptyCategory: { paddingTop: 40, alignItems: "center" },
  emptyCategoryText: { fontSize: 14, fontFamily: "Nunito_400Regular", color: "rgba(240,235,248,0.3)" },

  // Question sheet
  sheet:       { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "#110F1E", borderTopLeftRadius: 24, borderTopRightRadius: 24, borderTopWidth: 1, borderColor: "rgba(240,235,248,0.08)", padding: 24, paddingBottom: 48, gap: 14 },
  sheetHandle: { width: 36, height: 4, borderRadius: 2, backgroundColor: "rgba(240,235,248,0.12)", alignSelf: "center", marginBottom: 6 },
  sheetQ:      { fontSize: 20, fontFamily: "Nunito_700Bold", color: "#F0EBF8", lineHeight: 28 },
  sheetDivider:{ height: 1, backgroundColor: "rgba(240,235,248,0.07)" },
  sheetAnswer: { fontSize: 15, fontFamily: "Nunito_400Regular", color: "rgba(240,235,248,0.8)", lineHeight: 24 },
  sheetActions:{ gap: 10 },
  sheetAskBtn: { borderRadius: 14, overflow: "hidden" },
  sheetAskGrad:{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 15 },
  sheetAskText:{ fontSize: 15, fontFamily: "Nunito_700Bold", color: "#fff" },
  sheetCloseBtn:{ alignItems: "center", paddingVertical: 10 },
  sheetCloseText:{ fontSize: 14, fontFamily: "Nunito_400Regular", color: "rgba(240,235,248,0.3)" },

  // Ask (messages)
  emptyScroll:  { flexGrow: 1, paddingHorizontal: 20 },
  emptyAsk:     { paddingTop: 24, gap: 16, alignItems: "center" },
  oracleOrb:    { width: 80, height: 80, borderRadius: 40, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "rgba(232,92,122,0.15)" },
  oracleGlyph:  { fontSize: 32, color: "#E85C7A" },
  oracleLabel:  { fontSize: 10, fontFamily: "Nunito_700Bold", color: "rgba(232,92,122,0.4)", letterSpacing: 3 },
  emptyTitle:   { fontSize: 22, fontFamily: "Nunito_700Bold", color: "#F0EBF8" },
  emptySub:     { fontSize: 14, fontFamily: "Nunito_400Regular", color: "rgba(240,235,248,0.4)", textAlign: "center", lineHeight: 22 },
  emptyChips:   { flexDirection: "row", flexWrap: "wrap", gap: 8, justifyContent: "center", marginTop: 4 },
  emptyChip:    { backgroundColor: "rgba(26,22,48,0.8)", borderWidth: 1, borderColor: "rgba(184,85,224,0.2)", borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 },
  emptyChipText:{ fontSize: 13, fontFamily: "Nunito_400Regular", color: "rgba(240,235,248,0.55)" },

  messageList:  { paddingHorizontal: 16, paddingTop: 16, gap: 14 },
  bubbleRow:    { flexDirection: "row", gap: 10, alignItems: "flex-end" },
  bubbleRowUser:{ justifyContent: "flex-end" },
  bubbleRowBot: { justifyContent: "flex-start" },
  botAvatar:    { width: 30, height: 30, borderRadius: 15, backgroundColor: "rgba(232,92,122,0.1)", borderWidth: 1, borderColor: "rgba(232,92,122,0.25)", alignItems: "center", justifyContent: "center", flexShrink: 0, marginBottom: 2 },
  botAvatarText:{ fontSize: 12, color: "#E85C7A" },
  bubble:       { maxWidth: "80%", borderRadius: 18, padding: 14, gap: 6 },
  bubbleUser:   { backgroundColor: "rgba(232,92,122,0.12)", borderWidth: 1, borderColor: "rgba(232,92,122,0.22)", borderBottomRightRadius: 5 },
  bubbleBot:    { backgroundColor: "#141128", borderWidth: 1, borderColor: "rgba(240,235,248,0.07)", borderBottomLeftRadius: 5 },
  botLabel:     { marginBottom: 2 },
  botLabelText: { fontSize: 10, fontFamily: "Nunito_600SemiBold", color: "rgba(232,92,122,0.5)", letterSpacing: 0.5, textTransform: "uppercase" },
  bubbleText:   { lineHeight: 24 },
  bubbleTextUser:{ fontSize: 15, fontFamily: "Nunito_400Regular", color: "#F0EBF8" },
  bubbleTextBot: { fontSize: 15, fontFamily: "Nunito_400Regular", color: "rgba(240,235,248,0.88)" },

  typingRow:    { flexDirection: "row", gap: 10, alignItems: "flex-end", paddingHorizontal: 16, paddingTop: 4 },
  typingBubble: { backgroundColor: "#141128", borderRadius: 18, borderBottomLeftRadius: 5, borderWidth: 1, borderColor: "rgba(240,235,248,0.07)", paddingHorizontal: 18, paddingVertical: 14, flexDirection: "row", gap: 6, alignItems: "center" },
  typingDot:    { width: 7, height: 7, borderRadius: 3.5, backgroundColor: "#E85C7A" },

  limitCard:    { flexDirection: "row", alignItems: "center", gap: 14, marginHorizontal: 16, marginTop: 14, backgroundColor: "rgba(232,92,122,0.06)", borderWidth: 1, borderColor: "rgba(232,92,122,0.18)", borderRadius: 16, padding: 16 },
  limitIcon:    { fontSize: 22, color: "#E85C7A" },
  limitTitle:   { fontSize: 14, fontFamily: "Nunito_700Bold", color: "#F0EBF8" },
  limitSub:     { fontSize: 12, fontFamily: "Nunito_400Regular", color: "rgba(240,235,248,0.4)", marginTop: 2 },

  // Input area
  inputArea:    { paddingHorizontal: 16, paddingTop: 10, borderTopWidth: 1, borderTopColor: "rgba(240,235,248,0.05)", gap: 10, backgroundColor: "rgba(8,6,17,0.96)" },
  chipsScroll:  { flexGrow: 0 },
  chipsContent: { gap: 8, paddingRight: 8 },
  chip:         { backgroundColor: "rgba(26,22,48,0.8)", borderWidth: 1, borderColor: "rgba(184,85,224,0.2)", borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 },
  chipText:     { fontSize: 13, fontFamily: "Nunito_400Regular", color: "rgba(240,235,248,0.55)" },
  inputRow:     { flexDirection: "row", gap: 10, alignItems: "flex-end" },
  inputField:   { flex: 1, backgroundColor: "#141128", borderWidth: 1, borderColor: "rgba(240,235,248,0.08)", borderRadius: 16, paddingHorizontal: 16, paddingTop: 13, paddingBottom: 13, fontSize: 15, fontFamily: "Nunito_400Regular", color: "#F0EBF8", maxHeight: 100 },
  sendBtn:      { borderRadius: 14, overflow: "hidden" },
  sendBtnGrad:  { width: 46, height: 46, alignItems: "center", justifyContent: "center" },
});
