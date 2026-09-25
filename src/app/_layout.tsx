import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

// Layout raíz. Aquí se montarán los providers (QueryClient, tema, i18n) y los
// grupos (auth) y (app) con sus guards.
export default function RootLayout() {
  return (
    <>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}
