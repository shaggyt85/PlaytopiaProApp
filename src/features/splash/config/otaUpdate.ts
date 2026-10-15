import type { reloadAsync } from "expo-updates";

import { BRAND_ASSETS } from "@/shared/config/assets";
import { darkTheme } from "@/shared/config/theme";

/**
 * Lo que se espera en el splash a que el servidor diga si hay versión nueva.
 * Con mala red, la pregunta sola podría dejar el splash parado: pasado este
 * tope se entra, y la actualización queda para la próxima apertura. Una vez
 * empezada la descarga no hay tope (se ve el progreso).
 */
export const OTA_CHECK_TIMEOUT_MS = 5_000;

/**
 * La pantalla de recarga al reiniciar con la versión nueva: el fondo del
 * splash, el logo y el indicador, para que el paso no se vea en blanco.
 */
export const OTA_RELOAD_OPTIONS: NonNullable<Parameters<typeof reloadAsync>[0]> = {
  reloadScreenOptions: {
    backgroundColor: darkTheme.colors.background,
    image: BRAND_ASSETS.logoWhite,
    imageResizeMode: "center",
    spinner: { enabled: true, color: darkTheme.colors.primary, size: "medium" },
    fade: true,
  },
};
