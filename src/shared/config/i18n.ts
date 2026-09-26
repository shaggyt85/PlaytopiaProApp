import { getLocales } from "expo-localization";
import { I18n } from "i18n-js";

import { dictionaries, type Locale } from "@/shared/locales";

const FALLBACK_LOCALE: Locale = "en";

// Idioma del dispositivo si lo tenemos; si no, inglés. El idioma elegido a
// mano en ajustes (persistido) se añade con la pantalla de settings.
const detectLocale = (): Locale => {
  const code = getLocales()[0]?.languageCode ?? FALLBACK_LOCALE;
  return code in dictionaries ? (code as Locale) : FALLBACK_LOCALE;
};

export const i18n = new I18n(dictionaries);
i18n.defaultLocale = FALLBACK_LOCALE;
i18n.enableFallback = true;
i18n.locale = detectLocale();

export const t = i18n.t.bind(i18n);
