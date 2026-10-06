import type { t as translate } from "@/shared/config/i18n";

import { chooseAction } from "./chooseAction";

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
 * Confirmación nativa antes de algo que saca de la cuenta: «Cancelar» y el
 * botón rojo, como en el prototipo (`chooseAction` con una sola opción, en
 * rojo). Solo `onConfirm` hace algo.
 */
export function confirmDestructive({ title, message, confirm, onConfirm }: DestructiveConfirmation, t: typeof translate) {
  chooseAction({ title, message, actions: [{ text: confirm, onPress: onConfirm, destructive: true }] }, t);
}
