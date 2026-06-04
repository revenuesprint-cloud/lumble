import {
  Nunito_400Regular,
  Nunito_500Medium,
  Nunito_600SemiBold,
  Nunito_700Bold,
  useFonts,
} from "@expo-google-fonts/nunito";
import { CommonActions } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AppProvider, useApp } from "@/context/AppContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { useNavigation } from "@react-navigation/native";

SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({ fade: true });

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Screens where unauthenticated / pre-onboarded users are allowed
const UNPROTECTED = new Set(["login", "onboarding", "index", "+not-found"]);

function AuthGuard() {
  const { isAuthenticated, isAuthLoading } = useAuth();
  const { hasCompletedOnboarding, isLoading: appLoading } = useApp();
  const segments = useSegments();
  const navigation = useNavigation();

  useEffect(() => {
    // Wait for both contexts to finish loading before making any routing decision
    if (isAuthLoading || appLoading) return;

    const seg = segments[0] as string | undefined;
    const onUnprotected = !seg || UNPROTECTED.has(seg);
    if (onUnprotected) return;

    if (!isAuthenticated) {
      // Logged out or token expired — reset entire stack to login
      navigation.dispatch(
        CommonActions.reset({ index: 0, routes: [{ name: "login" }] })
      );
    } else if (!hasCompletedOnboarding) {
      // resetApp() was called (profile wiped) — reset entire stack to onboarding
      navigation.dispatch(
        CommonActions.reset({ index: 0, routes: [{ name: "onboarding" }] })
      );
    }
  }, [isAuthenticated, hasCompletedOnboarding, isAuthLoading, appLoading, segments]);

  return null;
}

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: "fade" }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="feature-detail"
        options={{ headerShown: false, presentation: "modal" }}
      />
      <Stack.Screen
        name="profile"
        options={{ headerShown: false, presentation: "modal" }}
      />
      <Stack.Screen name="+not-found" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Nunito_400Regular,
    Nunito_500Medium,
    Nunito_600SemiBold,
    Nunito_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <KeyboardProvider>
              <AuthProvider>
                <AppProvider>
                  <AuthGuard />
                  <RootLayoutNav />
                </AppProvider>
              </AuthProvider>
            </KeyboardProvider>
          </GestureHandlerRootView>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
