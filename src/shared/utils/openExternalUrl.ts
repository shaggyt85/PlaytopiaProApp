import { Alert, Linking } from "react-native";

import type { t as translate } from "@/shared/config/i18n";

/**
 * Abre un enlace fuera de la app (la web de un documento, la tienda). Si el
 * sistema no puede, lo dice en un `Alert` nativo en vez de no hacer nada.
 * Devuelve si se abrió.
 */
export async function openExternalUrl(url: string, t: typeof translate): Promise<boolean> {
  try {
    await Linking.openURL(url);
    return true;
  } catch {
    Alert.alert(t("common.openFailed"));
    return false;
  }
}
