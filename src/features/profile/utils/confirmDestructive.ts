import { Alert } from "react-native";

import type { t as translate } from "@/shared/config/i18n";

interface DestructiveConfirmation {
  /** La pregunta, ya traducida: «¿Quieres cerrar sesión?». */
  title: string;
  /** Lo que pasará, si hace falta decirlo. */
  message?: string;
  /** El botón rojo, ya traducido: «Cerrar sesión», «Borrar cuenta». */
  confirm: string;
  onConfirm: () => void;
}

/**
 * Confirmación nativa (`Alert`) antes de algo que saca de la cuenta:
 * «Cancelar» y el botón rojo, como en el prototipo. Solo `onConfirm` hace algo.
 */
export function confirmDestructive({ title, message, confirm, onConfirm }: DestructiveConfirmation, t: typeof translate) {
  Alert.alert(title, message, [
    { text: t("common.cancel"), style: "cancel" },
    { text: confirm, style: "destructive", onPress: onConfirm },
  ]);
}
