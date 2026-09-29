import type { Translations } from "./es";

export type { Translations } from "./es";

// Los 6 idiomas son obligatorios (guía §12).
export const LOCALES = ["es", "en", "pt", "ca", "de", "fr"] as const;

export type Locale = (typeof LOCALES)[number];

// Cada diccionario se carga al pedirlo: Metro solo ejecuta un módulo la
// primera vez que se hace require de él, así en memoria solo está el idioma
// que se usa (los 6 siguen dentro del bundle).
/* eslint-disable @typescript-eslint/no-require-imports -- el require dentro de
   la función es lo que hace perezosa la carga; un import lo cargaría al arrancar. */
const loaders: Record<Locale, () => Translations> = {
  es: () => require("./es").default,
  en: () => require("./en").default,
  pt: () => require("./pt").default,
  ca: () => require("./ca").default,
  de: () => require("./de").default,
  fr: () => require("./fr").default,
};
/* eslint-enable @typescript-eslint/no-require-imports */

export const loadDictionary = (locale: Locale): Translations =>
  loaders[locale]();

export const isLocale = (value: unknown): value is Locale =>
  typeof value === "string" && (LOCALES as readonly string[]).includes(value);

/**
 * Rutas "a.b.c" de todas las hojas de texto del diccionario. Un plural
 * (`{ one, other }`, lo que elige i18n-js con `count`) también es una clave: se
 * pide entero, `t("x.classes", { count })`, y no cada forma por separado.
 */
type Paths<T> = {
  [K in keyof T & string]: T[K] extends string
    ? K
    : T[K] extends { one: string; other: string }
      ? K | `${K}.${Paths<T[K]>}`
      : `${K}.${Paths<T[K]>}`;
}[keyof T & string];

export type TranslationKey = Paths<Translations>;
