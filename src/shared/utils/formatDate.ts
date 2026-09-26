import { getLocale } from "@/shared/config/i18n";

import { parseTimezone, wallAsUtcMs } from "./clubClock";

/**
 * Formato de fechas y horas para el usuario, siempre en el idioma activo
 * (nunca un locale fijo). Todo lo que se enseña pasa por aquí.
 */

type DateStyle = "short" | "medium" | "long" | "full";

// Crear un Intl.DateTimeFormat es lo caro (sobre todo con Hermes, en Android);
// usarlo es barato. Se guarda uno por idioma y opciones y se reutiliza: una
// lista con una fecha por fila no crea un formateador por fila.
const formatters = new Map<string, Intl.DateTimeFormat>();

/** El formateador del idioma activo con esas opciones (se crea una sola vez). */
function formatter(options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  const locale = getLocale();
  const key = `${locale}|${JSON.stringify(options)}`;
  let cached = formatters.get(key);
  if (!cached) {
    cached = new Intl.DateTimeFormat(locale, options);
    formatters.set(key, cached);
  }
  return cached;
}

// Las fechas/horas de pared del club se formatean con timeZone "UTC" sobre
// wallAsUtcMs: se ve exactamente lo que dice Core, sin desplazamientos.

/** `class_date` de Core ("2026-09-26") → "26 sept 2026" (según idioma y estilo). */
export function formatClubDate(date: string, style: DateStyle = "medium"): string {
  return formatter({ dateStyle: style, timeZone: "UTC" }).format(wallAsUtcMs(date));
}

/** Fecha de calendario ("1990-05-03") en cifras: "03/05/1990" en español, "05/03/1990" en inglés. */
export function formatNumericDate(date: string): string {
  return formatter({ day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC" }).format(
    wallAsUtcMs(date),
  );
}

/** `class_time` de Core ("18:00:00") → "18:00" (o "6:00 PM" según idioma). */
export function formatClubTime(time: string): string {
  return formatter({ timeStyle: "short", timeZone: "UTC" }).format(wallAsUtcMs("1970-01-01", time));
}

/** Un instante real (timestamp o ISO) mostrado en la hora del club. */
export function formatInstant(
  instant: number | string | Date,
  tz: string,
  options: { date?: DateStyle; time?: "short" | "medium" } = { date: "medium", time: "short" },
): string {
  return formatter({
    dateStyle: options.date,
    timeStyle: options.time,
    timeZone: parseTimezone(tz),
  }).format(new Date(instant));
}

/**
 * Un instante como día de la semana y fecha, con la hora del móvil: "Viernes ·
 * 22 de noviembre" (el día y el mes, en el orden y la forma de cada idioma).
 */
export function formatWeekdayDate(instant: number | Date): string {
  const weekday = formatter({ weekday: "long" }).format(instant);
  const dayMonth = formatter({ day: "numeric", month: "long" }).format(instant);
  return `${weekday.charAt(0).toLocaleUpperCase(getLocale())}${weekday.slice(1)} · ${dayMonth}`;
}
