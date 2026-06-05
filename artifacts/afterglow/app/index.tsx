import AsyncStorage from "@react-native-async-storage/async-storage";
import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { WELCOME_SEEN_KEY } from "./welcome";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const { isLoading, hasCompletedOnboarding } = useApp();
  const { isAuthLoading, isAuthenticated }    = useAuth();
  const [welcomeSeen, setWelcomeSeen]         = useState<boolean | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(WELCOME_SEEN_KEY).then((v) => setWelcomeSeen(v === "true"));
  }, []);

  if (isLoading || isAuthLoading || welcomeSeen === null) {
    return (
      <View style={{ flex: 1, backgroundColor: "#080611", alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator color="#E85C7A" size="large" />
      </View>
    );
  }

  // Authenticated users always bypass the welcome screen
  if (isAuthenticated && hasCompletedOnboarding)  return <Redirect href="/(tabs)/home" />;
  if (isAuthenticated && !hasCompletedOnboarding) return <Redirect href="/onboarding" />;

  // Unauthenticated: show welcome on very first launch, login after that
  if (!welcomeSeen) return <Redirect href="/welcome" />;
  return <Redirect href="/login" />;
}
