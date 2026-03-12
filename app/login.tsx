// app/login.tsx
// ═══════════════════════════════════════════════════════════════
// LOGIN SCREEN
// ───────────────────────────────────────────────────────────────
//
// ┌─ REACT HOOK FORM — HOW IT WORKS ───────────────────────────┐
// │                                                             │
// │  1. useForm<T>({ defaultValues, mode })                     │
// │     • Initialises the form engine                           │
// │     • T = TypeScript type of your fields                    │
// │     • mode: "onTouched" validates when user leaves a field  │
// │                                                             │
// │  2. control                                                 │
// │     • Internal object that tracks all field states          │
// │     • Pass to every <Controller control={control} />        │
// │                                                             │
// │  3. <Controller name rules render />                        │
// │     • Bridges RHF with React Native TextInput               │
// │     • render gives you: onChange, onBlur, value             │
// │     • rules defines validation: required, pattern, min...   │
// │                                                             │
// │  4. handleSubmit(fn)                                        │
// │     • Runs ALL validation rules first                       │
// │     • Only calls fn() when every field passes               │
// │     • Sets isSubmitting=true during fn()                    │
// │                                                             │
// │  5. formState.errors                                        │
// │     • errors.email?.message — string or undefined           │
// │     • errors.password?.message                              │
// │                                                             │
// │  VALIDATION RULES used in this file:                        │
// │    required: "msg"   → field must not be empty              │
// │    pattern: { value: /regex/, message: "msg" }            │
// │    minLength: { value: n, message: "msg" }                │
// └─────────────────────────────────────────────────────────────┘
//
// LOGIN GUARD:
//   The useAuth().login() function checks the in-memory registry.
//   If the email was never registered → returns an error.
//   Error is displayed below the password field.
// ═══════════════════════════════════════════════════════════════

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  FieldError,
  FieldLabel,
  GlassInput,
  Heading,
  PasswordInput,
  PinkDot,
  PrimaryButton,
} from "../components/ui";
import { Colors, Fonts, Gradients, Radii, Shadow, Spacing } from "../constants/theme";
import { useAuth } from "../hooks/useAuth";

// ── Form type ────────────────────────────────────────────────────
// useForm<LoginForm> makes all field names type-safe
interface LoginForm {
  email: string;
  password: string;
}

export default function LoginScreen() {
  const { login } = useAuth();
  const router = useRouter();
  const [apiError, setApiError] = useState("");

  // ── Initialise form ──────────────────────────────────────────
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    defaultValues: { email: "", password: "" },
    mode: "onTouched", // validate each field on blur (when user leaves it)
  });

  // ── Submit handler ───────────────────────────────────────────
  // handleSubmit() only runs this when ALL fields pass validation.
  // If email was never registered, login() returns an error string.
  const onSubmit = async ({ email, password }: LoginForm) => {
    setApiError("");
    const { error } = await login(email, password);
    if (error) setApiError(error);
  };

  return (
    <LinearGradient
      colors={Gradients.background}
      style={s.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={s.safe}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            contentContainerStyle={s.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* ── Centered glass card ──────────────────────── */}
            <View style={s.card}>
              <PinkDot />

              <Heading
                title={"Sign in."}
                sub="Enter your registered email and password."
              />

              {/* ── Email ──────────────────────────────────── */}
              {/* Controller wraps our TextInput so RHF can    */}
              {/* track its value, trigger validation, etc.    */}
              <View style={s.field}>
                <FieldLabel label="Email address" />
                <Controller
                  name="email"
                  control={control}
                  rules={{
                    required: "Email address is required.",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter a valid email address.",
                    },
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <GlassInput
                      placeholder="you@example.com"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoComplete="email"
                      onChangeText={onChange} // ← RHF onChange
                      onBlur={onBlur} // ← triggers validation
                      value={value} // ← controlled value
                      error={errors.email?.message}
                    />
                  )}
                />
                <FieldError message={errors.email?.message} />
              </View>

              {/* ── Password ───────────────────────────────── */}
              <View style={s.field}>
                <FieldLabel label="Password" />
                <Controller
                  name="password"
                  control={control}
                  rules={{
                    required: "Password is required.",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters.",
                    },
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <PasswordInput
                      placeholder="••••••••"
                      autoComplete="password"
                      onChangeText={onChange}
                      onBlur={onBlur}
                      value={value}
                      error={errors.password?.message}
                    />
                  )}
                />
                <FieldError message={errors.password?.message} />
              </View>

              {/* ── API / auth error ───────────────────────── */}
              {/* Shows when: email not registered, wrong pwd  */}
              {!!apiError && (
                <View style={s.apiErrorBox}>
                  <Ionicons
                    name="warning-outline"
                    size={15}
                    color={Colors.textError}
                  />
                  <Text style={s.apiErrorText}>{apiError}</Text>
                </View>
              )}

              {/* ── Submit ─────────────────────────────────── */}
              {/* handleSubmit validates ALL fields first.      */}
              {/* isSubmitting auto-true while login() runs.   */}
              <PrimaryButton
                label="Sign In"
                onPress={handleSubmit(onSubmit)}
                loading={isSubmitting}
                style={s.btn}
              />

              {/* Divider */}
              <View style={s.divRow}>
                <View style={s.divLine} />
                <Text style={s.divLabel}>no account?</Text>
                <View style={s.divLine} />
              </View>

              {/* Register link */}
              <TouchableOpacity
                style={s.registerBtn}
                onPress={() => router.push("/register")}
                activeOpacity={0.7}
              >
                <Text style={s.registerText}>Create an account</Text>
              </TouchableOpacity>
            </View>

            {/* Footer hint */}
            <Text style={s.hint}>You must register before you can sign in.</Text>
          </ScrollView>
        </KeyboardAvoidingView>
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

  // Full-screen centered scroll
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: Spacing.xxl,
    paddingHorizontal: Spacing.lg,
  },

  // Glass card — the main login panel
  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: Colors.glass,
    borderWidth: 1,
    borderColor: Colors.borderPink,
    borderRadius: Radii.xl,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: 36,
    ...Shadow.card,
  },

  field: { marginBottom: Spacing.md },

  // API error box
  apiErrorBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: "rgba(255,79,79,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,79,79,0.3)",
    borderRadius: Radii.sm,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  apiErrorText: {
    color: Colors.textError,
    fontSize: 13,
    fontFamily: Fonts.body,
    flex: 1,
    lineHeight: 19,
  },

  btn: { marginTop: Spacing.sm },

  // Divider
  divRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: Spacing.lg,
    gap: Spacing.md,
  },
  divLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  divLabel: {
    color: Colors.textSecondary,
    fontSize: 11,
    fontFamily: Fonts.body,
    letterSpacing: 0.5,
  },

  // Register ghost-style button
  registerBtn: {
    height: 54,
    borderRadius: Radii.md,
    backgroundColor: Colors.glass,
    borderWidth: 1,
    borderColor: Colors.borderPink,
    alignItems: "center",
    justifyContent: "center",
  },
  registerText: {
    color: Colors.pinkLight,
    fontSize: 14,
    fontWeight: "500",
    fontFamily: Fonts.body,
  },

  // Footer hint
  hint: {
    marginTop: Spacing.lg,
    color: Colors.textSecondary,
    fontSize: 12,
    fontFamily: Fonts.body,
    opacity: 0.6,
    textAlign: "center",
  },
});

