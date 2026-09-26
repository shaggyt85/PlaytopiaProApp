import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";

import { AnimatedSplash } from "@/features/splash";
import { AppProviders } from "@/shared/components/AppProviders";
import { useAppReady } from "@/shared/hooks/useAppReady";
import { useTheme } from "@/shared/hooks/useTheme";
import { useSessionStore } from "@/shared/store/sessionStore";
// Valida las variables de entorno al arrancar: si falta alguna, la app
// falla aquí con un mensaje claro y no más tarde en una pantalla cualquiera.
import "@/shared/config/env";

// El splash nativo (fondo #1a1333) se mantiene hasta que la app está lista y
// el animado está montado encima; así no hay un parpadeo entre los dos.
SplashScreen.preventAutoHideAsync();

// Layout raíz: providers y guards. Con sesión de profesor solo existe (app);
// sin ella, solo (auth). Stack.Protected lleva a la otra rama cuando cambia.
export default function RootLayout() {
  const theme = useTheme();
  const ready = useAppReady();
  const isAuthenticated = useSessionStore((s) => s.status === "authenticated");
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  const handleSplashFinish = useCallback(() => setShowSplash(false), []);

  if (!ready) return null;

  return (
    <AppProviders>
      {/* Tema oscuro fijo: texto claro en la barra de estado */}
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.background },
        }}
      >
        <Stack.Protected guard={isAuthenticated}>
          <Stack.Screen name="(app)" />
        </Stack.Protected>
        <Stack.Protected guard={!isAuthenticated}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>
      </Stack>
      {showSplash && <AnimatedSplash onFinish={handleSplashFinish} />}
    </AppProviders>
  );
}
