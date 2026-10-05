import { getLocale } from "@/shared/config/i18n";

// Uno por idioma: crear un `Intl.NumberFormat` es lo caro, usarlo es barato.
const formatters = new Map<string, Intl.NumberFormat>();

/**
 * El nivel de un alumno con la coma o el punto de cada idioma y al menos un
 * decimal, como el prototipo: 2.5 → «2,5» en español y «2.5» en inglés; 3 →
 * «3,0». Hasta dos decimales: hay escuelas cuyos niveles se distinguen en el
 * segundo (2,75). Sin nivel (un alumno sin matrícula en la sede), `null`.
 */
export function formatLevel(level: number): string;
export function formatLevel(level: number | null): string | null;
export function formatLevel(level: number | null): string | null {
  if (level === null) return null;
  const locale = getLocale();
  let formatter = formatters.get(locale);
  if (!formatter) {
    formatter = new Intl.NumberFormat(locale, { minimumFractionDigits: 1, maximumFractionDigits: 2 });
    formatters.set(locale, formatter);
  }
  return formatter.format(level);
}
