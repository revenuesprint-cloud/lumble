import { GuidanceMessage, useApp } from "@/context/AppContext";
import { getAstrologyReading } from "@/utils/astrology";
import { extractKundliAttributes } from "@/utils/challenges";
import { fetchQuestions, type QuestionsResult, type QuestionItem } from "@/utils/dbContent";
import { getOracleResponse, getIntentFromMessage, FOLLOW_UP_SUGGESTIONS } from "@/utils/oracle";
import { getPersonalizedChips } from "@/utils/personalization";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  Image,
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

const FREE_MESSAGE_LIMIT = 10;

type Mode = "browse" | "ask";

// ─── Local fallback questions ─────────────────────────────────────────────────

const LOCAL_QUESTIONS: QuestionsResult = {
  about_them: [
    { id:"l1", title:"Do they actually want me or just the attention?", body:"There is a real difference between someone who wants you and someone who wants what you give them. The clearest signal is how they show up when it costs them something. Not in the easy moments. When it is inconvenient.", meta:{ question:"Do they actually want me or just the attention?", shortAnswer:"Look at what they do when it costs them something.", category:"about_them", icon:"💭" }, tags:["universal"], match_score:1 },
    { id:"l2", title:"Why do they go hot and cold?", body:"Hot and cold is almost always someone who is genuinely drawn to you but terrified of what that means for them. They move closer when fear drops. They pull back when it rises. It is not about your worth. It is about their internal conflict.", meta:{ question:"Why do they go hot and cold?", shortAnswer:"Attracted but scared of what that means.", category:"about_them", icon:"🌡️" }, tags:["universal"], match_score:1 },
    { id:"l3", title:"Why do they treat me like an option and not a priority?", body:"People treat you the way they believe you will accept. If you have accepted being an option, they have no reason to change that. The only shift that works is making your expectations clear and then actually acting on them.", meta:{ question:"Why do they treat me like an option and not a priority?", shortAnswer:"People rise to what you require of them.", category:"about_them", icon:"📉" }, tags:["universal"], match_score:1 },
    { id:"l4", title:"Do they miss me?", body:"Yes. But missing you and being ready to do something about it are completely different things. You can be on someone's mind every day and still not be someone they choose. The question that matters more is what you would do with a yes.", meta:{ question:"Do they miss me?", shortAnswer:"Yes, but missing you does not mean choosing you.", category:"about_them", icon:"🔍" }, tags:["universal"], match_score:1 },
    { id:"l5", title:"Are they talking to someone else?", body:"This question usually gets asked when your instincts are already telling you something. Your gut is not always right but it is rarely completely wrong. What specific behaviour triggered this question? That data matters more than any answer you can be given.", meta:{ question:"Are they talking to someone else?", shortAnswer:"Your instincts noticed something. What specifically?", category:"about_them", icon:"👁️" }, tags:["universal"], match_score:1 },
  ],
  about_you: [
    { id:"l6", title:"Am I too needy?", body:"Needing connection is not the same as being needy. Needy means you require constant reassurance because you do not trust that you are wanted. The real question is whether your needs are reasonable or whether you are asking one person to fill something that needs to come from inside you.", meta:{ question:"Am I too needy?", shortAnswer:"Needing love is normal. Requiring constant proof of it is the thing to look at.", category:"about_you", icon:"🪞" }, tags:["universal"], match_score:1 },
    { id:"l7", title:"Why do I always feel like I care more?", body:"Sometimes you do care more and you are just right about that. Other times you care equally but your styles are so different that theirs is invisible. The way to know which it is: does their care show up in how they treat you when it costs them something, or only when it is easy?", meta:{ question:"Why do I always feel like I care more?", shortAnswer:"Sometimes you are right. Sometimes their care just looks different.", category:"about_you", icon:"⚖️" }, tags:["universal"], match_score:1 },
    { id:"l8", title:"Why can I not stop thinking about them?", body:"Your attachment is real and your nervous system is trying to resolve something that never got a clean ending. The thoughts are not weakness. They are your brain looking for a conclusion. The only way through is to give the story an ending yourself, not to wait for one from them.", meta:{ question:"Why can I not stop thinking about them?", shortAnswer:"Your brain needs a conclusion. You have to write it yourself.", category:"about_you", icon:"🌀" }, tags:["universal"], match_score:1 },
    { id:"l9", title:"Am I worthy of real love?", body:"Yes. That is the answer. But asking this question means somewhere you were taught that love is something you earn rather than something you receive. That belief runs your relationships more than any feeling you have for any specific person. That is the actual thing to look at.", meta:{ question:"Am I worthy of real love?", shortAnswer:"Yes. But the fact that you are asking shows where the real work is.", category:"about_you", icon:"💙" }, tags:["universal"], match_score:1 },
    { id:"l10", title:"Why do I self-sabotage when things are finally going well?", body:"When things feel good in a relationship and you find yourself creating distance or problems, you are not broken. You are reacting to an unconscious belief that good things do not last for you. Closeness is triggering your fear of loss before the loss has even happened.", meta:{ question:"Why do I self-sabotage when things are finally going well?", shortAnswer:"Closeness triggers fear of losing what you finally have.", category:"about_you", icon:"🔥" }, tags:["universal"], match_score:1 },
  ],
  what_to_do: [
    { id:"l11", title:"Should I reach out?", body:"Only if you have something real to say. Not to test them. Not to see if they will respond. Not because you cannot stand the silence. If you have a genuine thing to communicate, say it directly. If the real goal is just to feel close again, that answer does not come from a text.", meta:{ question:"Should I reach out?", shortAnswer:"Only if you have something real to say.", category:"what_to_do", icon:"📲" }, tags:["universal"], match_score:1 },
    { id:"l12", title:"How do I stop overthinking everything?", body:"Overthinking is anxiety wearing the clothes of logic. You are not trying to figure something out. You are trying to feel safe. The only thing that interrupts it is action: ask the question, say the thing, make the decision. Staying in your head is just a way of avoiding the answer you are afraid of.", meta:{ question:"How do I stop overthinking everything?", shortAnswer:"Overthinking is avoiding an answer you are scared of.", category:"what_to_do", icon:"🧠" }, tags:["universal"], match_score:1 },
    { id:"l13", title:"Should I tell them how I feel?", body:"Yes, if you have been holding it and it is affecting how you show up. Say it simply, without making it a test or an ultimatum. The point is not to get the response you want. The point is to stop carrying something alone that deserves to be said.", meta:{ question:"Should I tell them how I feel?", shortAnswer:"Yes. Say it without an ultimatum.", category:"what_to_do", icon:"💬" }, tags:["universal"], match_score:1 },
    { id:"l14", title:"How do I walk away from someone I still love?", body:"You do not wait until you stop loving them. You walk away when you accept that loving someone and being right for each other are different things. The love does not have to go away for the decision to be right. You can grieve someone you chose to leave.", meta:{ question:"How do I walk away from someone I still love?", shortAnswer:"You do not wait until you stop loving them.", category:"what_to_do", icon:"🕊️" }, tags:["universal"], match_score:1 },
  ],
  patterns: [
    { id:"l15", title:"Is this love or am I just attached?", body:"Real love wants what is best for the other person even when that costs you something. Attachment wants them present regardless of whether it is good for either of you. The test is simple: do you want them to be happy, or do you want them to be yours? They are not always the same thing.", meta:{ question:"Is this love or am I just attached?", shortAnswer:"Do you want them happy or just present?", category:"patterns", icon:"🔬" }, tags:["universal"], match_score:1 },
    { id:"l16", title:"Why does this keep hurting but I cannot leave?", body:"Unpredictable rewards create stronger attachment than consistent ones. The moments when it is good feel extraordinary precisely because of the uncertainty around them. Your brain has learned to call that intensity love. That is not a personal failing. It is a pattern, and patterns can change.", meta:{ question:"Why does this keep hurting but I cannot leave?", shortAnswer:"Unpredictable rewards create the strongest attachment.", category:"patterns", icon:"💊" }, tags:["universal"], match_score:1 },
    { id:"l17", title:"Am I repeating the same relationship with different people?", body:"If you keep ending up in the same dynamic with different people, the common factor is the pattern you carry, not the people you choose. What feels familiar is not always what is good. Sometimes familiar is just the version of love you learned to recognise first.", meta:{ question:"Am I repeating the same relationship with different people?", shortAnswer:"The common factor is the pattern, not the people.", category:"patterns", icon:"🔄" }, tags:["universal"], match_score:1 },
  ],
  big_picture: [
    { id:"l18", title:"Will I ever find someone who actually stays?", body:"Yes. But the question underneath that one is usually: am I the kind of person that someone who is right for me would choose? That is different from asking whether you are enough. It is asking whether you are showing up in a way that is honest about what you actually want.", meta:{ question:"Will I ever find someone who actually stays?", shortAnswer:"Yes. The question is whether you are showing up honestly.", category:"big_picture", icon:"⭐" }, tags:["universal"], match_score:1 },
    { id:"l19", title:"Why is love always this hard for me?", body:"Love feels hard when there is a gap between what you believe you deserve and what you actually want. If part of you believes you have to earn love, then every relationship becomes a test you are always afraid of failing. That belief is the thing to address. Not the relationship.", meta:{ question:"Why is love always this hard for me?", shortAnswer:"The gap between what you believe you deserve and what you want.", category:"big_picture", icon:"💙" }, tags:["universal"], match_score:1 },
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

function QuestionSheet({ question, onAsk, onClose }: { question: QuestionItem; onAsk: (q: string) => void; onClose: () => void }) {
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
    <Animated.View style={[StyleSheet.absoluteFill, { opacity: fadeAnim, zIndex: 50, elevation: 50 }]}>
      <Pressable style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(0,0,0,0.65)" }]} onPress={close} />
      <Animated.View style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.sheetHandle} />
        <Text style={styles.sheetQ}>{question.title}</Text>
        <View style={styles.sheetDivider} />
        <Text style={styles.sheetAnswer}>{question.body}</Text>
        <View style={styles.sheetActions}>
          <TouchableOpacity onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); onAsk(question.meta.question ?? question.title); close(); }} style={styles.sheetAskBtn} activeOpacity={0.85}>
            <LinearGradient colors={["#E85C7A","#B855E0"]} start={{x:0,y:0}} end={{x:1,y:0}} style={styles.sheetAskGrad}>
              <Text style={styles.sheetAskText}>Ask the Guide for more</Text>
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

function BrowseTab({ questions, onSelectQuestion }: { questions: QuestionsResult; onSelectQuestion: (q: QuestionItem) => void }) {
  const [activeCategory, setActiveCategory] = useState<keyof QuestionsResult>("about_them");
  const items = questions[activeCategory] ?? [];

  return (
    <View style={{ flex: 1 }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll} contentContainerStyle={styles.catContent}>
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
                <Text style={styles.qCardShort} numberOfLines={2}>{item.meta?.shortAnswer ?? item.body}</Text>
              </View>
              <Feather name="chevron-right" size={16} color="rgba(240,235,248,0.25)" />
            </LinearGradient>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<View style={styles.emptyCategory}><Text style={styles.emptyCategoryText}>Loading your questions...</Text></View>}
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
      <Image source={require("../../assets/images/logo.png")} style={styles.botAvatar} resizeMode="cover" />
      <View style={styles.typingBubble}>
        {dots.map((dot, i) => (
          <Animated.View key={i} style={[styles.typingDot, { opacity: dot }]} />
        ))}
      </View>
    </View>
  );
}

// ─── Streaming message bubble ─────────────────────────────────────────────────

function StreamingBubble({ text, onDone }: { text: string; onDone: () => void }) {
  const [displayed, setDisplayed] = useState("");
  const indexRef  = useRef(0);
  const doneRef   = useRef(false);
  const fadeAnim  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    // Stream character by character (~18ms per char, feels like real AI typing)
    const chars = text.split("");
    const timer = setInterval(() => {
      if (indexRef.current >= chars.length) {
        clearInterval(timer);
        if (!doneRef.current) { doneRef.current = true; onDone(); }
        return;
      }
      // Reveal in small chunks (3 chars at a time) for smoother feel
      const end = Math.min(indexRef.current + 3, chars.length);
      indexRef.current = end;
      setDisplayed(chars.slice(0, end).join(""));
    }, 18);
    return () => clearInterval(timer);
  }, []);

  const cursorBlink = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(cursorBlink, { toValue: 0, duration: 500, useNativeDriver: true }),
        Animated.timing(cursorBlink, { toValue: 1, duration: 500, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const isDone = displayed.length >= text.length;

  return (
    <Animated.View style={[styles.bubbleRow, styles.bubbleRowBot, { opacity: fadeAnim }]}>
      <Image source={require("../../assets/images/logo.png")} style={styles.botAvatar} resizeMode="cover" />
      <View style={[styles.bubble, styles.bubbleBot]}>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          <Text style={[styles.bubbleText, styles.bubbleTextBot]}>{displayed}</Text>
          {!isDone && (
            <Animated.View style={[styles.cursor, { opacity: cursorBlink }]} />
          )}
        </View>
      </View>
    </Animated.View>
  );
}

// ─── Structured bot response renderer ────────────────────────────────────────

function StructuredBotContent({ text }: { text: string }) {
  if (!text.startsWith("Insight")) {
    return <Text style={[styles.bubbleText, styles.bubbleTextBot]}>{text}</Text>;
  }

  const sections = text.split("\n\n");
  const insightLines = (sections[0] ?? "").split("\n");
  const insightLabel = insightLines[0] ?? "Insight";
  const insightBody  = insightLines.slice(1).join(" ").trim();

  const actionSection = sections[1] ?? "";
  const actionLines   = actionSection.split("\n");
  const actionLabel   = actionLines[0] ?? "What to do";
  const actionRaw     = actionLines.slice(1).join(" ");
  const actions       = actionRaw.split("✓").map((s) => s.trim()).filter(Boolean);

  return (
    <View style={{ gap: 14 }}>
      <View style={{ gap: 7 }}>
        <Text style={styles.structLabel}>{insightLabel}</Text>
        <Text style={styles.structInsight}>{insightBody}</Text>
      </View>
      <View style={styles.structDivider} />
      <View style={{ gap: 8 }}>
        <Text style={styles.structLabel}>{actionLabel}</Text>
        {actions.map((action, i) => (
          <View key={i} style={styles.structActionRow}>
            <Text style={styles.structCheck}>✓</Text>
            <Text style={styles.structActionText}>{action}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── Static message bubble ────────────────────────────────────────────────────

function MessageBubble({ message }: { message: GuidanceMessage }) {
  const isUser   = message.role === "user";
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim= useRef(new Animated.Value(isUser ? 10 : -10)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 250, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[styles.bubbleRow, isUser ? styles.bubbleRowUser : styles.bubbleRowBot, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      {!isUser && <Image source={require("../../assets/images/logo.png")} style={styles.botAvatar} resizeMode="cover" />}
      <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleBot]}>
        {isUser
          ? <Text style={[styles.bubbleText, styles.bubbleTextUser]}>{message.text}</Text>
          : <StructuredBotContent text={message.text} />
        }
      </View>
    </Animated.View>
  );
}

// ─── Follow-up suggestion row ─────────────────────────────────────────────────

function FollowUpRow({ suggestions, onSelect, disabled }: { suggestions: string[]; onSelect: (s: string) => void; disabled: boolean }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, delay: 200, useNativeDriver: true }).start();
  }, []);

  return (
    <Animated.View style={[styles.followUpRow, { opacity: fadeAnim }]}>
      {suggestions.map((s, i) => (
        <TouchableOpacity
          key={i}
          onPress={() => { if (!disabled) { Haptics.selectionAsync(); onSelect(s); } }}
          style={[styles.followUpChip, disabled && { opacity: 0.4 }]}
          activeOpacity={0.75}
          disabled={disabled}
        >
          <Text style={styles.followUpText}>{s}</Text>
        </TouchableOpacity>
      ))}
    </Animated.View>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function GuidanceScreen() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = insets.bottom + 56;
  const { autoSend } = useLocalSearchParams<{ autoSend?: string }>();
  const { user, partner, guidanceMessages, addGuidanceMessage, clearGuidanceMessages, isPremium } = useApp();

  const [mode,         setMode]         = useState<Mode>("browse");
  const [input,        setInput]        = useState("");
  const [isTyping,     setIsTyping]     = useState(false);
  const [questions,    setQuestions]    = useState<QuestionsResult>(LOCAL_QUESTIONS);
  const [selectedQ,    setSelectedQ]    = useState<QuestionItem | null>(null);
  const [streamingId,  setStreamingId]  = useState<string | null>(null);
  const [followUps,    setFollowUps]    = useState<string[]>([]);

  const flatListRef    = useRef<FlatList>(null);
  const isTypingRef    = useRef(false);
  const turnCountRef   = useRef(0);
  const autoSentRef    = useRef(false);

  const userMessages = guidanceMessages.filter((m) => m.role === "user").length;
  const hitLimit     = !isPremium && userMessages >= FREE_MESSAGE_LIMIT;

  const reading = useMemo(() => {
    if (!user || !partner) return null;
    return getAstrologyReading(user.name, user.birthDate, partner.name, partner.birthDate, user.birthTime);
  }, [user?.birthDate, user?.name, user?.birthTime, partner?.birthDate, partner?.name]);

  const quickChips = useMemo(() =>
    reading && partner ? getPersonalizedChips(reading, partner.relationshipType)
    : ["Why did they pull away?","Do they miss me?","Should I text?","Why do we fight?","Will it work out?"],
  [reading, partner?.relationshipType]);

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
    if (!isPremium && guidanceMessages.filter((m) => m.role === "user").length >= FREE_MESSAGE_LIMIT) return;

    setMode("ask");
    setFollowUps([]);

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const id = Date.now().toString() + Math.random().toString(36).slice(2, 7);
    addGuidanceMessage({ id, role: "user", text: text.trim(), timestamp: Date.now() });
    setInput("");
    setIsTyping(true);
    isTypingRef.current = true;

    try {
      // Shorter, more natural delay (600-1200ms)
      const delay = 600 + Math.random() * 600 + Math.min(text.length * 4, 600);
      await new Promise((r) => setTimeout(r, delay));

      turnCountRef.current += 1;
      const responseText = getOracleResponse(
        text, user.name, user.birthDate, partner.name, partner.birthDate,
        partner.relationshipType, turnCountRef.current,
      );
      const botId = id + "_bot";
      addGuidanceMessage({ id: botId, role: "assistant", text: responseText, timestamp: Date.now() });
      setStreamingId(botId);

      // Prepare follow-up suggestions — set immediately. FollowUpRow only
      // renders when !streamingId so they appear naturally when streaming ends.
      const intent = getIntentFromMessage(text);
      const suggestions = FOLLOW_UP_SUGGESTIONS[intent] ?? FOLLOW_UP_SUGGESTIONS["general"] ?? [];
      setFollowUps(suggestions as string[]);
    } catch {
      const botId = id + "_bot";
      addGuidanceMessage({ id: botId, role: "assistant", text: "Something went wrong on my end. Please try asking again.", timestamp: Date.now() });
      setStreamingId(botId);
    } finally {
      setIsTyping(false);
      isTypingRef.current = false;
    }
  }, [user, partner, guidanceMessages, addGuidanceMessage, isPremium]);

  // Auto-send a question that arrived via router params (from home screen chips)
  useEffect(() => {
    if (autoSend && !autoSentRef.current && user && partner) {
      autoSentRef.current = true;
      setTimeout(() => sendMessage(autoSend), 300);
    }
  }, [autoSend, user, partner, sendMessage]);

  if (!user || !partner) return null;

  const hasMessages = guidanceMessages.length > 0;

  return (
    <LinearGradient colors={["#080611", "#0D0A1E"]} style={{ flex: 1 }}>
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }} keyboardVerticalOffset={0}>

        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === "web" ? 67 : 16) }]}>
          <View style={styles.headerLeft}>
            <Image source={require("../../assets/images/logo.png")} style={styles.headerOrb} resizeMode="cover" />
            <View>
              <Text style={styles.headerTitle}>The Guide</Text>
              <Text style={styles.headerSub}>{user.name} & {partner.name}</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.modeToggle}>
              <TouchableOpacity onPress={() => { Haptics.selectionAsync(); setMode("browse"); }} style={[styles.modeBtn, mode === "browse" && styles.modeBtnActive]}>
                <Text style={[styles.modeBtnText, mode === "browse" && styles.modeBtnTextActive]}>Browse</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { Haptics.selectionAsync(); setMode("ask"); }} style={[styles.modeBtn, mode === "ask" && styles.modeBtnActive]}>
                <Text style={[styles.modeBtnText, mode === "ask" && styles.modeBtnTextActive]}>Ask</Text>
              </TouchableOpacity>
            </View>
            {hasMessages && mode === "ask" && (
              <TouchableOpacity
                onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); clearGuidanceMessages(); setFollowUps([]); setStreamingId(null); }}
                style={styles.clearBtn}
                activeOpacity={0.7}
              >
                <Feather name="trash-2" size={15} color="rgba(240,235,248,0.35)" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Content */}
        {mode === "browse" ? (
          <BrowseTab questions={questions} onSelectQuestion={setSelectedQ} />
        ) : (
          <>
            {!hasMessages ? (
              <ScrollView style={{ flex: 1 }} contentContainerStyle={[styles.emptyScroll, { paddingBottom: tabBarHeight + 80 }]} showsVerticalScrollIndicator={false}>
                <View style={styles.emptyAsk}>
                  <Text style={styles.lumbleWordmark}>Lumble</Text>
                  <Text style={styles.emptyTitle}>What's on your mind?</Text>
                  <Text style={styles.emptySub}>Say what you can't bring yourself to say out loud.{"\n"}You'll get an honest answer — no sugarcoating.</Text>
                  <View style={styles.emptyChips}>
                    {quickChips.slice(0, 4).map((chip, i) => (
                      <TouchableOpacity key={i} onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); sendMessage(chip); }} style={styles.emptyChip} activeOpacity={0.75}>
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
                contentContainerStyle={[styles.messageList, { paddingBottom: 16 }]}
                showsVerticalScrollIndicator={false}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                renderItem={({ item, index }) => {
                  const isLastBot = item.role === "assistant" && index === guidanceMessages.length - 1;
                  const shouldStream = isLastBot && item.id === streamingId;

                  if (shouldStream) {
                    return (
                      <StreamingBubble
                        text={item.text}
                        onDone={() => setStreamingId(null)}
                      />
                    );
                  }
                  return <MessageBubble message={item} />;
                }}
                ListFooterComponent={
                  <>
                    {isTyping && <TypingIndicator />}
                    {!isTyping && !streamingId && followUps.length > 0 && (
                      <FollowUpRow
                        suggestions={followUps}
                        onSelect={(s) => { setFollowUps([]); sendMessage(s); }}
                        disabled={hitLimit}
                      />
                    )}
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

        {/* Input area */}
        <View style={[styles.inputArea, { paddingBottom: tabBarHeight + (Platform.OS === "web" ? 30 : 12) }]}>
          {mode === "ask" && hasMessages && !hitLimit && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll} contentContainerStyle={styles.chipsContent}>
              {quickChips.map((chip, i) => (
                <TouchableOpacity key={i} onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); sendMessage(chip); }} disabled={isTyping || !!streamingId} style={[styles.chip, (isTyping || streamingId) && { opacity: 0.4 }]} activeOpacity={0.75}>
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
                mode === "browse" ? "Ask a question or browse above"
                : hitLimit ? "Upgrade to keep asking"
                : isTyping || streamingId ? "Reading the stars..."
                : "Ask about this connection"
              }
              placeholderTextColor="rgba(240,235,248,0.22)"
              editable={!hitLimit && !isTyping && !streamingId}
              multiline
              maxLength={300}
              onSubmitEditing={() => sendMessage(input)}
              onFocus={() => { if (mode === "browse") setMode("ask"); }}
            />
            <Pressable
              onPress={() => sendMessage(input)}
              disabled={!input.trim() || hitLimit || isTyping || !!streamingId}
              style={({ pressed }) => [
                styles.sendBtn,
                (!input.trim() || hitLimit || isTyping || !!streamingId) && { opacity: 0.3 },
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

      {/* Question answer sheet */}
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
  header:        { paddingHorizontal: 20, paddingBottom: 14, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", borderBottomWidth: 1, borderBottomColor: "rgba(240,235,248,0.06)" },
  headerLeft:    { flexDirection: "row", alignItems: "center", gap: 12 },
  headerOrb:     { width: 40, height: 40, borderRadius: 20, overflow: "hidden" },
  headerTitle:   { fontSize: 20, fontFamily: "Nunito_700Bold", color: "#F0EBF8" },
  headerSub:     { fontSize: 13, fontFamily: "Nunito_400Regular", color: "rgba(240,235,248,0.38)", marginTop: 2 },
  headerRight:   { flexDirection: "row", alignItems: "center", gap: 8 },
  modeToggle:    { flexDirection: "row", backgroundColor: "rgba(26,22,48,0.8)", borderRadius: 10, padding: 3, gap: 2 },
  modeBtn:       { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 7, alignItems: "center" },
  modeBtnActive: { backgroundColor: "#1E1A30" },
  modeBtnText:   { fontSize: 12, fontFamily: "Nunito_600SemiBold", color: "rgba(240,235,248,0.35)" },
  modeBtnTextActive: { color: "#F0EBF8" },
  clearBtn:      { width: 30, height: 30, borderRadius: 15, backgroundColor: "rgba(240,235,248,0.06)", alignItems: "center", justifyContent: "center" },
  // Browse
  catScroll:     { flexGrow: 0, maxHeight: 50 },
  catContent:    { paddingHorizontal: 16, paddingVertical: 8, gap: 8 },
  catChip:       { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, backgroundColor: "rgba(26,22,48,0.6)", borderWidth: 1, borderColor: "rgba(240,235,248,0.08)" },
  catChipIcon:   { fontSize: 14 },
  catChipLabel:  { fontSize: 13, fontFamily: "Nunito_500Medium", color: "rgba(240,235,248,0.45)" },
  qList:         { paddingHorizontal: 16, paddingTop: 12, gap: 10, paddingBottom: 20 },
  qCard:         { borderRadius: 18, overflow: "hidden", borderWidth: 1, borderColor: "rgba(240,235,248,0.07)" },
  qCardInner:    { flexDirection: "row", alignItems: "center", gap: 14, padding: 18 },
  qCardIcon:     { fontSize: 24, width: 34, textAlign: "center" },
  qCardTitle:    { fontSize: 16, fontFamily: "Nunito_600SemiBold", color: "#F0EBF8", lineHeight: 22 },
  qCardShort:    { fontSize: 13, fontFamily: "Nunito_400Regular", color: "rgba(240,235,248,0.48)", lineHeight: 19 },
  emptyCategory: { paddingTop: 40, alignItems: "center" },
  emptyCategoryText: { fontSize: 14, fontFamily: "Nunito_400Regular", color: "rgba(240,235,248,0.3)" },
  // Sheet
  sheet:         { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "#110F1E", borderTopLeftRadius: 28, borderTopRightRadius: 28, borderTopWidth: 1, borderColor: "rgba(240,235,248,0.09)", padding: 28, paddingBottom: 52, gap: 16 },
  sheetHandle:   { width: 40, height: 4, borderRadius: 2, backgroundColor: "rgba(240,235,248,0.14)", alignSelf: "center", marginBottom: 8 },
  sheetQ:        { fontSize: 24, fontFamily: "Nunito_700Bold", color: "#F0EBF8", lineHeight: 32 },
  sheetDivider:  { height: 1, backgroundColor: "rgba(240,235,248,0.08)" },
  sheetAnswer:   { fontSize: 17, fontFamily: "Nunito_400Regular", color: "rgba(240,235,248,0.82)", lineHeight: 27 },
  sheetActions:  { gap: 10 },
  sheetAskBtn:   { borderRadius: 14, overflow: "hidden" },
  sheetAskGrad:  { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 15 },
  sheetAskText:  { fontSize: 15, fontFamily: "Nunito_700Bold", color: "#fff" },
  sheetCloseBtn: { alignItems: "center", paddingVertical: 10 },
  sheetCloseText:{ fontSize: 14, fontFamily: "Nunito_400Regular", color: "rgba(240,235,248,0.3)" },
  // Ask empty state
  emptyScroll:   { flexGrow: 1, paddingHorizontal: 20 },
  emptyAsk:      { paddingTop: 28, gap: 18, alignItems: "center" },
  lumbleWordmark: { fontSize: 32, fontFamily: "Nunito_600SemiBold", color: "rgba(232,92,122,0.7)", letterSpacing: 1, marginBottom: 4 },
  emptyTitle:    { fontSize: 26, fontFamily: "Nunito_700Bold", color: "#F0EBF8" },
  emptySub:      { fontSize: 16, fontFamily: "Nunito_400Regular", color: "rgba(240,235,248,0.42)", textAlign: "center", lineHeight: 25 },
  emptyChips:    { flexDirection: "row", flexWrap: "wrap", gap: 9, justifyContent: "center", marginTop: 6 },
  emptyChip:     { backgroundColor: "rgba(26,22,48,0.8)", borderWidth: 1, borderColor: "rgba(184,85,224,0.22)", borderRadius: 22, paddingHorizontal: 16, paddingVertical: 10 },
  emptyChipText: { fontSize: 14, fontFamily: "Nunito_400Regular", color: "rgba(240,235,248,0.58)" },
  // Messages
  messageList:   { paddingHorizontal: 16, paddingTop: 18, gap: 16 },
  bubbleRow:     { flexDirection: "row", gap: 11, alignItems: "flex-end" },
  bubbleRowUser: { justifyContent: "flex-end" },
  bubbleRowBot:  { justifyContent: "flex-start" },
  botAvatar:     { width: 32, height: 32, borderRadius: 16, overflow: "hidden", flexShrink: 0, marginBottom: 2 },
  bubble:        { maxWidth: "80%", borderRadius: 20, padding: 16, gap: 6 },
  bubbleUser:    { backgroundColor: "rgba(232,92,122,0.13)", borderWidth: 1, borderColor: "rgba(232,92,122,0.24)", borderBottomRightRadius: 5 },
  bubbleBot:     { backgroundColor: "#141128", borderWidth: 1, borderColor: "rgba(240,235,248,0.08)", borderBottomLeftRadius: 5 },
  bubbleText:    { lineHeight: 26 },
  bubbleTextUser:{ fontSize: 16, fontFamily: "Nunito_400Regular", color: "#F0EBF8" },
  bubbleTextBot: { fontSize: 16, fontFamily: "Nunito_400Regular", color: "rgba(240,235,248,0.9)" },
  cursor:        { width: 2, height: 18, backgroundColor: "#E85C7A", borderRadius: 1, marginLeft: 1, marginBottom: 1, alignSelf: "flex-end" },
  // Structured bot response
  structLabel:      { fontSize: 11, fontFamily: "Nunito_700Bold", color: "#B855E0", letterSpacing: 0.5, textTransform: "uppercase" },
  structInsight:    { fontSize: 16, fontFamily: "Nunito_400Regular", color: "rgba(240,235,248,0.92)", lineHeight: 25, fontStyle: "italic" },
  structDivider:    { height: 1, backgroundColor: "rgba(240,235,248,0.08)" },
  structActionRow:  { flexDirection: "row", alignItems: "flex-start", gap: 8 },
  structCheck:      { fontSize: 14, color: "#52C8B8", fontFamily: "Nunito_700Bold", marginTop: 1 },
  structActionText: { flex: 1, fontSize: 15, fontFamily: "Nunito_400Regular", color: "rgba(240,235,248,0.82)", lineHeight: 22 },
  // Typing
  typingRow:     { flexDirection: "row", gap: 10, alignItems: "flex-end", paddingHorizontal: 16, paddingTop: 4 },
  typingBubble:  { backgroundColor: "#141128", borderRadius: 18, borderBottomLeftRadius: 5, borderWidth: 1, borderColor: "rgba(240,235,248,0.07)", paddingHorizontal: 18, paddingVertical: 14, flexDirection: "row", gap: 6, alignItems: "center" },
  typingDot:     { width: 7, height: 7, borderRadius: 3.5, backgroundColor: "#E85C7A" },
  // Follow-up suggestions
  followUpRow:   { paddingHorizontal: 16, paddingTop: 6, gap: 7 },
  followUpChip:  { alignSelf: "flex-start", backgroundColor: "rgba(26,22,48,0.9)", borderWidth: 1, borderColor: "rgba(184,85,224,0.25)", borderRadius: 16, paddingHorizontal: 14, paddingVertical: 8 },
  followUpText:  { fontSize: 13, fontFamily: "Nunito_400Regular", color: "rgba(184,85,224,0.8)" },
  // Limit
  limitCard:     { flexDirection: "row", alignItems: "center", gap: 14, marginHorizontal: 16, marginTop: 14, backgroundColor: "rgba(232,92,122,0.06)", borderWidth: 1, borderColor: "rgba(232,92,122,0.18)", borderRadius: 16, padding: 16 },
  limitIcon:     { fontSize: 22, color: "#E85C7A" },
  limitTitle:    { fontSize: 14, fontFamily: "Nunito_700Bold", color: "#F0EBF8" },
  limitSub:      { fontSize: 12, fontFamily: "Nunito_400Regular", color: "rgba(240,235,248,0.4)", marginTop: 2 },
  // Input
  inputArea:     { paddingHorizontal: 16, paddingTop: 12, borderTopWidth: 1, borderTopColor: "rgba(240,235,248,0.06)", gap: 10, backgroundColor: "rgba(8,6,17,0.97)" },
  chipsScroll:   { flexGrow: 0 },
  chipsContent:  { gap: 8, paddingRight: 8 },
  chip:          { backgroundColor: "rgba(26,22,48,0.8)", borderWidth: 1, borderColor: "rgba(184,85,224,0.22)", borderRadius: 22, paddingHorizontal: 16, paddingVertical: 9 },
  chipText:      { fontSize: 13, fontFamily: "Nunito_400Regular", color: "rgba(240,235,248,0.58)" },
  inputRow:      { flexDirection: "row", gap: 10, alignItems: "flex-end" },
  inputField:    { flex: 1, backgroundColor: "#141128", borderWidth: 1, borderColor: "rgba(240,235,248,0.09)", borderRadius: 18, paddingHorizontal: 18, paddingTop: 14, paddingBottom: 14, fontSize: 16, fontFamily: "Nunito_400Regular", color: "#F0EBF8", maxHeight: 110 },
  sendBtn:       { borderRadius: 16, overflow: "hidden" },
  sendBtnGrad:   { width: 48, height: 48, alignItems: "center", justifyContent: "center" },
});
