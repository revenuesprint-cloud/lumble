// ─── Lumble engagement notifications ──────────────────────────────────────────
// Schedules local daily notifications that nudge the user back into the app.
// Fully offline — no server/push tokens needed. Re-schedules at most once a day.

import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SCHEDULED_KEY = "@lumble_notif_day";
const HOUR = 9; // 9:00 local — a calm morning nudge

// Rotating engagement copy. Each day pulls the next one.
const MESSAGES: { title: string; body: string }[] = [
  { title: "✨ Your energy shifted today", body: "Your love-weather changed overnight. See where you two stand." },
  { title: "🔥 A hidden pattern surfaced", body: "Something new showed up in your charts. Take a look." },
  { title: "❤️ Communication is strongest today", body: "The window is open. Say the thing you've been holding." },
  { title: "🌙 Today's couple challenge is ready", body: "Two minutes, a little closer, and +XP for your streak." },
  { title: "⚡ Keep your streak alive", body: "Your 30-day pattern is getting closer. Don't break the chain." },
  { title: "🔮 A fresh reading is waiting", body: "Today's prediction, ritual, and question just refreshed." },
  { title: "💫 They're on your mind for a reason", body: "Open Lumble and see what today says about you two." },
];

// Foreground behaviour (if a notification fires while the app is open).
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Requests permission (once) and schedules the next 7 days of daily nudges,
 * rotating the message each day. Safe to call on every app open — it only
 * re-schedules once per calendar day. Silently no-ops on web or if denied.
 */
export async function ensureDailyNotifications(): Promise<void> {
  if (Platform.OS === "web") return;
  try {
    let { status } = await Notifications.getPermissionsAsync();
    if (status !== "granted") {
      const req = await Notifications.requestPermissionsAsync();
      status = req.status;
    }
    if (status !== "granted") return;

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("daily", {
        name: "Daily nudges",
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }

    // Only re-schedule once per day to avoid stacking duplicates.
    const today = new Date().toISOString().slice(0, 10);
    const last = await AsyncStorage.getItem(SCHEDULED_KEY);
    if (last === today) return;

    await Notifications.cancelAllScheduledNotificationsAsync();

    const startIdx = new Date().getDate(); // stable rotation seed for the week
    for (let i = 1; i <= 7; i++) {
      const msg = MESSAGES[(startIdx + i) % MESSAGES.length];
      const fire = new Date();
      fire.setDate(fire.getDate() + i);
      fire.setHours(HOUR, 0, 0, 0);
      await Notifications.scheduleNotificationAsync({
        content: { title: msg.title, body: msg.body },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: fire,
          channelId: "daily",
        },
      });
    }

    await AsyncStorage.setItem(SCHEDULED_KEY, today);
  } catch {
    // Notifications are best-effort; never block the app.
  }
}

/** Turn off all scheduled nudges (e.g. on logout). */
export async function clearDailyNotifications(): Promise<void> {
  if (Platform.OS === "web") return;
  try { await Notifications.cancelAllScheduledNotificationsAsync(); } catch {}
}
