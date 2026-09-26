import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";

import { AnimatedSplash } from "@/features/splash";

// El splash nativo (logo sobre #1a1333) se mantiene hasta que el animado está
// montado encima; así no hay un parpadeo en blanco entre los dos.
SplashScreen.preventAutoHideAsync();

// Layout raíz. Aquí se montarán los providers (QueryClient, tema) y los
// grupos (auth) y (app) con sus guards.
export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  const handleSplashFinish = useCallback(() => setShowSplash(false), []);

  return (
    <>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }} />
      {showSplash && <AnimatedSplash onFinish={handleSplashFinish} />}
    </>
  );
}
