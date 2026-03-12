// app/home.tsx
// ═══════════════════════════════════════════════════════════════
// HOME SCREEN — Modern, centered, pink gradient design
// ═══════════════════════════════════════════════════════════════

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Fonts, Gradients, Radii, Shadow, Spacing } from "../constants/theme";
import { useAuth } from "../hooks/useAuth";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const { user, logout } = useAuth();

  const firstName = user?.firstName ?? "";
  const lastName = user?.lastName ?? "";
  const hasName = firstName || lastName;
  const displayName = hasName
    ? `${firstName} ${lastName}`.trim()
    : (user?.email ?? "there");
  const shortName = hasName ? firstName || displayName : "You";
  const initials = hasName
    ? `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase()
    : (user?.email?.[0] ?? "?").toUpperCase();

  return (
    <LinearGradient
      colors={Gradients.background}
      style={s.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={s.safe}>
        <ScrollView
          contentContainerStyle={s.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* ── Top bar ─────────────────────────────────────── */}
          <View style={s.topBar}>
            <View style={s.topLeft}>
              {user?.avatar ? (
                <Image source={{ uri: user.avatar }} style={s.avatar} />
              ) : (
                <LinearGradient
                  colors={Gradients.button}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={s.avatarFallback}
                >
                  <Text style={s.avatarInit}>{initials}</Text>
                </LinearGradient>
              )}
              <View>
                <Text style={s.topLabel}>Signed in as</Text>
                <Text style={s.topEmail} numberOfLines={1}>
                  {user?.email}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={logout}
              style={s.logoutBtn}
              activeOpacity={0.7}
            >
              <Ionicons
                name="log-out-outline"
                size={17}
                color={Colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          {/* ── Hero ─────────────────────────────────────────── */}
          <View style={s.hero}>
            {/* Glow orb behind the card */}
            <View style={s.glowOrb} />

            <View style={s.heroCard}>
              <LinearGradient
                colors={Gradients.primary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={s.heroAccent}
              />
              <Text style={s.heroLabel}>WELCOME ABOARD</Text>
              <Text style={s.heroName}>
                Hey,{"\n"}
                {shortName}.
              </Text>
              <Text style={s.heroSub}>
                Your account is active and you're all set.
              </Text>
              <View style={s.verifiedBadge}>
                <Ionicons
                  name="shield-checkmark"
                  size={13}
                  color={Colors.pink}
                />
                <Text style={s.verifiedText}>Account verified</Text>
              </View>
            </View>
          </View>

          {/* ── Stats row ────────────────────────────────────── */}
          <View style={s.statsRow}>
            {[
              { icon: "flash-outline" as const, label: "Sessions", value: "1" },
              { icon: "star-outline" as const, label: "Points", value: "0" },
              { icon: "people-outline" as const, label: "Network", value: "0" },
            ].map((item) => (
              <View key={item.label} style={s.statCard}>
                <View style={s.statIconWrap}>
                  <Ionicons name={item.icon} size={16} color={Colors.pink} />
                </View>
                <Text style={s.statValue}>{item.value}</Text>
                <Text style={s.statLabel}>{item.label}</Text>
              </View>
            ))}
          </View>

          {/* ── Quick actions ─────────────────────────────────── */}
          <Text style={s.sectionLabel}>QUICK ACTIONS</Text>
          <View style={s.actionsGrid}>
            {[
              { icon: "person-outline" as const, label: "Edit Profile" },
              { icon: "settings-outline" as const, label: "Settings" },
              { icon: "notifications-outline" as const, label: "Alerts" },
              { icon: "help-circle-outline" as const, label: "Support" },
            ].map((item) => (
              <TouchableOpacity
                key={item.label}
                style={s.actionCard}
                activeOpacity={0.7}
              >
                <View style={s.actionIcon}>
                  <Ionicons name={item.icon} size={20} color={Colors.pink} />
                </View>
                <Text style={s.actionLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ── Dev note ─────────────────────────────────────── */}
          <View style={s.devNote}>
            <Ionicons
              name="code-outline"
              size={13}
              color={Colors.textSecondary}
            />
            <Text style={s.devText}>
              Replace fake API in <Text style={s.devCode}>hooks/useAuth.tsx</Text>{" "}
              with Supabase, Firebase, or your backend.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

// ── Styles ───────────────────────────────────────────────────────
const s = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safe: { flex: 1 },
  scroll: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xxl,
  },

  // Top bar
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  topLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    flex: 1,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2,
    borderColor: Colors.pink,
  },
  avatarFallback: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarInit: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: "700",
    fontFamily: Fonts.body,
  },
  topLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontFamily: Fonts.body,
    letterSpacing: 0.5,
  },
  topEmail: {
    fontSize: 13,
    color: Colors.textPrimary,
    fontFamily: Fonts.body,
    fontWeight: "600",
    maxWidth: width * 0.5,
  },
  logoutBtn: {
    width: 36,
    height: 36,
    backgroundColor: Colors.glass,
    borderRadius: Radii.sm,
    borderWidth: 1,
    borderColor: Colors.borderPink,
    alignItems: "center",
    justifyContent: "center",
  },

  // Hero section
  hero: {
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  glowOrb: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: Colors.pinkGlow,
    top: -60,
    alignSelf: "center",
    opacity: 0.4,
  },
  heroCard: {
    width: "100%",
    backgroundColor: Colors.glass,
    borderWidth: 1,
    borderColor: Colors.borderPink,
    borderRadius: Radii.xl,
    padding: Spacing.xl,
    overflow: "hidden",
    ...Shadow.card,
  },
  heroAccent: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    borderTopLeftRadius: Radii.xl,
    borderBottomLeftRadius: Radii.xl,
  },
  heroLabel: {
    fontSize: 10,
    letterSpacing: 2.5,
    color: Colors.pink,
    fontWeight: "700",
    fontFamily: Fonts.body,
    marginBottom: 8,
  },
  heroName: {
    fontSize: 40,
    fontWeight: "700",
    color: Colors.textPrimary,
    fontFamily: Fonts.display,
    lineHeight: 46,
    letterSpacing: -1,
    marginBottom: 10,
  },
  heroSub: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontFamily: Fonts.body,
    lineHeight: 21,
    marginBottom: Spacing.md,
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    alignSelf: "flex-start",
    backgroundColor: Colors.pinkPale,
    borderRadius: Radii.full,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: Colors.borderPink,
  },
  verifiedText: {
    color: Colors.pink,
    fontSize: 11,
    fontWeight: "700",
    fontFamily: Fonts.body,
    letterSpacing: 0.4,
  },

  // Stats
  statsRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.glass,
    borderWidth: 1,
    borderColor: Colors.borderPink,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    alignItems: "center",
    gap: 5,
    ...Shadow.card,
  },
  statIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.pinkPale,
    borderWidth: 1,
    borderColor: Colors.borderPink,
    alignItems: "center",
    justifyContent: "center",
  },
  statValue: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.textPrimary,
    fontFamily: Fonts.display,
  },
  statLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontFamily: Fonts.body,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },

  // Quick actions
  sectionLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontFamily: Fonts.body,
    letterSpacing: 2,
    fontWeight: "700",
    marginBottom: Spacing.md,
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  actionCard: {
    width: (width - Spacing.lg * 2 - Spacing.sm) / 2,
    backgroundColor: Colors.glass,
    borderWidth: 1,
    borderColor: Colors.borderPink,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    alignItems: "center",
    gap: 8,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.pinkPale,
    borderWidth: 1,
    borderColor: Colors.borderPink,
    alignItems: "center",
    justifyContent: "center",
  },
  actionLabel: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontFamily: Fonts.body,
    fontWeight: "600",
  },

  // Dev note
  devNote: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 7,
    backgroundColor: Colors.glass,
    borderWidth: 1,
    borderColor: Colors.borderPink,
    borderRadius: Radii.md,
    padding: Spacing.md,
  },
  devText: {
    flex: 1,
    fontSize: 12,
    color: Colors.textSecondary,
    fontFamily: Fonts.body,
    lineHeight: 18,
  },
  devCode: {
    color: Colors.pinkLight,
  },
});

