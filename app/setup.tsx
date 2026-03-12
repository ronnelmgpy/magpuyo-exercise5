// app/setup.tsx
// ═══════════════════════════════════════════════════════════════
// ACCOUNT SETUP SCREEN — shown once after registration
// ═══════════════════════════════════════════════════════════════

import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
    Alert,
    Image,
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
    GhostButton,
    GlassInput,
    Heading,
    PrimaryButton,
} from "../components/ui";
import { Colors, Fonts, Radii, Shadow, Spacing } from "../constants/theme";
import { useAuth } from "../hooks/useAuth";

interface SetupForm {
  firstName: string;
  lastName: string;
}

export default function SetupScreen() {
  const { user, setupProfile } = useAuth();
  const [avatarUri, setAvatarUri] = useState<string | undefined>();
  const [saving, setSaving] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SetupForm>({
    defaultValues: { firstName: "", lastName: "" },
    mode: "onTouched",
  });

  const pickAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Allow photo access in Settings.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.75,
    });
    if (!result.canceled) setAvatarUri(result.assets[0].uri);
  };

  const onSubmit = async ({ firstName, lastName }: SetupForm) => {
    setSaving(true);
    await new Promise<void>((r) => setTimeout(r, 600));
    setupProfile({ firstName, lastName, avatar: avatarUri });
    setSaving(false);
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
            {/* Progress steps */}
            <View style={s.steps}>
              <View style={[s.step, s.stepDone]} />
              <View style={[s.step, s.stepActive]} />
              <View style={s.step} />
            </View>

            <Heading
              title={"Your\nprofile."}
              sub="Almost done — add your details. Skip if you prefer."
            />

            {/* Avatar */}
            <View style={s.avatarRow}>
              <TouchableOpacity
                onPress={pickAvatar}
                activeOpacity={0.8}
                style={s.avatarWrap}
              >
                {avatarUri ? (
                  <Image source={{ uri: avatarUri }} style={s.avatarImg} />
                ) : (
                  <View style={s.avatarEmpty}>
                    <Ionicons
                      name="person-outline"
                      size={28}
                      color={Colors.textSecondary}
                    />
                  </View>
                )}
                <View style={s.cameraBadge}>
                  <Ionicons name="camera" size={11} color={Colors.white} />
                </View>
              </TouchableOpacity>
              <View style={{ flex: 1 }}>
                <Text style={s.avatarTitle}>Profile photo</Text>
                <Text style={s.avatarSub}>
                  {avatarUri ? "Tap to change" : "Tap to upload"}
                </Text>
              </View>
            </View>

            {/* First Name */}
            <View style={s.field}>
              <FieldLabel label="First name" />
              <Controller
                name="firstName"
                control={control}
                rules={{
                  required: "First name is required.",
                  minLength: { value: 2, message: "At least 2 characters." },
                  maxLength: { value: 40, message: "Max 40 characters." },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <GlassInput
                    placeholder="Jane"
                    autoCapitalize="words"
                    autoComplete="given-name"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    error={errors.firstName?.message}
                  />
                )}
              />
              <FieldError message={errors.firstName?.message} />
            </View>

            {/* Last Name */}
            <View style={s.field}>
              <FieldLabel label="Last name" />
              <Controller
                name="lastName"
                control={control}
                rules={{
                  required: "Last name is required.",
                  minLength: { value: 2, message: "At least 2 characters." },
                  maxLength: { value: 60, message: "Max 60 characters." },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <GlassInput
                    placeholder="Doe"
                    autoCapitalize="words"
                    autoComplete="family-name"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    error={errors.lastName?.message}
                  />
                )}
              />
              <FieldError message={errors.lastName?.message} />
            </View>

            {/* Email chip */}
            <View style={s.chip}>
              <Ionicons
                name="mail-outline"
                size={12}
                color={Colors.textSecondary}
              />
              <Text style={s.chipText}>{user?.email}</Text>
            </View>

            <PrimaryButton
              label="Save & Continue"
              onPress={handleSubmit(onSubmit)}
              loading={saving}
            />
            <GhostButton
              label="Skip for now"
              onPress={() => setupProfile({})}
              style={{ marginTop: Spacing.sm }}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

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
  steps: { flexDirection: "row", gap: 6, marginBottom: Spacing.xl },
  step: { flex: 1, height: 3, borderRadius: 2, backgroundColor: Colors.border },
  stepDone: { backgroundColor: Colors.orangeLight },
  stepActive: { backgroundColor: Colors.orange },
  avatarRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  avatarWrap: { position: "relative" },
  avatarImg: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    borderColor: Colors.orange,
  },
  avatarEmpty: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: Colors.glassInput,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  cameraBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.orange,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Colors.bg,
  },
  avatarTitle: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: "600",
    fontFamily: Fonts.body,
  },
  avatarSub: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontFamily: Fonts.body,
    marginTop: 2,
  },
  field: { marginBottom: Spacing.md },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.glassInput,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radii.full,
    paddingVertical: 5,
    paddingHorizontal: 12,
    alignSelf: "flex-start",
    marginBottom: Spacing.xl,
    marginTop: 4,
  },
  chipText: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontFamily: Fonts.body,
  },
});
