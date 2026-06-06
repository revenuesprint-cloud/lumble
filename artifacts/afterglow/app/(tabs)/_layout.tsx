import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Redirect, Tabs } from "expo-router";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";

export default function TabLayout() {
  const isWeb = Platform.OS === "web";
  const { isAuthenticated, isAuthLoading } = useAuth();
  const { hasCompletedOnboarding, isLoading: appLoading } = useApp();

  // Guard: redirect away from tabs if auth state is wrong
  if (!isAuthLoading && !appLoading) {
    if (!isAuthenticated) return <Redirect href="/login" />;
    if (!hasCompletedOnboarding) return <Redirect href="/onboarding" />;
  }

  return (
    <Tabs
      screenListeners={{
        tabPress: () => Haptics.selectionAsync(),
      }}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#E85C7A",
        tabBarInactiveTintColor: "rgba(240,235,248,0.3)",
        tabBarStyle: {
          position: "absolute",
          backgroundColor: "#080611",
          borderTopWidth: 1,
          borderTopColor: "rgba(240,235,248,0.07)",
          elevation: 0,
          ...(isWeb ? { height: 64, paddingBottom: 8 } : {}),
        },
        tabBarBackground: () =>
          isWeb ? (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: "#080611" }]} />
          ) : null,
        tabBarLabelStyle: {
          fontSize: 11,
          fontFamily: "Nunito_600SemiBold",
          letterSpacing: 0.2,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Feather name="home" size={23} color={color} />,
        }}
      />
      <Tabs.Screen
        name="compatibility"
        options={{
          title: "Us",
          tabBarIcon: ({ color }) => <Feather name="heart" size={23} color={color} />,
        }}
      />
      <Tabs.Screen
        name="patterns"
        options={{
          title: "Patterns",
          tabBarIcon: ({ color }) => <Feather name="layers" size={23} color={color} />,
        }}
      />
      <Tabs.Screen
        name="features"
        options={{
          title: "Reads",
          tabBarIcon: ({ color }) => <Feather name="zap" size={23} color={color} />,
        }}
      />
      <Tabs.Screen
        name="guidance"
        options={{
          title: "Ask",
          tabBarIcon: ({ color }) => <Feather name="message-circle" size={23} color={color} />,
        }}
      />
      <Tabs.Screen
        name="astrology"
        options={{ href: null }}
      />
    </Tabs>
  );
}
