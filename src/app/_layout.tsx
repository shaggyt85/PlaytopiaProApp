import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";

import { AnimatedSplash } from "@/features/splash";
import { AppProviders } from "@/shared/components/AppProviders";
// Valida las variables de entorno al arrancar: si falta alguna, la app
// falla aquí con un mensaje claro y no más tarde en una pantalla cualquiera.
import "@/shared/config/env";

// El splash nativo (fondo #1a1333) se mantiene hasta que el animado está
// montado encima; así no hay un parpadeo en blanco entre los dos.
SplashScreen.preventAutoHideAsync();

// Layout raíz: providers de la app y, más adelante, los grupos (auth) y (app)
// con sus guards.
export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  const handleSplashFinish = useCallback(() => setShowSplash(false), []);

  return (
    <AppProviders>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }} />
      {showSplash && <AnimatedSplash onFinish={handleSplashFinish} />}
    </AppProviders>
  );
}
