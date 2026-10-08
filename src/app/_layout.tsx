import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useCallback, useState } from "react";

import { AppUpdateGate } from "@/features/app-update";
import { AnimatedSplash } from "@/features/splash";
import { AppProviders } from "@/shared/components/AppProviders";
import { initSentry, wrapWithSentry } from "@/shared/config/sentry";
import { useAppReady } from "@/shared/hooks/useAppReady";
import { useTheme } from "@/shared/hooks/useTheme";
import { useSessionStore } from "@/shared/store/sessionStore";
// Valida las variables de entorno al arrancar: si falta alguna, la app
// falla aquí con un mensaje claro y no más tarde en una pantalla cualquiera.
import "@/shared/config/env";

// Lo antes posible, para que un fallo al arrancar también llegue.
initSentry();

// El splash nativo (fondo `BRAND.night`) se mantiene hasta que la app está lista y
// el animado ya está pintado encima: si se quitara antes, durante un instante
// se vería la pantalla de debajo (el login).
SplashScreen.preventAutoHideAsync();

// Layout raíz: providers y guards. Con sesión de profesor solo existe (app);
// sin ella, solo (auth). Stack.Protected lleva a la otra rama cuando cambia.
function RootLayout() {
  const theme = useTheme();
  const ready = useAppReady();
  const isAuthenticated = useSessionStore((s) => s.status === "authenticated");
  const [showSplash, setShowSplash] = useState(true);

  const hideNativeSplash = useCallback(() => {
    SplashScreen.hideAsync();
  }, []);

  const handleSplashFinish = useCallback(() => {
    hideNativeSplash(); // por si el animado no llegó a avisar
    setShowSplash(false);
  }, [hideNativeSplash]);

  if (!ready) return null;

  return (
    <AppProviders>
      {/* Tema oscuro fijo: texto claro en la barra de estado */}
      <StatusBar style="light" />
      {/* La app, o la pantalla de actualizar si esta versión ya no vale. */}
      <AppUpdateGate>
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
      </AppUpdateGate>
      {showSplash && (
        <AnimatedSplash onReady={hideNativeSplash} onFinish={handleSplashFinish} />
      )}
    </AppProviders>
  );
}

export default wrapWithSentry(RootLayout);
