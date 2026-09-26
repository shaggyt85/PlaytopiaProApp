import * as Haptics from "expo-haptics";

/**
 * Vibración suave de "has elegido algo" (cambiar de pestaña, marcar una
 * opción). Si el móvil no vibra o el sistema lo tiene desactivado, no pasa nada.
 */
export function selectionFeedback(): void {
  Haptics.selectionAsync().catch(() => undefined);
}
