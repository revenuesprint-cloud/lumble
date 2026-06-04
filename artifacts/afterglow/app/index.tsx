import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const { isLoading, hasCompletedOnboarding } = useApp();
  const { isAuthLoading, isAuthenticated }    = useAuth();

  if (isLoading || isAuthLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: "#080611", alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator color="#E85C7A" size="large" />
      </View>
    );
  }

  // Authenticated + profile complete → home
  if (isAuthenticated && hasCompletedOnboarding) {
    return <Redirect href="/(tabs)/home" />;
  }

  // Authenticated (e.g. just registered) but profile not set up yet → onboarding
  if (isAuthenticated && !hasCompletedOnboarding) {
    return <Redirect href="/onboarding" />;
  }

  // Profile exists but no active session → login
  if (!isAuthenticated && hasCompletedOnboarding) {
    return <Redirect href="/login" />;
  }

  // Brand new user — no session, no profile → login to register or sign in
  return <Redirect href="/login" />;
}
