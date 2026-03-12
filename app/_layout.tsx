// app/_layout.tsx
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Colors } from "../constants/theme";
import { AuthProvider, useAuth } from "../hooks/useAuth";

function NavigationGuard() {
  const { user, isNewUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => {
      if (!user) router.replace({ pathname: "/login" });
      else if (isNewUser) router.replace({ pathname: "/setup" } as any);
      else router.replace({ pathname: "/home" } as any);
    }, 0);
    return () => clearTimeout(t);
  }, [user, isNewUser]);

  return null;
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style="light" backgroundColor={Colors.bg} />
        <NavigationGuard />
        <Stack screenOptions={{ headerShown: false }} />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
