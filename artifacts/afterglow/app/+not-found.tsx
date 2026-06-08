import { Stack, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <LinearGradient colors={["#080611", "#0D0A1E", "#110818"]} style={styles.container}>
        <Text style={styles.emoji}>✦</Text>
        <Text style={styles.title}>Page not found</Text>
        <Text style={styles.sub}>This screen doesn't exist.</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.8}>
          <Feather name="arrow-left" size={16} color="#E85C7A" />
          <Text style={styles.backText}>Go back</Text>
        </TouchableOpacity>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    gap: 10,
  },
  emoji: {
    fontSize: 36,
    color: "rgba(232,92,122,0.5)",
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontFamily: "PlusJakartaSans_700Bold",
    color: "#F0EBF8",
  },
  sub: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans_400Regular",
    color: "rgba(240,235,248,0.4)",
    marginBottom: 8,
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(232,92,122,0.25)",
    backgroundColor: "rgba(232,92,122,0.06)",
    marginTop: 8,
  },
  backText: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans_600SemiBold",
    color: "#E85C7A",
  },
});
