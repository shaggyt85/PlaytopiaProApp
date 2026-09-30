import { Stack } from "expo-router";

import { BiometricOfferModal } from "@/features/auth";
import { BlurTarget, BlurTargetProvider } from "@/shared/components/BlurTarget";

// Rutas con sesión de profesor. Las pantallas van dentro del BlurTarget para
// quedar desenfocadas bajo los paneles, que van fuera y encima. Los detalles
// (el de una clase) entran encima de las pestañas deslizándose desde la
// derecha, como las pantallas de acceso.
export default function AppLayout() {
  return (
    <BlurTargetProvider>
      <BlurTarget>
        <Stack screenOptions={{ headerShown: false, animation: "slide_from_right" }} />
      </BlurTarget>
      <BiometricOfferModal />
    </BlurTargetProvider>
  );
}
