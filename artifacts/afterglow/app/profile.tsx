import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import type { RelationshipType } from "@/context/AppContext";
import {
  Alert,
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

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionCard}>{children}</View>
    </View>
  );
}

function ActionRow({
  icon, label, sublabel, color, onPress, showChevron = true,
}: {
  icon: string; label: string; sublabel?: string; color?: string; onPress: () => void; showChevron?: boolean;
}) {
  return (
    <TouchableOpacity onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onPress(); }} activeOpacity={0.7} style={styles.actionRow}>
      <View style={[styles.actionIcon, { backgroundColor: (color || "#5B4CE8") + "14" }]}>
        <Feather name={icon as any} size={16} color={color || "#5B4CE8"} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.actionLabel, color ? { color } : {}]}>{label}</Text>
        {sublabel ? <Text style={styles.actionSublabel}>{sublabel}</Text> : null}
      </View>
      {showChevron && <Feather name="chevron-right" size={16} color="#D1D5DB" />}
    </TouchableOpacity>
  );
}

// ─── Set Password / Account Modal ─────────────────────────────────────────────

function SetPasswordModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { register, currentEmail } = useAuth();
  const alreadyRegistered = !!currentEmail;

  const [email,    setEmail]    = useState(currentEmail || "");
  const [password, setPassword] = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [error,    setError]    = useState("");
  const [success,  setSuccess]  = useState(false);
  const [loading,  setLoading]  = useState(false);

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
    <View style={pwStyles.overlay}>
      <Pressable style={pwStyles.backdrop} onPress={onClose} />
      <View style={pwStyles.sheet}>
        <View style={pwStyles.handle} />
        {alreadyRegistered ? (
          <>
            <Text style={pwStyles.title}>Account</Text>
            <View style={pwStyles.accountRow}>
              <View style={pwStyles.accountIcon}>
                <Feather name="check-circle" size={18} color="#10B981" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={pwStyles.accountLabel}>Signed in as</Text>
                <Text style={pwStyles.accountEmail}>{currentEmail}</Text>
              </View>
            </View>
            <Text style={pwStyles.sub}>
              Your data is backed up to the cloud and will be restored when you log in on any device.
            </Text>
            <TouchableOpacity onPress={onClose} style={pwStyles.saveBtn} activeOpacity={0.85}>
              <LinearGradient colors={["#5B4CE8", "#8B5CF6"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={pwStyles.saveBtnGrad}>
                <Text style={pwStyles.saveBtnText}>Done</Text>
              </LinearGradient>
            </TouchableOpacity>
          </>
        ) : success ? (
          <View style={pwStyles.successRow}>
            <Feather name="check-circle" size={20} color="#10B981" />
            <Text style={pwStyles.successText}>Account created! You're all set.</Text>
          </View>
        ) : (
          <>
            <Text style={pwStyles.title}>Create an account</Text>
            <Text style={pwStyles.sub}>Back up your readings and sign back in on any device.</Text>
            <TextInput style={pwStyles.input} value={email} onChangeText={(t) => { setEmail(t); setError(""); }} placeholder="Email address" placeholderTextColor="#D1D5DB" keyboardType="email-address" autoCapitalize="none" />
            <TextInput style={pwStyles.input} value={password} onChangeText={(t) => { setPassword(t); setError(""); }} placeholder="Password (min. 6 chars)" placeholderTextColor="#D1D5DB" secureTextEntry />
            <TextInput style={pwStyles.input} value={confirm} onChangeText={(t) => { setConfirm(t); setError(""); }} placeholder="Confirm password" placeholderTextColor="#D1D5DB" secureTextEntry />
            {error ? <Text style={pwStyles.error}>{error}</Text> : null}
            <TouchableOpacity onPress={handleSave} disabled={loading} activeOpacity={0.85} style={[pwStyles.saveBtn, loading && { opacity: 0.6 }]}>
              <LinearGradient colors={["#5B4CE8", "#8B5CF6"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={pwStyles.saveBtnGrad}>
                <Text style={pwStyles.saveBtnText}>{loading ? "Creating…" : "Create Account"}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const pwStyles = StyleSheet.create({
  overlay:      { ...StyleSheet.absoluteFillObject, zIndex: 100, justifyContent: "flex-end" },
  backdrop:     { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.4)" },
  sheet:        { backgroundColor: "#FFFFFF", borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40, gap: 14, borderTopWidth: 1, borderColor: "#E5E7EB" },
  handle:       { width: 36, height: 4, borderRadius: 2, backgroundColor: "#D1D5DB", alignSelf: "center", marginBottom: 6 },
  title:        { fontSize: 20, fontFamily: "Nunito_700Bold", color: "#111827" },
  sub:          { fontSize: 13, fontFamily: "Nunito_400Regular", color: "#6B7280", lineHeight: 20 },
  input:        { backgroundColor: "#F9FAFB", borderRadius: 12, borderWidth: 1, borderColor: "#E5E7EB", paddingHorizontal: 14, paddingVertical: 13, fontSize: 15, fontFamily: "Nunito_400Regular", color: "#111827" },
  error:        { fontSize: 13, fontFamily: "Nunito_400Regular", color: "#F43F5E" },
  saveBtn:      { borderRadius: 14, overflow: "hidden" },
  saveBtnGrad:  { alignItems: "center", justifyContent: "center", paddingVertical: 16 },
  saveBtnText:  { fontSize: 16, fontFamily: "Nunito_700Bold", color: "#fff" },
  accountRow:   { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "#ECFDF5", borderRadius: 12, padding: 14, borderWidth: 1, borderColor: "#A7F3D0" },
  accountIcon:  { width: 36, height: 36, borderRadius: 18, backgroundColor: "#D1FAE5", alignItems: "center", justifyContent: "center" },
  accountLabel: { fontSize: 11, fontFamily: "Nunito_500Medium", color: "#9CA3AF" },
  accountEmail: { fontSize: 15, fontFamily: "Nunito_600SemiBold", color: "#111827", marginTop: 2 },
  successRow:   { flexDirection: "row", alignItems: "center", gap: 10, justifyContent: "center", paddingVertical: 20 },
  successText:  { fontSize: 15, fontFamily: "Nunito_600SemiBold", color: "#10B981" },
});

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

  const [userName,         setUserName]         = useState(user?.name ?? "");
  const [userBirthDate,    setUserBirthDate]    = useState(user?.birthDate?.slice(0, 10) ?? "");
  const [userBirthTime,    setUserBirthTime]    = useState(user?.birthTime ?? "");
  const [partnerName,      setPartnerName]      = useState(partner?.name ?? "");
  const [partnerBirthDate, setPartnerBirthDate] = useState(partner?.birthDate?.slice(0, 10) ?? "");
  const [relType,          setRelType]          = useState<RelationshipType>(partner?.relationshipType ?? "crush");
  const [error,            setError]            = useState("");
  const [saving,           setSaving]           = useState(false);

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
    <View style={editStyles.overlay}>
      <Pressable style={editStyles.backdrop} onPress={onClose} />
      <ScrollView style={editStyles.sheet} contentContainerStyle={editStyles.sheetContent} keyboardShouldPersistTaps="handled">
        <View style={editStyles.handle} />
        <Text style={editStyles.title}>Edit Connection</Text>
        <Text style={editStyles.sectionLabel}>YOU</Text>
        <TextInput style={editStyles.input} value={userName} onChangeText={(t) => { setUserName(t); setError(""); }} placeholder="Your first name" placeholderTextColor="#D1D5DB" />
        <TextInput style={editStyles.input} value={userBirthDate} onChangeText={(t) => { setUserBirthDate(t); setError(""); }} placeholder="Your birth date (YYYY-MM-DD)" placeholderTextColor="#D1D5DB" keyboardType="numbers-and-punctuation" />
        <TextInput style={editStyles.input} value={userBirthTime} onChangeText={(t) => { setUserBirthTime(t); setError(""); }} placeholder="Birth time (optional, e.g. 3:45 PM)" placeholderTextColor="#D1D5DB" />
        <Text style={[editStyles.sectionLabel, { marginTop: 8 }]}>THEIR INFO</Text>
        <TextInput style={editStyles.input} value={partnerName} onChangeText={(t) => { setPartnerName(t); setError(""); }} placeholder="Their first name" placeholderTextColor="#D1D5DB" />
        <TextInput style={editStyles.input} value={partnerBirthDate} onChangeText={(t) => { setPartnerBirthDate(t); setError(""); }} placeholder="Their birth date (YYYY-MM-DD)" placeholderTextColor="#D1D5DB" keyboardType="numbers-and-punctuation" />
        <Text style={[editStyles.sectionLabel, { marginTop: 8 }]}>RELATIONSHIP TYPE</Text>
        <View style={editStyles.relRow}>
          {REL_TYPES.map((r) => (
            <TouchableOpacity
              key={r.key}
              onPress={() => { Haptics.selectionAsync(); setRelType(r.key); }}
              style={[editStyles.relChip, relType === r.key && editStyles.relChipActive]}
            >
              <Text style={[editStyles.relChipText, relType === r.key && editStyles.relChipTextActive]}>{r.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {error ? <Text style={editStyles.error}>{error}</Text> : null}
        <TouchableOpacity onPress={handleSave} disabled={saving} activeOpacity={0.85} style={[editStyles.saveBtn, saving && { opacity: 0.6 }]}>
          <LinearGradient colors={["#5B4CE8", "#8B5CF6"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={editStyles.saveGrad}>
            <Text style={editStyles.saveBtnText}>{saving ? "Saving…" : "Save Changes"}</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity onPress={onClose} style={editStyles.cancelBtn}>
          <Text style={editStyles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const editStyles = StyleSheet.create({
  overlay:          { ...StyleSheet.absoluteFillObject, zIndex: 200, justifyContent: "flex-end" },
  backdrop:         { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.4)" },
  sheet:            { backgroundColor: "#FFFFFF", borderTopLeftRadius: 24, borderTopRightRadius: 24, borderTopWidth: 1, borderColor: "#E5E7EB", maxHeight: "92%" },
  sheetContent:     { padding: 24, paddingBottom: 48, gap: 12 },
  handle:           { width: 36, height: 4, borderRadius: 2, backgroundColor: "#D1D5DB", alignSelf: "center", marginBottom: 8 },
  title:            { fontSize: 20, fontFamily: "Nunito_700Bold", color: "#111827", marginBottom: 4 },
  sectionLabel:     { fontSize: 11, fontFamily: "Nunito_700Bold", color: "#9CA3AF", letterSpacing: 0.8, textTransform: "uppercase" },
  input:            { backgroundColor: "#F9FAFB", borderRadius: 12, borderWidth: 1, borderColor: "#E5E7EB", paddingHorizontal: 14, paddingVertical: 13, fontSize: 15, fontFamily: "Nunito_400Regular", color: "#111827" },
  relRow:           { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  relChip:          { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: "#E5E7EB", backgroundColor: "#FFFFFF" },
  relChipActive:    { borderColor: "#C7D2FE", backgroundColor: "#EEF2FF" },
  relChipText:      { fontSize: 14, fontFamily: "Nunito_500Medium", color: "#6B7280" },
  relChipTextActive:{ color: "#5B4CE8", fontFamily: "Nunito_600SemiBold" },
  error:            { fontSize: 13, fontFamily: "Nunito_400Regular", color: "#F43F5E" },
  saveBtn:          { borderRadius: 14, overflow: "hidden", marginTop: 4 },
  saveGrad:         { alignItems: "center", justifyContent: "center", paddingVertical: 16 },
  saveBtnText:      { fontSize: 16, fontFamily: "Nunito_700Bold", color: "#fff" },
  cancelBtn:        { alignItems: "center", padding: 8 },
  cancelText:       { fontSize: 14, fontFamily: "Nunito_400Regular", color: "#9CA3AF" },
});

// ─── Profile Screen ────────────────────────────────────────────────────────────

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, partner, isPremium, resetApp } = useApp();
  const { logout, currentEmail } = useAuth();
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
    <View style={{ flex: 1, backgroundColor: "#F4F5F7" }}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Pressable onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.back(); }} style={styles.backBtn}>
          <Feather name="chevron-left" size={24} color="#6B7280" />
        </Pressable>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 40 }]}
      >
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <LinearGradient colors={["#5B4CE8", "#8B5CF6"]} style={styles.avatar}>
            <Text style={styles.avatarInitial}>{user.name.charAt(0) || "?"}</Text>
          </LinearGradient>
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
        <Section title="You">
          <InfoRow label="Name" value={user.name} />
          <View style={styles.separator} />
          <InfoRow label="Birthday" value={formatDate(user.birthDate)} />
          {user.birthTime ? (<><View style={styles.separator} /><InfoRow label="Birth time" value={user.birthTime} /></>) : null}
          <View style={styles.separator} />
          <TouchableOpacity onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setShowEditProfile(true); }} activeOpacity={0.7} style={styles.editRow}>
            <Feather name="edit-2" size={14} color="#5B4CE8" />
            <Text style={styles.editRowText}>Edit profile & connection</Text>
          </TouchableOpacity>
        </Section>

        {/* Partner */}
        <Section title="Your Connection">
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
          <InfoRow label="Their birthday" value={formatDate(partner.birthDate)} />
        </Section>

        {/* Premium */}
        {!isPremium && (
          <Section title="Subscription">
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
          <Section title="Subscription">
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

        {/* Account actions */}
        <Section title="Account">
          <ActionRow icon="key" label="Account" sublabel={currentEmail ?? "Signed in"} onPress={() => setShowSetPassword(true)} />
          <View style={styles.separator} />
          <ActionRow icon="refresh-cw" label="Change connection" sublabel="Update who you're analyzing" onPress={() => setShowEditProfile(true)} />
          <View style={styles.separator} />
          <ActionRow icon="trash-2" label="Reset everything" sublabel="Start completely fresh" color="#EF4444" onPress={handleReset} showChevron={false} />
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

const styles = StyleSheet.create({
  header:            { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingBottom: 12, backgroundColor: "#F4F5F7" },
  backBtn:           { width: 40, height: 40, borderRadius: 20, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E5E7EB", alignItems: "center", justifyContent: "center" },
  headerTitle:       { fontSize: 19, fontFamily: "Nunito_700Bold", color: "#111827" },
  scroll:            { paddingHorizontal: 20, gap: 18, paddingTop: 8 },

  avatarSection:     { alignItems: "center", gap: 10, paddingVertical: 16 },
  avatar:            { width: 80, height: 80, borderRadius: 40, alignItems: "center", justifyContent: "center" },
  avatarInitial:     { fontSize: 36, fontFamily: "Nunito_700Bold", color: "#fff" },
  userName:          { fontSize: 26, fontFamily: "Nunito_700Bold", color: "#111827" },
  premiumBadge:      { backgroundColor: "#EEF2FF", borderWidth: 1, borderColor: "#C7D2FE", borderRadius: 20, paddingHorizontal: 14, paddingVertical: 5 },
  premiumBadgeText:  { fontSize: 12, fontFamily: "Nunito_600SemiBold", color: "#5B4CE8" },
  freeBadge:         { backgroundColor: "#F9FAFB", borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 20, paddingHorizontal: 14, paddingVertical: 5 },
  freeBadgeText:     { fontSize: 12, fontFamily: "Nunito_400Regular", color: "#9CA3AF" },

  section:           { gap: 8 },
  sectionTitle:      { fontSize: 11, fontFamily: "Nunito_700Bold", color: "#9CA3AF", letterSpacing: 0.8, textTransform: "uppercase", paddingHorizontal: 4 },
  sectionCard:       { backgroundColor: "#FFFFFF", borderRadius: 18, borderWidth: 1, borderColor: "#E5E7EB", overflow: "hidden",
                       shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 12, elevation: 1 },
  infoRow:           { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 18, paddingVertical: 14 },
  infoLabel:         { fontSize: 15, fontFamily: "Nunito_400Regular", color: "#6B7280" },
  infoValue:         { fontSize: 15, fontFamily: "Nunito_500Medium", color: "#111827" },
  separator:         { height: 1, backgroundColor: "#F3F4F6", marginHorizontal: 18 },
  editRow:           { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 18, paddingVertical: 13 },
  editRowText:       { fontSize: 14, fontFamily: "Nunito_600SemiBold", color: "#5B4CE8" },

  partnerRow:        { flexDirection: "row", alignItems: "center", gap: 14, paddingHorizontal: 18, paddingVertical: 14 },
  partnerAvatar:     { width: 42, height: 42, borderRadius: 21, backgroundColor: "#EEF2FF", borderWidth: 1, borderColor: "#C7D2FE", alignItems: "center", justifyContent: "center" },
  partnerInitial:    { fontSize: 18, fontFamily: "Nunito_700Bold", color: "#5B4CE8" },
  partnerName:       { fontSize: 17, fontFamily: "Nunito_600SemiBold", color: "#111827" },
  partnerType:       { fontSize: 13, fontFamily: "Nunito_400Regular", color: "#9CA3AF", marginTop: 2 },

  upgradeCard:       { borderRadius: 16, overflow: "hidden", borderWidth: 1, borderColor: "#C7D2FE" },
  upgradeCardInner:  { flexDirection: "row", alignItems: "center", padding: 18, gap: 12, backgroundColor: "#EEF2FF" },
  upgradeTitle:      { fontSize: 17, fontFamily: "Nunito_700Bold", color: "#111827" },
  upgradeSub:        { fontSize: 12, fontFamily: "Nunito_400Regular", color: "#6B7280" },
  upgradePrice:      { fontSize: 17, fontFamily: "Nunito_700Bold", color: "#5B4CE8" },

  premiumActiveCard: { flexDirection: "row", alignItems: "center", gap: 14, paddingHorizontal: 18, paddingVertical: 16 },
  premiumActiveIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#ECFDF5", alignItems: "center", justifyContent: "center" },
  premiumActiveTitle:{ fontSize: 15, fontFamily: "Nunito_700Bold", color: "#111827" },
  premiumActiveSub:  { fontSize: 12, fontFamily: "Nunito_400Regular", color: "#9CA3AF", marginTop: 2 },

  actionRow:         { flexDirection: "row", alignItems: "center", gap: 14, paddingHorizontal: 18, paddingVertical: 14 },
  actionIcon:        { width: 34, height: 34, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  actionLabel:       { fontSize: 15, fontFamily: "Nunito_500Medium", color: "#111827" },
  actionSublabel:    { fontSize: 12, fontFamily: "Nunito_400Regular", color: "#9CA3AF", marginTop: 2 },

  signOutBtn:        { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, backgroundColor: "#FFF1F2", borderRadius: 16, borderWidth: 1, borderColor: "#FECDD3", paddingVertical: 15 },
  signOutText:       { fontSize: 15, fontFamily: "Nunito_600SemiBold", color: "#F43F5E" },
  appInfo:           { alignItems: "center", gap: 4, paddingVertical: 8 },
  appInfoText:       { fontSize: 12, fontFamily: "Nunito_400Regular", color: "#9CA3AF" },
});
