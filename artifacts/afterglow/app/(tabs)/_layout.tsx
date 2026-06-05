import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Redirect, Tabs } from "expo-router";
import { SymbolView } from "expo-symbols";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";

export default function TabLayout() {
  const isIOS = Platform.OS === "ios";
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
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#E85C7A",
        tabBarInactiveTintColor: "rgba(240,235,248,0.3)",
        tabBarStyle: {
          position: "absolute",
          backgroundColor: isIOS ? "transparent" : "#080611",
          borderTopWidth: 1,
          borderTopColor: "rgba(240,235,248,0.07)",
          elevation: 0,
          ...(isWeb ? { height: 64, paddingBottom: 8 } : {}),
        },
        tabBarBackground: () =>
          isIOS ? (
            <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />
          ) : isWeb ? (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: "#080611" }]} />
          ) : null,
        tabBarLabelStyle: {
          fontSize: 10,
          fontFamily: "Nunito_500Medium",
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="house" tintColor={color} size={22} />
            ) : (
              <Feather name="home" size={22} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="compatibility"
        options={{
          title: "Chemistry",
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="heart" tintColor={color} size={22} />
            ) : (
              <Feather name="heart" size={22} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="astrology"
        options={{
          title: "Stars",
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="sparkles" tintColor={color} size={22} />
            ) : (
              <Feather name="star" size={22} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="features"
        options={{
          title: "Insights",
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="bolt.fill" tintColor={color} size={22} />
            ) : (
              <Feather name="zap" size={22} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="guidance"
        options={{
          title: "Guide",
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="bubble.left" tintColor={color} size={22} />
            ) : (
              <Feather name="message-circle" size={22} color={color} />
            ),
        }}
      />
    </Tabs>
  );
}
