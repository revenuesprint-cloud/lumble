import { GuidanceMessage, useApp } from "@/context/AppContext";
import { getOracleResponse } from "@/utils/oracle";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
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

const SUGGESTIONS = [
  "Why did they pull away?",
  "Why can't I move on?",
  "Do they still think about me?",
  "Why does this feel addictive?",
  "Why do we misunderstand each other?",
  "Should I reach out?",
];

function MessageBubble({ message }: { message: GuidanceMessage }) {
  const isUser = message.role === "user";
  return (
    <View style={[styles.bubbleRow, isUser ? styles.bubbleRowUser : styles.bubbleRowBot]}>
      {!isUser && (
        <View style={styles.botAvatar}>
          <Text style={styles.botAvatarText}>◉</Text>
        </View>
      )}
      <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleBot]}>
        <Text style={isUser ? styles.bubbleUserText : styles.bubbleBotText}>
          {message.text}
        </Text>
      </View>
    </View>
  );
}

function TypingIndicator() {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateDot = (dot: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(dot, { toValue: 1, duration: 300, delay, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0, duration: 300, useNativeDriver: true }),
          Animated.delay(300),
        ])
      );
    animateDot(dot1, 0).start();
    animateDot(dot2, 200).start();
    animateDot(dot3, 400).start();
  }, []);

  return (
    <View style={styles.typingRow}>
      <View style={styles.botAvatar}>
        <Text style={styles.botAvatarText}>◉</Text>
      </View>
      <View style={styles.typingBubble}>
        {[dot1, dot2, dot3].map((dot, i) => (
          <Animated.View
            key={i}
            style={[
              styles.typingDot,
              {
                opacity: dot,
                transform: [
                  {
                    scale: dot.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.7, 1],
                    }),
                  },
                ],
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

export default function GuidanceScreen() {
  const insets = useSafeAreaInsets();
  const { user, partner, guidanceMessages, addGuidanceMessage, isPremium } = useApp();
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const freeMessageCount = guidanceMessages.filter((m) => m.role === "user").length;
  const hitLimit = !isPremium && freeMessageCount >= 5;

  if (!user || !partner) return null;

  const sendMessage = async (text: string) => {
    if (!text.trim() || hitLimit) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const id = Date.now().toString() + Math.random().toString(36).substr(2, 5);
    const userMsg: GuidanceMessage = {
      id,
      role: "user",
      text: text.trim(),
      timestamp: Date.now(),
    };
    addGuidanceMessage(userMsg);
    setInput("");
    setIsTyping(true);

    await new Promise((r) => setTimeout(r, 1200 + Math.random() * 900));

    const responseText = getOracleResponse(
      text,
      user.name, user.birthDate,
      partner.name, partner.birthDate,
      partner.relationshipType
    );
    const botMsg: GuidanceMessage = {
      id: id + "_bot",
      role: "assistant",
      text: responseText,
      timestamp: Date.now(),
    };
    addGuidanceMessage(botMsg);
    setIsTyping(false);
  };

  const allMessages = [...guidanceMessages];

  const renderEmpty = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>◉</Text>
      <Text style={styles.emptyTitle}>What's on your mind?</Text>
      <Text style={styles.emptySub}>
        Ask anything about this connection. Everything stays private.
      </Text>
      <View style={styles.suggestionsGrid}>
        {SUGGESTIONS.map((s, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => sendMessage(s)}
            style={styles.suggestionChip}
            activeOpacity={0.8}
          >
            <Text style={styles.suggestionText}>{s}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderFooter = () => (
    <>
      {isTyping && <TypingIndicator />}
      {hitLimit && (
        <View style={styles.limitBanner}>
          <Text style={styles.limitText}>
            Upgrade to Premium for unlimited guidance conversations
          </Text>
        </View>
      )}
    </>
  );

  return (
    <LinearGradient colors={["#080611", "#0D0A1E"]} style={{ flex: 1 }}>
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }} keyboardVerticalOffset={0}>
        {/* Header */}
        <View
          style={[
            styles.header,
            { paddingTop: insets.top + (Platform.OS === "web" ? 67 : 16) },
          ]}
        >
          <View>
            <Text style={styles.headerTitle}>Guidance</Text>
            <Text style={styles.headerSub}>Understanding {partner.name}</Text>
          </View>
          <View style={styles.headerTag}>
            <Text style={styles.headerTagText}>
              {isPremium ? "Unlimited" : `${5 - freeMessageCount} left`}
            </Text>
          </View>
        </View>

        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={allMessages}
          keyExtractor={(m) => m.id}
          style={{ flex: 1 }}
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          ListHeaderComponent={allMessages.length === 0 ? renderEmpty() : null}
          ListFooterComponent={renderFooter()}
          renderItem={({ item }) => <MessageBubble message={item} />}
        />

        {/* Input area */}
        <View
          style={[
            styles.inputContainer,
            { paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 12) },
          ]}
        >
          {!hitLimit && allMessages.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ flexGrow: 0 }}
            >
              {SUGGESTIONS.slice(0, 3).map((s, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => sendMessage(s)}
                  style={styles.inputChip}
                  activeOpacity={0.8}
                >
                  <Text style={styles.inputChipText}>{s}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder={hitLimit ? "Upgrade for more" : "Ask about this connection..."}
              placeholderTextColor="rgba(240,235,248,0.25)"
              editable={!hitLimit}
              multiline
              maxLength={300}
            />
            <Pressable
              onPress={() => sendMessage(input)}
              disabled={!input.trim() || hitLimit}
              style={[styles.sendBtn, (!input.trim() || hitLimit) && { opacity: 0.4 }]}
            >
              <LinearGradient
                colors={["#E85C7A", "#B855E0"]}
                style={styles.sendGradient}
              >
                <Feather name="send" size={16} color="#fff" />
              </LinearGradient>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(240,235,248,0.05)",
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
    color: "#F0EBF8",
  },
  headerSub: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: "rgba(240,235,248,0.4)",
    marginTop: 2,
  },
  headerTag: {
    backgroundColor: "rgba(124,82,200,0.15)",
    borderWidth: 1,
    borderColor: "rgba(124,82,200,0.3)",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  headerTagText: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    color: "#B855E0",
  },
  messageList: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    gap: 16,
  },
  bubbleRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-end",
  },
  bubbleRowUser: { justifyContent: "flex-end" },
  bubbleRowBot: { justifyContent: "flex-start" },
  botAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(232,92,122,0.12)",
    borderWidth: 1,
    borderColor: "rgba(232,92,122,0.3)",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  botAvatarText: { fontSize: 14, color: "#E85C7A" },
  bubble: { maxWidth: "78%", borderRadius: 18, padding: 14 },
  bubbleUser: {
    backgroundColor: "rgba(232,92,122,0.18)",
    borderWidth: 1,
    borderColor: "rgba(232,92,122,0.3)",
    borderBottomRightRadius: 4,
  },
  bubbleBot: {
    backgroundColor: "#1A1630",
    borderWidth: 1,
    borderColor: "rgba(240,235,248,0.07)",
    borderBottomLeftRadius: 4,
  },
  bubbleUserText: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    color: "#F0EBF8",
    lineHeight: 22,
  },
  bubbleBotText: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    color: "rgba(240,235,248,0.85)",
    lineHeight: 24,
  },
  typingRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-end",
    paddingTop: 8,
    paddingHorizontal: 16,
  },
  typingBubble: {
    backgroundColor: "#1A1630",
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(240,235,248,0.07)",
    padding: 16,
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
  },
  typingDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: "#E85C7A",
  },
  emptyState: {
    alignItems: "center",
    paddingTop: 40,
    gap: 14,
    paddingHorizontal: 8,
  },
  emptyIcon: { fontSize: 40, color: "#E85C7A" },
  emptyTitle: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    color: "#F0EBF8",
  },
  emptySub: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "rgba(240,235,248,0.45)",
    textAlign: "center",
    lineHeight: 22,
    maxWidth: 280,
  },
  suggestionsGrid: { gap: 8, width: "100%", marginTop: 8 },
  suggestionChip: {
    backgroundColor: "rgba(26,22,48,0.8)",
    borderWidth: 1,
    borderColor: "rgba(240,235,248,0.1)",
    borderRadius: 14,
    padding: 14,
  },
  suggestionText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "rgba(240,235,248,0.7)",
  },
  limitBanner: {
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: "rgba(232,92,122,0.08)",
    borderWidth: 1,
    borderColor: "rgba(232,92,122,0.2)",
    borderRadius: 12,
    padding: 14,
  },
  limitText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: "rgba(232,92,122,0.8)",
    textAlign: "center",
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(240,235,248,0.05)",
    gap: 8,
    backgroundColor: "rgba(8,6,17,0.95)",
  },
  inputChip: {
    backgroundColor: "rgba(26,22,48,0.8)",
    borderWidth: 1,
    borderColor: "rgba(124,82,200,0.25)",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginRight: 8,
  },
  inputChipText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: "rgba(240,235,248,0.6)",
  },
  inputRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-end",
  },
  input: {
    flex: 1,
    backgroundColor: "#1A1630",
    borderWidth: 1,
    borderColor: "rgba(240,235,248,0.08)",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    color: "#F0EBF8",
    maxHeight: 100,
  },
  sendBtn: { borderRadius: 14, overflow: "hidden" },
  sendGradient: {
    width: 46,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
  },
});
