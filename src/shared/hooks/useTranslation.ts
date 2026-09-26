import { useSyncExternalStore } from "react";

import { changeLanguage, getLocale, i18n, t } from "@/shared/config/i18n";

const subscribe = (onChange: () => void) => i18n.onChange(onChange);
const getVersion = () => i18n.version;

/**
 * Traducciones en componentes. Vuelve a pintar el componente cuando cambia el
 * idioma, cosa que el `t` suelto no hace.
 */
export function useTranslation() {
  useSyncExternalStore(subscribe, getVersion);
  return { t, locale: getLocale(), changeLanguage };
}
