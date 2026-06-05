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
  icon,
  label,
  sublabel,
  color,
  onPress,
  showChevron = true,
}: {
  icon: string;
  label: string;
  sublabel?: string;
  color?: string;
  onPress: () => void;
  showChevron?: boolean;
}) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.actionRow}>
      <View style={[styles.actionIcon, { backgroundColor: (color || "#E85C7A") + "18" }]}>
        <Feather name={icon as any} size={16} color={color || "#E85C7A"} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.actionLabel, color ? { color } : {}]}>{label}</Text>
        {sublabel ? <Text style={styles.actionSublabel}>{sublabel}</Text> : null}
      </View>
      {showChevron && (
        <Feather name="chevron-right" size={16} color="rgba(240,235,248,0.2)" />
      )}
    </TouchableOpacity>
  );
}

function SetPasswordModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
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
    if (result.success) {
      setSuccess(true);
      setTimeout(onClose, 1400);
    } else {
      setError(result.error || "Something went wrong.");
    }
  };

  return (
    <View style={pwStyles.overlay}>
      <Pressable style={pwStyles.backdrop} onPress={onClose} />
      <View style={pwStyles.sheet}>
        <View style={pwStyles.handle} />

        {alreadyRegistered ? (
          /* ── Already has a real account ── */
          <>
            <Text style={pwStyles.title}>Account</Text>
            <View style={pwStyles.accountRow}>
              <View style={pwStyles.accountIcon}>
                <Feather name="check-circle" size={18} color="#52C8B8" />
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
              <LinearGradient
                colors={["#E85C7A", "#B855E0"]}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={pwStyles.saveBtnGrad}
              >
                <Text style={pwStyles.saveBtnText}>Done</Text>
              </LinearGradient>
            </TouchableOpacity>
          </>
        ) : success ? (
          /* ── Success state ── */
          <View style={pwStyles.successRow}>
            <Feather name="check-circle" size={20} color="#4CAF50" />
            <Text style={pwStyles.successText}>Account created! You're all set.</Text>
          </View>
        ) : (
          /* ── Registration form ── */
          <>
            <Text style={pwStyles.title}>Create an account</Text>
            <Text style={pwStyles.sub}>
              Back up your readings and sign back in on any device.
            </Text>
            <TextInput
              style={pwStyles.input}
              value={email}
              onChangeText={(t) => { setEmail(t); setError(""); }}
              placeholder="Email address"
              placeholderTextColor="rgba(240,235,248,0.25)"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={pwStyles.input}
              value={password}
              onChangeText={(t) => { setPassword(t); setError(""); }}
              placeholder="Password (min. 6 chars)"
              placeholderTextColor="rgba(240,235,248,0.25)"
              secureTextEntry
            />
            <TextInput
              style={pwStyles.input}
              value={confirm}
              onChangeText={(t) => { setConfirm(t); setError(""); }}
              placeholder="Confirm password"
              placeholderTextColor="rgba(240,235,248,0.25)"
              secureTextEntry
            />
            {error ? <Text style={pwStyles.error}>{error}</Text> : null}
            <TouchableOpacity
              onPress={handleSave}
              disabled={loading}
              activeOpacity={0.85}
              style={[pwStyles.saveBtn, loading && { opacity: 0.6 }]}
            >
              <LinearGradient
                colors={["#E85C7A", "#B855E0"]}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={pwStyles.saveBtnGrad}
              >
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
  overlay: { ...StyleSheet.absoluteFillObject, zIndex: 100, justifyContent: "flex-end" },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.6)" },
  sheet: {
    backgroundColor: "#110F1E",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    gap: 14,
    borderTopWidth: 1,
    borderColor: "rgba(240,235,248,0.07)",
  },
  handle: {
    width: 36, height: 4, borderRadius: 2,
    backgroundColor: "rgba(240,235,248,0.12)",
    alignSelf: "center",
    marginBottom: 6,
  },
  title: { fontSize: 20, fontFamily: "Nunito_700Bold", color: "#F0EBF8" },
  sub: {
    fontSize: 13, fontFamily: "Nunito_400Regular",
    color: "rgba(240,235,248,0.4)", lineHeight: 20,
  },
  input: {
    backgroundColor: "#1A1735",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(240,235,248,0.08)",
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    fontFamily: "Nunito_400Regular",
    color: "#F0EBF8",
  },
  error: { fontSize: 13, fontFamily: "Nunito_400Regular", color: "#E85C7A" },
  saveBtn: { borderRadius: 14, overflow: "hidden" },
  saveBtnGrad: {
    alignItems: "center", justifyContent: "center",
    paddingVertical: 16,
  },
  saveBtnText: { fontSize: 16, fontFamily: "Nunito_700Bold", color: "#fff" },
  accountRow: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "rgba(82,200,184,0.08)", borderRadius: 12, padding: 14, borderWidth: 1, borderColor: "rgba(82,200,184,0.2)" },
  accountIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(82,200,184,0.15)", alignItems: "center", justifyContent: "center" },
  accountLabel: { fontSize: 11, fontFamily: "Nunito_500Medium", color: "rgba(240,235,248,0.4)", textTransform: "uppercase", letterSpacing: 0.5 },
  accountEmail: { fontSize: 15, fontFamily: "Nunito_600SemiBold", color: "#F0EBF8", marginTop: 2 },
  successRow: { flexDirection: "row", alignItems: "center", gap: 10, justifyContent: "center", paddingVertical: 20 },
  successText: { fontSize: 15, fontFamily: "Nunito_600SemiBold", color: "#4CAF50" },
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
    if (userName.trim().length < 2)      { setError("Your name must be at least 2 characters."); return; }
    if (!userBirthDate)                   { setError("Your birth date is required."); return; }
    if (partnerName.trim().length < 2)   { setError("Their name must be at least 2 characters."); return; }
    if (!partnerBirthDate)                { setError("Their birth date is required."); return; }

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
        <TextInput style={editStyles.input} value={userName} onChangeText={(t) => { setUserName(t); setError(""); }} placeholder="Your first name" placeholderTextColor="rgba(240,235,248,0.25)" />
        <TextInput style={editStyles.input} value={userBirthDate} onChangeText={(t) => { setUserBirthDate(t); setError(""); }} placeholder="Your birth date (YYYY-MM-DD)" placeholderTextColor="rgba(240,235,248,0.25)" keyboardType="numbers-and-punctuation" />
        <TextInput style={editStyles.input} value={userBirthTime} onChangeText={(t) => { setUserBirthTime(t); setError(""); }} placeholder="Birth time (optional, e.g. 3:45 PM)" placeholderTextColor="rgba(240,235,248,0.25)" />

        <Text style={[editStyles.sectionLabel, { marginTop: 8 }]}>THEIR INFO</Text>
        <TextInput style={editStyles.input} value={partnerName} onChangeText={(t) => { setPartnerName(t); setError(""); }} placeholder="Their first name" placeholderTextColor="rgba(240,235,248,0.25)" />
        <TextInput style={editStyles.input} value={partnerBirthDate} onChangeText={(t) => { setPartnerBirthDate(t); setError(""); }} placeholder="Their birth date (YYYY-MM-DD)" placeholderTextColor="rgba(240,235,248,0.25)" keyboardType="numbers-and-punctuation" />

        <Text style={[editStyles.sectionLabel, { marginTop: 8 }]}>RELATIONSHIP TYPE</Text>
        <View style={editStyles.relRow}>
          {REL_TYPES.map((r) => (
            <TouchableOpacity
              key={r.key}
              onPress={() => setRelType(r.key)}
              style={[editStyles.relChip, relType === r.key && editStyles.relChipActive]}
            >
              <Text style={[editStyles.relChipText, relType === r.key && editStyles.relChipTextActive]}>{r.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {error ? <Text style={editStyles.error}>{error}</Text> : null}

        <TouchableOpacity onPress={handleSave} disabled={saving} activeOpacity={0.85} style={[editStyles.saveBtn, saving && { opacity: 0.6 }]}>
          <LinearGradient colors={["#E85C7A", "#B855E0"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={editStyles.saveGrad}>
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
  overlay:      { ...StyleSheet.absoluteFillObject, zIndex: 200, justifyContent: "flex-end" },
  backdrop:     { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.6)" },
  sheet:        { backgroundColor: "#110F1E", borderTopLeftRadius: 24, borderTopRightRadius: 24, borderTopWidth: 1, borderColor: "rgba(240,235,248,0.07)", maxHeight: "92%" },
  sheetContent: { padding: 24, paddingBottom: 48, gap: 12 },
  handle:       { width: 36, height: 4, borderRadius: 2, backgroundColor: "rgba(240,235,248,0.12)", alignSelf: "center", marginBottom: 8 },
  title:        { fontSize: 20, fontFamily: "Nunito_700Bold", color: "#F0EBF8", marginBottom: 4 },
  sectionLabel: { fontSize: 11, fontFamily: "Nunito_600SemiBold", color: "rgba(240,235,248,0.35)", letterSpacing: 1, textTransform: "uppercase" },
  input:        { backgroundColor: "#1A1735", borderRadius: 12, borderWidth: 1, borderColor: "rgba(240,235,248,0.08)", paddingHorizontal: 14, paddingVertical: 13, fontSize: 15, fontFamily: "Nunito_400Regular", color: "#F0EBF8" },
  relRow:       { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  relChip:      { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: "rgba(240,235,248,0.1)", backgroundColor: "rgba(26,22,48,0.6)" },
  relChipActive:{ borderColor: "rgba(232,92,122,0.5)", backgroundColor: "rgba(232,92,122,0.08)" },
  relChipText:  { fontSize: 14, fontFamily: "Nunito_500Medium", color: "rgba(240,235,248,0.5)" },
  relChipTextActive: { color: "#E85C7A" },
  error:        { fontSize: 13, fontFamily: "Nunito_400Regular", color: "#E85C7A" },
  saveBtn:      { borderRadius: 14, overflow: "hidden", marginTop: 4 },
  saveGrad:     { alignItems: "center", justifyContent: "center", paddingVertical: 16 },
  saveBtnText:  { fontSize: 16, fontFamily: "Nunito_700Bold", color: "#fff" },
  cancelBtn:    { alignItems: "center", padding: 8 },
  cancelText:   { fontSize: 14, fontFamily: "Nunito_400Regular", color: "rgba(240,235,248,0.35)" },
});

// ─── Profile Screen ────────────────────────────────────────────────────────────

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, partner, isPremium, upgradeToPremium, resetApp } = useApp();
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
            // logout() clears auth state first so login screen doesn't
            // redirect an "authenticated" user away. Navigate immediately
            // after — no blank flash. resetApp cleans up profile data after.
            await logout();
            router.replace("/login");
            resetApp().catch(() => {});
          },
        },
      ]
    );
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  };

  const relTypeLabel: Record<string, string> = {
    crush: "Crush",
    situationship: "Situationship",
    relationship: "Relationship",
    ex: "Ex",
  };

  const handleReset = () => {
    Alert.alert(
      "Reset everything?",
      "This will clear all your data including your profile, connection, and chat history. You will be taken back to the start. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            // Navigate first so the profile screen stays rendered during
            // the transition — no blank flash. resetApp clears profile after.
            router.replace("/onboarding");
            resetApp().catch(() => {});
          },
        },
      ]
    );
  };

  return (
    <LinearGradient colors={["#080611", "#0D0A1E"]} style={{ flex: 1 }}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="chevron-left" size={24} color="rgba(240,235,248,0.7)" />
        </Pressable>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 40 }]}
      >
        {/* Avatar area */}
        <View style={styles.avatarSection}>
          <LinearGradient
            colors={["#E85C7A", "#B855E0"]}
            style={styles.avatar}
          >
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
          {user.birthTime ? (
            <>
              <View style={styles.separator} />
              <InfoRow label="Birth time" value={user.birthTime} />
            </>
          ) : null}
          <View style={styles.separator} />
          <TouchableOpacity onPress={() => setShowEditProfile(true)} activeOpacity={0.7} style={styles.editRow}>
            <Feather name="edit-2" size={14} color="#E85C7A" />
            <Text style={styles.editRowText}>Edit profile & connection</Text>
          </TouchableOpacity>
        </Section>

        {/* Partner info */}
        <Section title="Your Connection">
          <View style={styles.partnerRow}>
            <View style={styles.partnerAvatar}>
              <Text style={styles.partnerInitial}>{partner.name.charAt(0) || "?"}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.partnerName}>{partner.name}</Text>
              <Text style={styles.partnerType}>
                {relTypeLabel[partner.relationshipType]}
              </Text>
            </View>
          </View>
          <View style={styles.separator} />
          <InfoRow label="Their birthday" value={formatDate(partner.birthDate)} />
        </Section>

        {/* Premium */}
        {!isPremium && (
          <Section title="Subscription">
            <TouchableOpacity
              onPress={() => setShowPremiumGate(true)}
              activeOpacity={0.85}
              style={styles.upgradeCard}
            >
              <LinearGradient
                colors={["rgba(232,92,122,0.2)", "rgba(184,85,224,0.1)"]}
                style={styles.upgradeCardInner}
              >
                <View style={{ flex: 1, gap: 4 }}>
                  <Text style={styles.upgradeTitle}>Unlock Premium</Text>
                  <Text style={styles.upgradeSub}>
                    All insights · Unlimited guidance · Deep reads
                  </Text>
                </View>
                <Text style={styles.upgradePrice}>$9.99/mo</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Section>
        )}

        {isPremium && (
          <Section title="Subscription">
            <View style={styles.premiumActiveCard}>
              <Text style={styles.premiumActiveIcon}>◈</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.premiumActiveTitle}>Premium Active</Text>
                <Text style={styles.premiumActiveSub}>
                  All features unlocked · Unlimited guidance
                </Text>
              </View>
            </View>
          </Section>
        )}

        {/* Actions */}
        <Section title="Account">
          <ActionRow
            icon="key"
            label="Account"
            sublabel={currentEmail ?? "Signed in"}
            onPress={() => setShowSetPassword(true)}
          />
          <View style={styles.separator} />
          <ActionRow
            icon="refresh-cw"
            label="Change connection"
            sublabel="Update who you're analyzing"
            onPress={() => setShowEditProfile(true)}
          />
          <View style={styles.separator} />
          <ActionRow
            icon="trash-2"
            label="Reset everything"
            sublabel="Start completely fresh"
            color="#ef4444"
            onPress={handleReset}
            showChevron={false}
          />
        </Section>

        {/* Sign out */}
        <TouchableOpacity onPress={handleSignOut} activeOpacity={0.75} style={styles.signOutBtn}>
          <Feather name="log-out" size={16} color="rgba(232,92,122,0.7)" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        {/* App info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>Lumble · Version 1.0</Text>
          <Text style={styles.appInfoText}>Your data stays on this device</Text>
        </View>
      </ScrollView>

      <PremiumGate
        visible={showPremiumGate}
        onClose={() => setShowPremiumGate(false)}
      />

      <SetPasswordModal
        visible={showSetPassword}
        onClose={() => setShowSetPassword(false)}
      />

      <EditProfileModal
        visible={showEditProfile}
        onClose={() => setShowEditProfile(false)}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(240,235,248,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 17,
    fontFamily: "Nunito_600SemiBold",
    color: "#F0EBF8",
  },
  scroll: {
    paddingHorizontal: 20,
    gap: 20,
    paddingTop: 8,
  },
  avatarSection: {
    alignItems: "center",
    gap: 10,
    paddingVertical: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: {
    fontSize: 34,
    fontFamily: "Nunito_700Bold",
    color: "#fff",
  },
  userName: {
    fontSize: 24,
    fontFamily: "Nunito_700Bold",
    color: "#F0EBF8",
  },
  premiumBadge: {
    backgroundColor: "rgba(232,92,122,0.12)",
    borderWidth: 1,
    borderColor: "rgba(232,92,122,0.3)",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 5,
  },
  premiumBadgeText: {
    fontSize: 12,
    fontFamily: "Nunito_600SemiBold",
    color: "#E85C7A",
  },
  freeBadge: {
    backgroundColor: "rgba(240,235,248,0.05)",
    borderWidth: 1,
    borderColor: "rgba(240,235,248,0.1)",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 5,
  },
  freeBadgeText: {
    fontSize: 12,
    fontFamily: "Nunito_400Regular",
    color: "rgba(240,235,248,0.35)",
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: "Nunito_600SemiBold",
    color: "rgba(240,235,248,0.35)",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    paddingHorizontal: 4,
  },
  sectionCard: {
    backgroundColor: "#110F1E",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(240,235,248,0.07)",
    overflow: "hidden",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  infoLabel: {
    fontSize: 15,
    fontFamily: "Nunito_400Regular",
    color: "rgba(240,235,248,0.55)",
  },
  infoValue: {
    fontSize: 15,
    fontFamily: "Nunito_500Medium",
    color: "#F0EBF8",
  },
  separator: {
    height: 1,
    backgroundColor: "rgba(240,235,248,0.05)",
    marginHorizontal: 18,
  },
  editRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 13,
  },
  editRowText: {
    fontSize: 14,
    fontFamily: "Nunito_500Medium",
    color: "#E85C7A",
  },
  partnerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  partnerAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(184,85,224,0.15)",
    borderWidth: 1,
    borderColor: "rgba(184,85,224,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  partnerInitial: {
    fontSize: 18,
    fontFamily: "Nunito_700Bold",
    color: "#B855E0",
  },
  partnerName: {
    fontSize: 17,
    fontFamily: "Nunito_600SemiBold",
    color: "#F0EBF8",
  },
  partnerType: {
    fontSize: 13,
    fontFamily: "Nunito_400Regular",
    color: "rgba(240,235,248,0.4)",
    marginTop: 2,
  },
  upgradeCard: {
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(232,92,122,0.2)",
  },
  upgradeCardInner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    gap: 12,
  },
  upgradeTitle: {
    fontSize: 16,
    fontFamily: "Nunito_700Bold",
    color: "#F0EBF8",
  },
  upgradeSub: {
    fontSize: 12,
    fontFamily: "Nunito_400Regular",
    color: "rgba(240,235,248,0.45)",
  },
  upgradePrice: {
    fontSize: 15,
    fontFamily: "Nunito_700Bold",
    color: "#E85C7A",
  },
  premiumActiveCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  premiumActiveIcon: {
    fontSize: 24,
    color: "#E85C7A",
  },
  premiumActiveTitle: {
    fontSize: 16,
    fontFamily: "Nunito_700Bold",
    color: "#F0EBF8",
  },
  premiumActiveSub: {
    fontSize: 12,
    fontFamily: "Nunito_400Regular",
    color: "rgba(240,235,248,0.4)",
    marginTop: 2,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  actionIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  actionLabel: {
    fontSize: 15,
    fontFamily: "Nunito_500Medium",
    color: "#F0EBF8",
  },
  actionSublabel: {
    fontSize: 12,
    fontFamily: "Nunito_400Regular",
    color: "rgba(240,235,248,0.35)",
    marginTop: 1,
  },
  signOutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "rgba(232,92,122,0.06)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(232,92,122,0.15)",
    paddingVertical: 15,
  },
  signOutText: {
    fontSize: 15,
    fontFamily: "Nunito_600SemiBold",
    color: "rgba(232,92,122,0.7)",
  },
  appInfo: {
    alignItems: "center",
    gap: 4,
    paddingVertical: 8,
  },
  appInfoText: {
    fontSize: 12,
    fontFamily: "Nunito_400Regular",
    color: "rgba(240,235,248,0.2)",
  },
});
