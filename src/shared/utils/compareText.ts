import { getLocale } from "@/shared/config/i18n";

// Crear un Intl.Collator es caro con Hermes, como un formateador de fechas:
// se guarda uno por idioma y se reutiliza.
const collators = new Map<string, Intl.Collator>();

/**
 * Compara dos textos como los ordena el idioma activo (acentos, mayúsculas y
 * la «ñ» en su sitio): para ordenar listas por nombre con `sort`.
 */
export function compareText(a: string, b: string): number {
  const locale = getLocale();
  let collator = collators.get(locale);
  if (!collator) {
    collator = new Intl.Collator(locale, { sensitivity: "base" });
    collators.set(locale, collator);
  }
  return collator.compare(a, b);
}
