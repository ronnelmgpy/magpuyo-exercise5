// components/ui.tsx
// ═══════════════════════════════════════════════════════════════
// SHARED UI PRIMITIVES
// All screens import from here. One change = global update.
//
// Exports:
//   FieldLabel     — small uppercase label above inputs
//   FieldError     — red error row with icon (RHF errors)
//   GlassInput     — glass text input, border reacts to state
//   PasswordInput  — GlassInput + eye toggle
//   PrimaryButton  — pink gradient CTA
//   GhostButton    — pink-bordered glass secondary action
//   Heading        — serif display title + subtitle
//   PinkDot        — tiny brand accent dot
// ═══════════════════════════════════════════════════════════════

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { Colors, Fonts, Radii, Shadow, Spacing } from "../constants/theme";

// ── Field Label ──────────────────────────────────────────────────
export function FieldLabel({ label }: { label: string }) {
  return <Text style={s.label}>{label}</Text>;
}

// ── Field Error ──────────────────────────────────────────────────
// Only renders when message is a non-empty string.
// Plugs directly into: <FieldError message={errors.email?.message} />
export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <View style={s.errorRow}>
      <Ionicons
        name="alert-circle-outline"
        size={12}
        color={Colors.textError}
      />
      <Text style={s.errorText}>{message}</Text>
    </View>
  );
}

// ── Glass Input ──────────────────────────────────────────────────
// Transparent input with dynamic border:
//   default  → dim pink border
//   focused  → pink border
//   error    → red border
interface GlassInputProps extends TextInputProps {
  error?: string;
  rightIcon?: React.ReactNode;
}

export function GlassInput({
  error,
  rightIcon,
  style,
  ...props
}: GlassInputProps) {
  const [focused, setFocused] = useState(false);

  const borderColor = error
    ? Colors.borderError
    : focused
      ? Colors.borderPink
      : Colors.border;

  return (
    <View style={[s.inputWrap, { borderColor }]}>
      <TextInput
        style={[s.input, style as TextStyle]}
        placeholderTextColor={Colors.textSecondary}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...props}
      />
      {rightIcon && <View style={s.inputRight}>{rightIcon}</View>}
    </View>
  );
}

// ── Password Input ───────────────────────────────────────────────
interface PasswordInputProps extends Omit<TextInputProps, "secureTextEntry"> {
  error?: string;
}

export function PasswordInput(props: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  return (
    <GlassInput
      {...props}
      secureTextEntry={!visible}
      rightIcon={
        <TouchableOpacity
          onPress={() => setVisible((v) => !v)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name={visible ? "eye-outline" : "eye-off-outline"}
            size={17}
            color={Colors.textSecondary}
          />
        </TouchableOpacity>
      }
    />
  );
}

// ── Primary Button ───────────────────────────────────────────────
// Pink gradient fill. Shows spinner while loading.
interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export function PrimaryButton({
  label,
  onPress,
  loading,
  disabled,
  style,
}: PrimaryButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading || disabled}
      activeOpacity={0.8}
      style={[(loading || disabled) && s.btnOff, style]}
    >
      <LinearGradient
        colors={Colors.gradientStart ? [Colors.gradientStart, Colors.gradientEnd] : ["#FF6B9D", "#C44569"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[s.primaryBtn, Shadow.pink]}
      >
        {loading ? (
          <ActivityIndicator color={Colors.white} size="small" />
        ) : (
          <Text style={s.primaryText}>{label}</Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

// ── Ghost Button ─────────────────────────────────────────────────
// Glass fill + pink border. Used for secondary actions.
interface GhostButtonProps {
  label: string;
  onPress: () => void;
  style?: ViewStyle;
}

export function GhostButton({ label, onPress, style }: GhostButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[s.ghostBtn, style]}
    >
      <Text style={s.ghostText}>{label}</Text>
    </TouchableOpacity>
  );
}

// ── Heading ──────────────────────────────────────────────────────
export function Heading({ title, sub }: { title: string; sub?: string }) {
  return (
    <View style={s.heading}>
      <Text style={s.headingTitle}>{title}</Text>
      {sub ? <Text style={s.headingSub}>{sub}</Text> : null}
    </View>
  );
}

// ── Pink Dot ───────────────────────────────────────────────────
export function PinkDot() {
  return <View style={s.dot} />;
}

// Backwards compatibility alias
export const OrangeDot = PinkDot;

// ── Styles ───────────────────────────────────────────────────────
const s = StyleSheet.create({
  label: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.1,
    textTransform: "uppercase",
    color: Colors.textSecondary,
    marginBottom: 7,
    fontFamily: Fonts.body,
  },
  errorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 6,
  },
  errorText: {
    fontSize: 12,
    color: Colors.textError,
    fontFamily: Fonts.body,
    flex: 1,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.glassInput,
    borderWidth: 1,
    borderRadius: Radii.md,
    paddingHorizontal: Spacing.md,
    height: 54,
  },
  input: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 15,
    fontFamily: Fonts.body,
  },
  inputRight: { marginLeft: Spacing.sm },

  primaryBtn: {
    height: 54,
    borderRadius: Radii.md,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  btnOff: { opacity: 0.5 },
  primaryText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    fontFamily: Fonts.body,
  },

  ghostBtn: {
    height: 54,
    borderRadius: Radii.md,
    backgroundColor: Colors.glass,
    borderWidth: 1,
    borderColor: Colors.borderPink,
    alignItems: "center",
    justifyContent: "center",
  },
  ghostText: {
    color: Colors.pinkLight,
    fontSize: 14,
    fontWeight: "500",
    fontFamily: Fonts.body,
  },

  heading: { marginBottom: Spacing.xl },
  headingTitle: {
    fontSize: 36,
    fontWeight: "700",
    color: Colors.textPrimary,
    fontFamily: Fonts.display,
    lineHeight: 42,
    letterSpacing: -0.5,
  },
  headingSub: {
    marginTop: 10,
    fontSize: 14,
    color: Colors.textSecondary,
    fontFamily: Fonts.body,
    lineHeight: 22,
  },

  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.pink,
    marginBottom: Spacing.lg,
  },
});

