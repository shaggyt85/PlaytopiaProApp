import { Stack } from "expo-router";

import { BiometricOfferModal } from "@/features/auth";
import { BlurTarget, BlurTargetProvider } from "@/shared/components/BlurTarget";

// Rutas con sesión de profesor. Las pantallas van dentro del BlurTarget para
// quedar desenfocadas bajo los paneles, que van fuera y encima.
export default function AppLayout() {
  return (
    <BlurTargetProvider>
      <BlurTarget>
        <Stack screenOptions={{ headerShown: false }} />
      </BlurTarget>
      <BiometricOfferModal />
    </BlurTargetProvider>
  );
}
