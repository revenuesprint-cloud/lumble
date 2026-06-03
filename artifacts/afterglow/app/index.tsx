import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const { isLoading, hasCompletedOnboarding } = useApp();
  const { isAuthLoading, isAuthenticated } = useAuth();

  if (isLoading || isAuthLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: "#080611", alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator color="#E85C7A" size="large" />
      </View>
    );
  }

  // If authenticated and has profile → home
  if (isAuthenticated && hasCompletedOnboarding) {
    return <Redirect href="/(tabs)/home" />;
  }

  // Has a profile but not authenticated → login
  if (!isAuthenticated && hasCompletedOnboarding) {
    return <Redirect href="/login" />;
  }

  // No profile yet → onboarding
  return <Redirect href="/onboarding" />;
}
