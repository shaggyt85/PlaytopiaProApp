import { Stack } from "expo-router";

import { BiometricOfferModal, OpenSessionTermsGate } from "@/features/auth";
import { ProfileEditorSheet } from "@/features/profile";
import { BlurTarget, BlurTargetProvider } from "@/shared/components/BlurTarget";

// Rutas con sesión de profesor. Las pantallas van dentro del BlurTarget para
// quedar desenfocadas bajo los paneles (la biometría y los editores de
// Perfil), que van fuera y encima, también de la barra de pestañas; y, la
// última, encima de todo, los términos si cambian con la sesión abierta. Los detalles
// (el de una clase) entran encima de las pestañas deslizándose desde la
// derecha, como las pantallas de acceso.
export default function AppLayout() {
  return (
    <BlurTargetProvider>
      <BlurTarget>
        <Stack screenOptions={{ headerShown: false, animation: "slide_from_right" }} />
      </BlurTarget>
      <BiometricOfferModal />
      <ProfileEditorSheet />
      <OpenSessionTermsGate />
    </BlurTargetProvider>
  );
}
