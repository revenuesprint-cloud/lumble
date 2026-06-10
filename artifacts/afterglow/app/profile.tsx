import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";
import { useTheme } from "@/context/ThemeContext";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import type { RelationshipType } from "@/context/AppContext";
import {
  Alert,
  BackHandler,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PremiumGate } from "@/components/PremiumGate";

function InfoRow({ label, value, styles }: { label: string; value: string; styles: any }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function Section({ title, children, styles }: { title: string; children: React.ReactNode; styles: any }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionCard}>{children}</View>
    </View>
  );
}

function ActionRow({
  icon, label, sublabel, color, onPress, showChevron = true, styles,
}: {
  icon: string; label: string; sublabel?: string; color?: string; onPress: () => void; showChevron?: boolean; styles: any;
}) {
  return (
    <TouchableOpacity onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onPress(); }} activeOpacity={0.7} style={styles.actionRow}>
      <View style={[styles.actionIcon, { backgroundColor: (color || "#4A3DE8") + "14" }]}>
        <Feather name={icon as any} size={16} color={color || "#4A3DE8"} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.actionLabel, color ? { color } : {}]}>{label}</Text>
        {sublabel ? <Text style={styles.actionSublabel}>{sublabel}</Text> : null}
      </View>
      {showChevron && <Feather name="chevron-right" size={16} color={styles._borderLight} />}
    </TouchableOpacity>
  );
}

// ─── Set Password / Account Modal ─────────────────────────────────────────────

function SetPasswordModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { register, currentEmail } = useAuth();
  const c = useColors();
  const pwStylesMemo = useMemo(() => createPwStyles(c), [c]);
  const alreadyRegistered = !!currentEmail;

  const [email,    setEmail]    = useState(currentEmail || "");
  const [password, setPassword] = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [error,    setError]    = useState("");
  const [success,  setSuccess]  = useState(false);
  const [loading,  setLoading]  = useState(false);

  useEffect(() => {
    if (!visible) return;
    const sub = BackHandler.addEventListener("hardwareBackPress", () => { onClose(); return true; });
    return () => sub.remove();
  }, [visible, onClose]);

  if (!visible) return null;

  const handleSave = async () => {
    setError("");
    if (!email.includes("@")) { setError("Enter a valid email."); return; }
    if (password.length < 6)  { setError("Password must be at least 6 characters."); return; }
    if (password !== confirm)  { setError("Passwords don't match."); return; }
    setLoading(true);
    const result = await register(email, password);
    setLoading(false);
    if (result.success) { setSuccess(true); setTimeout(onClose, 1400); }
    else setError(result.error || "Something went wrong.");
  };

  return (
    <View style={pwStylesMemo.overlay}>
      <Pressable style={pwStylesMemo.backdrop} onPress={onClose} />
      <View style={pwStylesMemo.sheet}>
        <View style={pwStylesMemo.handle} />
        {alreadyRegistered ? (
          <>
            <Text style={pwStylesMemo.title}>Account</Text>
            <View style={pwStylesMemo.accountRow}>
              <View style={pwStylesMemo.accountIcon}>
                <Feather name="check-circle" size={18} color="#10B981" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={pwStylesMemo.accountLabel}>Signed in as</Text>
                <Text style={pwStylesMemo.accountEmail}>{currentEmail}</Text>
              </View>
            </View>
            <Text style={pwStylesMemo.sub}>
              Your data is backed up to the cloud and will be restored when you log in on any device.
            </Text>
            <TouchableOpacity onPress={onClose} style={pwStylesMemo.saveBtn} activeOpacity={0.85}>
              <View style={pwStylesMemo.saveBtnGrad}>
                <Text style={pwStylesMemo.saveBtnText}>Done</Text>
              </View>
            </TouchableOpacity>
          </>
        ) : success ? (
          <View style={pwStylesMemo.successRow}>
            <Feather name="check-circle" size={20} color="#10B981" />
            <Text style={pwStylesMemo.successText}>Account created! You're all set.</Text>
          </View>
        ) : (
          <>
            <Text style={pwStylesMemo.title}>Create an account</Text>
            <Text style={pwStylesMemo.sub}>Back up your readings and sign back in on any device.</Text>
            <TextInput style={pwStylesMemo.input} value={email} onChangeText={(t) => { setEmail(t); setError(""); }} placeholder="Email address" placeholderTextColor={c.borderLight} keyboardType="email-address" autoCapitalize="none" />
            <TextInput style={pwStylesMemo.input} value={password} onChangeText={(t) => { setPassword(t); setError(""); }} placeholder="Password (min. 6 chars)" placeholderTextColor={c.borderLight} secureTextEntry />
            <TextInput style={pwStylesMemo.input} value={confirm} onChangeText={(t) => { setConfirm(t); setError(""); }} placeholder="Confirm password" placeholderTextColor={c.borderLight} secureTextEntry />
            {error ? <Text style={pwStylesMemo.error}>{error}</Text> : null}
            <TouchableOpacity onPress={handleSave} disabled={loading} activeOpacity={0.85} style={[pwStylesMemo.saveBtn, loading && { opacity: 0.6 }]}>
              <View style={pwStylesMemo.saveBtnGrad}>
                <Text style={pwStylesMemo.saveBtnText}>{loading ? "Creating…" : "Create Account"}</Text>
              </View>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

function createPwStyles(c: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    overlay:      { ...StyleSheet.absoluteFillObject, zIndex: 100, justifyContent: "flex-end" },
    backdrop:     { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.4)" },
    sheet:        { backgroundColor: c.card, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40, gap: 14, borderTopWidth: 1, borderColor: c.border },
    handle:       { width: 36, height: 4, borderRadius: 2, backgroundColor: c.borderLight, alignSelf: "center", marginBottom: 6 },
    title:        { fontSize: 20, fontFamily: "PlusJakartaSans_700Bold", color: c.text },
    sub:          { fontSize: 13, fontFamily: "PlusJakartaSans_400Regular", color: c.textMuted, lineHeight: 20 },
    input:        { backgroundColor: c.input, borderRadius: 12, borderWidth: 1, borderColor: c.border, paddingHorizontal: 14, paddingVertical: 13, fontSize: 15, fontFamily: "PlusJakartaSans_400Regular", color: c.text },
    error:        { fontSize: 13, fontFamily: "PlusJakartaSans_400Regular", color: "#F43F5E" },
    saveBtn:      { borderRadius: 14, overflow: "hidden" },
    saveBtnGrad:  { alignItems: "center", justifyContent: "center", paddingVertical: 16, backgroundColor: c.cta },
    saveBtnText:  { fontSize: 16, fontFamily: "PlusJakartaSans_700Bold", color: c.ctaForeground },
    accountRow:   { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "#ECFDF5", borderRadius: 12, padding: 14, borderWidth: 1, borderColor: "#A7F3D0" },
    accountIcon:  { width: 36, height: 36, borderRadius: 18, backgroundColor: "#D1FAE5", alignItems: "center", justifyContent: "center" },
    accountLabel: { fontSize: 11, fontFamily: "PlusJakartaSans_500Medium", color: c.textFaint },
    accountEmail: { fontSize: 15, fontFamily: "PlusJakartaSans_600SemiBold", color: c.text, marginTop: 2 },
    successRow:   { flexDirection: "row", alignItems: "center", gap: 10, justifyContent: "center", paddingVertical: 20 },
    successText:  { fontSize: 15, fontFamily: "PlusJakartaSans_600SemiBold", color: "#10B981" },
  });
}

// ─── Edit Profile Modal ────────────────────────────────────────────────────────

const REL_TYPES: { key: RelationshipType; label: string }[] = [
  { key: "crush",         label: "Crush" },
  { key: "situationship", label: "Situationship" },
  { key: "relationship",  label: "Relationship" },
  { key: "ex",            label: "Ex" },
];

function EditProfileModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { user, partner, completeOnboarding, syncProfileToServer } = useApp();
  const { jwtToken } = useAuth();
  const c = useColors();
  const editStylesMemo = useMemo(() => createEditStyles(c), [c]);

  const [userName,         setUserName]         = useState(user?.name ?? "");
  const [userBirthDate,    setUserBirthDate]    = useState(user?.birthDate?.slice(0, 10) ?? "");
  const [userBirthTime,    setUserBirthTime]    = useState(user?.birthTime ?? "");
  const [partnerName,      setPartnerName]      = useState(partner?.name ?? "");
  const [partnerBirthDate, setPartnerBirthDate] = useState(partner?.birthDate?.slice(0, 10) ?? "");
  const [relType,          setRelType]          = useState<RelationshipType>(partner?.relationshipType ?? "crush");
  const [error,            setError]            = useState("");
  const [saving,           setSaving]           = useState(false);

  useEffect(() => {
    if (!visible) return;
    const sub = BackHandler.addEventListener("hardwareBackPress", () => { onClose(); return true; });
    return () => sub.remove();
  }, [visible, onClose]);

  if (!visible) return null;

  const handleSave = async () => {
    if (userName.trim().length < 2)     { setError("Your name must be at least 2 characters."); return; }
    if (!userBirthDate)                  { setError("Your birth date is required."); return; }
    if (partnerName.trim().length < 2)  { setError("Their name must be at least 2 characters."); return; }
    if (!partnerBirthDate)               { setError("Their birth date is required."); return; }
    setSaving(true);
    const updatedUser    = { name: userName.trim(), birthDate: userBirthDate.trim(), birthTime: userBirthTime.trim() || undefined };
    const updatedPartner = { name: partnerName.trim(), birthDate: partnerBirthDate.trim(), relationshipType: relType };
    await completeOnboarding(updatedUser, updatedPartner);
    if (jwtToken) syncProfileToServer(jwtToken, updatedUser, updatedPartner).catch(() => {});
    setSaving(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onClose();
  };

  return (
    <View style={editStylesMemo.overlay}>
      <Pressable style={editStylesMemo.backdrop} onPress={onClose} />
      <ScrollView style={editStylesMemo.sheet} contentContainerStyle={editStylesMemo.sheetContent} keyboardShouldPersistTaps="handled">
        <View style={editStylesMemo.handle} />
        <Text style={editStylesMemo.title}>Edit Connection</Text>
        <Text style={editStylesMemo.sectionLabel}>YOU</Text>
        <TextInput style={editStylesMemo.input} value={userName} onChangeText={(t) => { setUserName(t); setError(""); }} placeholder="Your first name" placeholderTextColor={c.borderLight} />
        <TextInput style={editStylesMemo.input} value={userBirthDate} onChangeText={(t) => { setUserBirthDate(t); setError(""); }} placeholder="Your birth date (YYYY-MM-DD)" placeholderTextColor={c.borderLight} keyboardType="numbers-and-punctuation" />
        <TextInput style={editStylesMemo.input} value={userBirthTime} onChangeText={(t) => { setUserBirthTime(t); setError(""); }} placeholder="Birth time (optional, e.g. 3:45 PM)" placeholderTextColor={c.borderLight} />
        <Text style={[editStylesMemo.sectionLabel, { marginTop: 8 }]}>THEIR INFO</Text>
        <TextInput style={editStylesMemo.input} value={partnerName} onChangeText={(t) => { setPartnerName(t); setError(""); }} placeholder="Their first name" placeholderTextColor={c.borderLight} />
        <TextInput style={editStylesMemo.input} value={partnerBirthDate} onChangeText={(t) => { setPartnerBirthDate(t); setError(""); }} placeholder="Their birth date (YYYY-MM-DD)" placeholderTextColor={c.borderLight} keyboardType="numbers-and-punctuation" />
        <Text style={[editStylesMemo.sectionLabel, { marginTop: 8 }]}>RELATIONSHIP TYPE</Text>
        <View style={editStylesMemo.relRow}>
          {REL_TYPES.map((r) => (
            <TouchableOpacity
              key={r.key}
              onPress={() => { Haptics.selectionAsync(); setRelType(r.key); }}
              style={[editStylesMemo.relChip, relType === r.key && editStylesMemo.relChipActive]}
            >
              <Text style={[editStylesMemo.relChipText, relType === r.key && editStylesMemo.relChipTextActive]}>{r.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {error ? <Text style={editStylesMemo.error}>{error}</Text> : null}
        <TouchableOpacity onPress={handleSave} disabled={saving} activeOpacity={0.85} style={[editStylesMemo.saveBtn, saving && { opacity: 0.6 }]}>
          <View style={editStylesMemo.saveGrad}>
            <Text style={editStylesMemo.saveBtnText}>{saving ? "Saving…" : "Save Changes"}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={onClose} style={editStylesMemo.cancelBtn}>
          <Text style={editStylesMemo.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function createEditStyles(c: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    overlay:          { ...StyleSheet.absoluteFillObject, zIndex: 200, justifyContent: "flex-end" },
    backdrop:         { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.4)" },
    sheet:            { backgroundColor: c.card, borderTopLeftRadius: 24, borderTopRightRadius: 24, borderTopWidth: 1, borderColor: c.border, maxHeight: "92%" },
    sheetContent:     { padding: 24, paddingBottom: 48, gap: 12 },
    handle:           { width: 36, height: 4, borderRadius: 2, backgroundColor: c.borderLight, alignSelf: "center", marginBottom: 8 },
    title:            { fontSize: 20, fontFamily: "PlusJakartaSans_700Bold", color: c.text, marginBottom: 4 },
    sectionLabel:     { fontSize: 11, fontFamily: "PlusJakartaSans_700Bold", color: c.textFaint, letterSpacing: 0.8, textTransform: "uppercase" },
    input:            { backgroundColor: c.input, borderRadius: 12, borderWidth: 1, borderColor: c.border, paddingHorizontal: 14, paddingVertical: 13, fontSize: 15, fontFamily: "PlusJakartaSans_400Regular", color: c.text },
    relRow:           { flexDirection: "row", flexWrap: "wrap", gap: 8 },
    relChip:          { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: c.border, backgroundColor: c.card },
    relChipActive:    { borderColor: c.primaryBorder, backgroundColor: c.primaryLight },
    relChipText:      { fontSize: 14, fontFamily: "PlusJakartaSans_500Medium", color: c.textMuted },
    relChipTextActive:{ color: "#4A3DE8", fontFamily: "PlusJakartaSans_600SemiBold" },
    error:            { fontSize: 13, fontFamily: "PlusJakartaSans_400Regular", color: "#F43F5E" },
    saveBtn:          { borderRadius: 14, overflow: "hidden", marginTop: 4 },
    saveGrad:         { alignItems: "center", justifyContent: "center", paddingVertical: 16, backgroundColor: c.cta },
    saveBtnText:      { fontSize: 16, fontFamily: "PlusJakartaSans_700Bold", color: c.ctaForeground },
    cancelBtn:        { alignItems: "center", padding: 8 },
    cancelText:       { fontSize: 14, fontFamily: "PlusJakartaSans_400Regular", color: c.textFaint },
  });
}

// ─── Profile Screen ────────────────────────────────────────────────────────────

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, partner, isPremium, resetApp } = useApp();
  const { logout, currentEmail } = useAuth();
  const { mode: themeMode, setMode } = useTheme();
  const c = useColors();
  const styles = useMemo(() => createStyles(c), [c]);
  const [showPremiumGate, setShowPremiumGate] = useState(false);
  const [showSetPassword, setShowSetPassword] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);

  if (!user || !partner) return null;

  const handleSignOut = () => {
    Alert.alert(
      "Sign out?",
      `You'll need to sign in again as ${currentEmail ?? "yourself"}.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            await logout();
            router.replace("/login");
            resetApp().catch(() => {});
          },
        },
      ]
    );
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  const relTypeLabel: Record<string, string> = {
    crush: "Crush", situationship: "Situationship", relationship: "Relationship", ex: "Ex",
  };

  const handleReset = () => {
    Alert.alert(
      "Reset everything?",
      "This will clear all your data including your profile, connection, and chat history. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            router.replace("/onboarding");
            resetApp().catch(() => {});
          },
        },
      ]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: c.background }}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Pressable onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.back(); }} style={styles.backBtn} hitSlop={8}>
          <Feather name="chevron-left" size={24} color={c.textMuted} />
        </Pressable>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={Platform.OS === "web" ? { maxWidth: 640, alignSelf: "center", width: "100%" } : undefined}
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 40 }]}
      >
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarInitial}>{user.name.charAt(0) || "?"}</Text>
          </View>
          <Text style={styles.userName}>{user.name}</Text>
          {isPremium ? (
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumBadgeText}>◈ Premium</Text>
            </View>
          ) : (
            <View style={styles.freeBadge}>
              <Text style={styles.freeBadgeText}>Free plan</Text>
            </View>
          )}
        </View>

        {/* Your info */}
        <Section title="You" styles={styles}>
          <InfoRow label="Name" value={user.name} styles={styles} />
          <View style={styles.separator} />
          <InfoRow label="Birthday" value={formatDate(user.birthDate)} styles={styles} />
          {user.birthTime ? (<><View style={styles.separator} /><InfoRow label="Birth time" value={user.birthTime} styles={styles} /></>) : null}
          <View style={styles.separator} />
          <TouchableOpacity onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setShowEditProfile(true); }} activeOpacity={0.7} style={styles.editRow}>
            <Feather name="edit-2" size={14} color="#4A3DE8" />
            <Text style={styles.editRowText}>Edit profile & connection</Text>
          </TouchableOpacity>
        </Section>

        {/* Partner */}
        <Section title="Your Connection" styles={styles}>
          <View style={styles.partnerRow}>
            <View style={styles.partnerAvatar}>
              <Text style={styles.partnerInitial}>{partner.name.charAt(0) || "?"}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.partnerName}>{partner.name}</Text>
              <Text style={styles.partnerType}>{relTypeLabel[partner.relationshipType]}</Text>
            </View>
          </View>
          <View style={styles.separator} />
          <InfoRow label="Their birthday" value={formatDate(partner.birthDate)} styles={styles} />
        </Section>

        {/* Premium */}
        {!isPremium && (
          <Section title="Subscription" styles={styles}>
            <TouchableOpacity
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); setShowPremiumGate(true); }}
              activeOpacity={0.85}
              style={styles.upgradeCard}
            >
              <View style={styles.upgradeCardInner}>
                <View style={{ flex: 1, gap: 4 }}>
                  <Text style={styles.upgradeTitle}>Unlock Premium</Text>
                  <Text style={styles.upgradeSub}>All insights · Unlimited guidance · Deep reads</Text>
                </View>
                <Text style={styles.upgradePrice}>$9.99/mo</Text>
              </View>
            </TouchableOpacity>
          </Section>
        )}

        {isPremium && (
          <Section title="Subscription" styles={styles}>
            <View style={styles.premiumActiveCard}>
              <View style={styles.premiumActiveIcon}>
                <Feather name="check-circle" size={18} color="#10B981" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.premiumActiveTitle}>Premium Active</Text>
                <Text style={styles.premiumActiveSub}>All features unlocked · Unlimited guidance</Text>
              </View>
            </View>
          </Section>
        )}

        {/* Appearance */}
        <Section title="Appearance" styles={styles}>
          <View style={styles.appearanceRow}>
            {(["system", "light", "dark"] as const).map((m, idx) => (
              <TouchableOpacity
                key={m}
                onPress={() => { Haptics.selectionAsync(); setMode(m); }}
                style={[
                  styles.appearanceBtn,
                  idx === 0 && styles.appearanceBtnFirst,
                  idx === 2 && styles.appearanceBtnLast,
                  idx > 0 && styles.appearanceBtnOverlap,
                  themeMode === m && styles.appearanceBtnActive,
                ]}
                activeOpacity={0.75}
              >
                <Feather name={m === "system" ? "monitor" : m === "light" ? "sun" : "moon"} size={14} color={themeMode === m ? c.primary : c.textMuted} />
                <Text style={[styles.appearanceBtnText, themeMode === m && { color: c.primary, fontFamily: "PlusJakartaSans_600SemiBold" }]}>
                  {m === "system" ? "System" : m === "light" ? "Light" : "Dark"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Section>

        {/* Account actions */}
        <Section title="Account" styles={styles}>
          <ActionRow icon="key" label="Account" sublabel={currentEmail ?? "Signed in"} onPress={() => setShowSetPassword(true)} styles={{ ...styles, _borderLight: c.borderLight }} />
          <View style={styles.separator} />
          <ActionRow icon="refresh-cw" label="Change connection" sublabel="Update who you're analyzing" onPress={() => setShowEditProfile(true)} styles={{ ...styles, _borderLight: c.borderLight }} />
          <View style={styles.separator} />
          <ActionRow icon="trash-2" label="Reset everything" sublabel="Start completely fresh" color="#EF4444" onPress={handleReset} showChevron={false} styles={{ ...styles, _borderLight: c.borderLight }} />
        </Section>

        <TouchableOpacity onPress={handleSignOut} activeOpacity={0.75} style={styles.signOutBtn}>
          <Feather name="log-out" size={16} color="#F43F5E" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>Lumble · Version 1.0</Text>
          <Text style={styles.appInfoText}>Cloud-backed · Restores on any device</Text>
        </View>
      </ScrollView>

      <PremiumGate visible={showPremiumGate} onClose={() => setShowPremiumGate(false)} />
      <SetPasswordModal visible={showSetPassword} onClose={() => setShowSetPassword(false)} />
      <EditProfileModal visible={showEditProfile} onClose={() => setShowEditProfile(false)} />
    </View>
  );
}

function createStyles(c: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    header:            { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingBottom: 12, backgroundColor: c.background },
    backBtn:           { width: 40, height: 40, borderRadius: 14, backgroundColor: c.card, borderWidth: 1, borderColor: c.border, alignItems: "center", justifyContent: "center" },
    headerTitle:       { fontSize: 19, fontFamily: "PlusJakartaSans_700Bold", color: c.text },
    scroll:            { paddingHorizontal: 20, gap: 18, paddingTop: 8 },

    avatarSection:     { alignItems: "center", gap: 10, paddingVertical: 16 },
    avatar:            { width: 80, height: 80, borderRadius: 40, backgroundColor: "#4A3DE8", alignItems: "center", justifyContent: "center" },
    avatarInitial:     { fontSize: 36, fontFamily: "PlusJakartaSans_700Bold", color: "#fff" },
    userName:          { fontSize: 26, fontFamily: "PlusJakartaSans_700Bold", color: c.text },
    premiumBadge:      { backgroundColor: c.primaryLight, borderWidth: 1, borderColor: c.primaryBorder, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 5 },
    premiumBadgeText:  { fontSize: 12, fontFamily: "PlusJakartaSans_600SemiBold", color: "#4A3DE8" },
    freeBadge:         { backgroundColor: c.input, borderWidth: 1, borderColor: c.border, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 5 },
    freeBadgeText:     { fontSize: 12, fontFamily: "PlusJakartaSans_400Regular", color: c.textFaint },

    section:           { gap: 8 },
    sectionTitle:      { fontSize: 11, fontFamily: "PlusJakartaSans_700Bold", color: c.textFaint, letterSpacing: 0.8, textTransform: "uppercase", paddingHorizontal: 4 },
    sectionCard:       { backgroundColor: c.card, borderRadius: 18, borderWidth: 1, borderColor: c.border, overflow: "hidden",
                         shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 12, elevation: 1 },
    infoRow:           { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 18, paddingVertical: 14 },
    infoLabel:         { fontSize: 15, fontFamily: "PlusJakartaSans_400Regular", color: c.textMuted },
    infoValue:         { fontSize: 15, fontFamily: "PlusJakartaSans_500Medium", color: c.text },
    separator:         { height: 1, backgroundColor: c.borderLight, marginHorizontal: 18 },
    editRow:           { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 18, paddingVertical: 13 },
    editRowText:       { fontSize: 14, fontFamily: "PlusJakartaSans_600SemiBold", color: "#4A3DE8" },

    partnerRow:        { flexDirection: "row", alignItems: "center", gap: 14, paddingHorizontal: 18, paddingVertical: 14 },
    partnerAvatar:     { width: 42, height: 42, borderRadius: 21, backgroundColor: c.primaryLight, borderWidth: 1, borderColor: c.primaryBorder, alignItems: "center", justifyContent: "center" },
    partnerInitial:    { fontSize: 18, fontFamily: "PlusJakartaSans_700Bold", color: "#4A3DE8" },
    partnerName:       { fontSize: 17, fontFamily: "PlusJakartaSans_600SemiBold", color: c.text },
    partnerType:       { fontSize: 13, fontFamily: "PlusJakartaSans_400Regular", color: c.textFaint, marginTop: 2 },

    upgradeCard:       { borderRadius: 16, overflow: "hidden", borderWidth: 1, borderColor: c.primaryBorder },
    upgradeCardInner:  { flexDirection: "row", alignItems: "center", padding: 18, gap: 12, backgroundColor: c.primaryLight },
    upgradeTitle:      { fontSize: 17, fontFamily: "PlusJakartaSans_700Bold", color: c.text },
    upgradeSub:        { fontSize: 12, fontFamily: "PlusJakartaSans_400Regular", color: c.textMuted },
    upgradePrice:      { fontSize: 17, fontFamily: "PlusJakartaSans_700Bold", color: "#4A3DE8" },

    premiumActiveCard: { flexDirection: "row", alignItems: "center", gap: 14, paddingHorizontal: 18, paddingVertical: 16 },
    premiumActiveIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#ECFDF5", alignItems: "center", justifyContent: "center" },
    premiumActiveTitle:{ fontSize: 15, fontFamily: "PlusJakartaSans_700Bold", color: c.text },
    premiumActiveSub:  { fontSize: 12, fontFamily: "PlusJakartaSans_400Regular", color: c.textFaint, marginTop: 2 },

    actionRow:         { flexDirection: "row", alignItems: "center", gap: 14, paddingHorizontal: 18, paddingVertical: 14 },
    actionIcon:        { width: 34, height: 34, borderRadius: 10, alignItems: "center", justifyContent: "center" },
    actionLabel:       { fontSize: 15, fontFamily: "PlusJakartaSans_500Medium", color: c.text },
    actionSublabel:    { fontSize: 12, fontFamily: "PlusJakartaSans_400Regular", color: c.textFaint, marginTop: 2 },

    // Appearance
    appearanceRow:        { flexDirection: "row", gap: 0 },
    appearanceBtn:        { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 14, borderWidth: 1, borderColor: c.border, backgroundColor: c.card },
    appearanceBtnFirst:   { borderTopLeftRadius: 12, borderBottomLeftRadius: 12 },
    appearanceBtnLast:    { borderTopRightRadius: 12, borderBottomRightRadius: 12 },
    appearanceBtnOverlap: { marginLeft: -1 },
    appearanceBtnActive:  { backgroundColor: c.primaryLight, borderColor: c.primaryBorder },
    appearanceBtnText:    { fontSize: 13, fontFamily: "PlusJakartaSans_500Medium", color: c.textMuted },

    signOutBtn:        { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, backgroundColor: c.roseLight, borderRadius: 16, borderWidth: 1, borderColor: c.roseBorder, paddingVertical: 15 },
    signOutText:       { fontSize: 15, fontFamily: "PlusJakartaSans_600SemiBold", color: "#F43F5E" },
    appInfo:           { alignItems: "center", gap: 4, paddingVertical: 8 },
    appInfoText:       { fontSize: 12, fontFamily: "PlusJakartaSans_400Regular", color: c.textFaint },
  });
}
