import { Alert } from "react-native";

import type { t as translate } from "@/shared/config/i18n";

/** Una opción del aviso, ya traducida. */
export interface AlertAction {
  text: string;
  onPress: () => void;
  /** En rojo: lo que no tiene vuelta atrás. */
  destructive?: boolean;
}

interface ActionChoice {
  title: string;
  message?: string;
  /** Hasta dos: Android no enseña más de tres botones, y uno es «Cancelar». */
  actions: readonly AlertAction[];
}

/**
 * Un `Alert` nativo con «Cancelar» y sus opciones: confirmar algo que saca de
 * la cuenta, elegir de dónde sale la foto, ir a los ajustes. «Cancelar» no hace
 * nada; cada opción, lo suyo.
 */
export function chooseAction({ title, message, actions }: ActionChoice, t: typeof translate): void {
  Alert.alert(title, message, [
    { text: t("common.cancel"), style: "cancel" },
    ...actions.map(({ text, onPress, destructive }) => ({
      text,
      onPress,
      style: destructive ? ("destructive" as const) : ("default" as const),
    })),
  ]);
}
