import { useRouter } from "expo-router";
import { useCallback } from "react";

import { ROUTES } from "@/shared/config/routes";

/**
 * Volver desde una pantalla de detalle: a donde se vino o, si no hay (se abrió
 * desde un aviso), a la Agenda.
 */
export function useGoBack() {
  const router = useRouter();
  return useCallback(() => (router.canGoBack() ? router.back() : router.replace(ROUTES.home)), [router]);
}
