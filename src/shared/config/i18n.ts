import { getLocales } from "expo-localization";
import { I18n, type TranslateOptions } from "i18n-js";

import {
  isLocale,
  loadDictionary,
  type Locale,
  type TranslationKey,
} from "@/shared/locales";
import { languageStorage } from "@/shared/services/languageStorage";

const FALLBACK_LOCALE: Locale = "en";

export const i18n = new I18n({});
// Sin fallback: TypeScript ya obliga a que los 6 idiomas tengan todas las
// claves, y así no hace falta cargar un segundo diccionario en memoria.
i18n.enableFallback = false;

const loaded = new Set<Locale>();

/** Carga el diccionario si hace falta y lo deja como idioma activo. */
function applyLocale(locale: Locale): void {
  if (!loaded.has(locale)) {
    i18n.store({ [locale]: loadDictionary(locale) });
    loaded.add(locale);
  }
  i18n.locale = locale;
}

export function detectDeviceLocale(): Locale {
  const code = getLocales()[0]?.languageCode;
  return isLocale(code) ? code : FALLBACK_LOCALE;
}

export const getLocale = (): Locale => i18n.locale as Locale;

/** Traduce una clave del diccionario (con autocompletado y comprobación de tipos). */
export const t = (key: TranslationKey, options?: TranslateOptions): string =>
  i18n.t(key, options);

/** ¿Existe esta clave en el idioma activo? Para claves que se arman en ejecución. */
export const hasTranslation = (key: string): boolean =>
  typeof i18n.get(key) === "string";

/** Cambia el idioma y lo recuerda para los próximos arranques. */
export async function changeLanguage(locale: Locale): Promise<void> {
  applyLocale(locale);
  await languageStorage.save(locale);
}

/** Aplica el idioma elegido a mano en un arranque anterior, si lo hay. */
export async function restoreSavedLanguage(): Promise<void> {
  const saved = await languageStorage.load();
  if (isLocale(saved)) applyLocale(saved);
}

// Mientras se lee el idioma guardado, la app ya puede traducir con el del móvil.
applyLocale(detectDeviceLocale());
