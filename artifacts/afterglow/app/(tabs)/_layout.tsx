import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Redirect, Tabs } from "expo-router";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";

export default function TabLayout() {
  const isWeb = Platform.OS === "web";
  const { isAuthenticated, isAuthLoading } = useAuth();
  const { hasCompletedOnboarding, isLoading: appLoading } = useApp();
  const c = useColors();

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
        tabBarActiveTintColor: c.primary,
        tabBarInactiveTintColor: c.textFaint,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: c.card,
          borderTopWidth: 1,
          borderTopColor: c.borderLight,
          elevation: 16,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.07,
          shadowRadius: 16,
          height: isWeb ? 64 : undefined,
          paddingBottom: isWeb ? 8 : undefined,
        },
        tabBarBackground: () =>
          isWeb ? (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: c.card }]} />
          ) : null,
        tabBarLabelStyle: {
          fontSize: 10,
          fontFamily: "PlusJakartaSans_600SemiBold",
          letterSpacing: 0.2,
          marginTop: 2,
        },
        tabBarItemStyle: {
          paddingVertical: 6,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Feather name="home" size={21} color={color} />,
        }}
      />
      <Tabs.Screen
        name="together"
        options={{
          title: "Daily",
          tabBarIcon: ({ color }) => <Feather name="sun" size={21} color={color} />,
        }}
      />
      <Tabs.Screen
        name="compatibility"
        options={{
          title: "Us",
          tabBarIcon: ({ color }) => <Feather name="heart" size={21} color={color} />,
        }}
      />
      <Tabs.Screen
        name="patterns"
        options={{
          title: "Patterns",
          tabBarIcon: ({ color }) => <Feather name="layers" size={21} color={color} />,
        }}
      />
      <Tabs.Screen
        name="features"
        options={{
          title: "Insights",
          tabBarIcon: ({ color }) => <Feather name="zap" size={21} color={color} />,
        }}
      />
      <Tabs.Screen
        name="guidance"
        options={{
          title: "Ask",
          tabBarIcon: ({ color }) => <Feather name="message-circle" size={21} color={color} />,
        }}
      />
      <Tabs.Screen
        name="astrology"
        options={{ href: null }}
      />
    </Tabs>
  );
}
