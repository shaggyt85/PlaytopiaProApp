import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";

import { AnimatedSplash } from "@/features/splash";
import { AppProviders } from "@/shared/components/AppProviders";
import { useLanguageReady } from "@/shared/hooks/useLanguageReady";
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
  const languageReady = useLanguageReady();

  // Hasta tener el idioma guardado sigue el splash nativo (solo fondo).
  useEffect(() => {
    if (languageReady) SplashScreen.hideAsync();
  }, [languageReady]);

  const handleSplashFinish = useCallback(() => setShowSplash(false), []);

  if (!languageReady) return null;

  return (
    <AppProviders>
      {/* Tema oscuro fijo: texto claro en la barra de estado */}
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }} />
      {showSplash && <AnimatedSplash onFinish={handleSplashFinish} />}
    </AppProviders>
  );
}
