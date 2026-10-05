import { useRouter } from "expo-router";
import { useCallback } from "react";

/**
 * Volver desde una pantalla de detalle: a donde se vino o, si no hay (se abrió
 * desde un aviso), a la Agenda.
 */
export function useGoBack() {
  const router = useRouter();
  return useCallback(() => (router.canGoBack() ? router.back() : router.replace("/")), [router]);
}
