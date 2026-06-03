import { useApp } from "@/context/AppContext";
import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const { isLoading, hasCompletedOnboarding } = useApp();

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: "#080611", alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator color="#E85C7A" size="large" />
      </View>
    );
  }

  if (hasCompletedOnboarding) {
    return <Redirect href="/(tabs)/home" />;
  }

  return <Redirect href="/onboarding" />;
}
