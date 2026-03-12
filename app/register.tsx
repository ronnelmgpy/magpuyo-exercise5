// app/register.tsx
// ═══════════════════════════════════════════════════════════════
// REGISTER SCREEN
// ───────────────────────────────────────────────────────────────
//
// ┌─ NEW RHF CONCEPTS (builds on login.tsx) ───────────────────┐
// │                                                             │
// │  watch("fieldName")                                         │
// │    → Subscribes to a field value live (causes re-render)    │
// │    → Used here to power the password strength bar          │
// │    → Example: const pw = watch("password")                 │
// │                                                             │
// │  getValues("fieldName")                                     │
// │    → Reads a value WITHOUT subscribing (no re-render)       │
// │    → Used inside validate rule to compare two fields        │
// │    → Example: v === getValues("password")                  │
// │                                                             │
// │  rules.validate: (value) => true | "error message"         │
// │    → Custom validation function                             │
// │    → Return true  = field passes                            │
// │    → Return string = field fails with that message          │
// │    → Can be async (e.g. check if email is taken via API)   │
// └─────────────────────────────────────────────────────────────┘
// ═══════════════════════════════════════════════════════════════

import { Ionicons } from "@expo/vector-icons";
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
    PrimaryButton,
} from "../components/ui";
import { Colors, Fonts, Radii, Shadow, Spacing } from "../constants/theme";
import { useAuth } from "../hooks/useAuth";

// ── Password strength ────────────────────────────────────────────
function strengthScore(pw: string): number {
  let n = 0;
  if (pw.length >= 8) n++;
  if (/[A-Z]/.test(pw)) n++;
  if (/[0-9]/.test(pw)) n++;
  if (/[^A-Za-z0-9]/.test(pw)) n++;
  return n;
}
const S_LABELS = ["", "Weak", "Fair", "Good", "Strong"];
const S_COLORS = [
  Colors.bg,
  Colors.textError,
  "#EFA020",
  Colors.orangeLight,
  "#4CAF50",
];

// ── Form type ────────────────────────────────────────────────────
interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterScreen() {
  const { register } = useAuth();
  const router = useRouter();
  const [apiError, setApiError] = useState("");

  const {
    control,
    handleSubmit,
    watch, // live field value subscription
    getValues, // read value once (no re-render)
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    defaultValues: { email: "", password: "", confirmPassword: "" },
    mode: "onTouched",
  });

  // watch("password") re-renders on every keystroke → powers strength bar
  const livePassword = watch("password", "");
  const strength = strengthScore(livePassword);

  const onSubmit = async ({ email, password }: RegisterForm) => {
    setApiError("");
    const { error } = await register(email, password);
    if (error) setApiError(error);
  };

  return (
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
          <View style={s.card}>
            {/* Back */}
            <TouchableOpacity style={s.back} onPress={() => router.back()}>
              <Ionicons
                name="arrow-back"
                size={17}
                color={Colors.textSecondary}
              />
              <Text style={s.backText}>Back to sign in</Text>
            </TouchableOpacity>

            <Heading
              title={"Create\naccount."}
              sub="Register to get access. You'll be able to sign in after."
            />

            {/* ── Email ──────────────────────────────────── */}
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
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
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
                    value: 8,
                    message: "Password must be at least 8 characters.",
                  },
                  // Custom validate rule: must contain a digit
                  validate: (v) =>
                    /[0-9]/.test(v) || "Include at least one number.",
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <PasswordInput
                    placeholder="Min 8 chars, include a number"
                    autoComplete="new-password"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    error={errors.password?.message}
                  />
                )}
              />
              <FieldError message={errors.password?.message} />

              {/* Strength bar — driven by watch() */}
              {livePassword.length > 0 && (
                <View style={s.barRow}>
                  {[1, 2, 3, 4].map((i) => (
                    <View
                      key={i}
                      style={[
                        s.barSeg,
                        {
                          backgroundColor:
                            i <= strength ? S_COLORS[strength] : Colors.border,
                        },
                      ]}
                    />
                  ))}
                  <Text style={[s.barLabel, { color: S_COLORS[strength] }]}>
                    {S_LABELS[strength]}
                  </Text>
                </View>
              )}
            </View>

            {/* ── Confirm Password ───────────────────────── */}
            <View style={s.field}>
              <FieldLabel label="Confirm password" />
              <Controller
                name="confirmPassword"
                control={control}
                rules={{
                  required: "Please confirm your password.",
                  // getValues() reads password WITHOUT causing re-render
                  validate: (v) =>
                    v === getValues("password") || "Passwords don't match.",
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <PasswordInput
                    placeholder="Repeat password"
                    autoComplete="new-password"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    error={errors.confirmPassword?.message}
                  />
                )}
              />
              <FieldError message={errors.confirmPassword?.message} />
            </View>

            {/* API error (email already registered, etc.) */}
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

            {/* Terms note */}
            <Text style={s.terms}>
              By registering you agree to our{" "}
              <Text style={s.termsLink}>Terms</Text> &{" "}
              <Text style={s.termsLink}>Privacy Policy</Text>.
            </Text>

            <PrimaryButton
              label="Create Account"
              onPress={handleSubmit(onSubmit)}
              loading={isSubmitting}
            />

            <View style={s.footer}>
              <Text style={s.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.replace("/login")}>
                <Text style={s.footerLink}>Sign in</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ── Styles ───────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: Spacing.xxl,
    paddingHorizontal: Spacing.lg,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: Colors.glass,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radii.xl,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: 36,
    ...Shadow.card,
  },
  back: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: Spacing.lg,
    alignSelf: "flex-start",
  },
  backText: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontFamily: Fonts.body,
  },
  field: { marginBottom: Spacing.md },
  barRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 8,
  },
  barSeg: { flex: 1, height: 3, borderRadius: 2 },
  barLabel: {
    fontSize: 11,
    fontWeight: "700",
    fontFamily: Fonts.body,
    minWidth: 44,
    textAlign: "right",
  },
  apiErrorBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: "rgba(255,79,79,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,79,79,0.25)",
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
  terms: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontFamily: Fonts.body,
    lineHeight: 18,
    marginBottom: Spacing.lg,
  },
  termsLink: { color: Colors.orangeLight },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: Spacing.lg,
  },
  footerText: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontFamily: Fonts.body,
  },
  footerLink: {
    color: Colors.orange,
    fontSize: 14,
    fontWeight: "700",
    fontFamily: Fonts.body,
  },
});
