import { getLocale } from "@/shared/config/i18n";

import { parseTimezone, wallAsUtcMs } from "./clubClock";

/**
 * Formato de fechas y horas para el usuario, siempre en el idioma activo
 * (nunca un locale fijo). Todo lo que se enseña pasa por aquí.
 */

type DateStyle = "short" | "medium" | "long" | "full";

// Las fechas/horas de pared del club se formatean con timeZone "UTC" sobre
// wallAsUtcMs: se ve exactamente lo que dice Core, sin desplazamientos.

/** `class_date` de Core ("2026-09-26") → "26 sept 2026" (según idioma y estilo). */
export function formatClubDate(date: string, style: DateStyle = "medium"): string {
  return new Intl.DateTimeFormat(getLocale(), {
    dateStyle: style,
    timeZone: "UTC",
  }).format(wallAsUtcMs(date));
}

/** Fecha de calendario ("1990-05-03") en cifras: "03/05/1990" en español, "05/03/1990" en inglés. */
export function formatNumericDate(date: string): string {
  return new Intl.DateTimeFormat(getLocale(), {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  }).format(wallAsUtcMs(date));
}

/** `class_time` de Core ("18:00:00") → "18:00" (o "6:00 PM" según idioma). */
export function formatClubTime(time: string): string {
  return new Intl.DateTimeFormat(getLocale(), {
    timeStyle: "short",
    timeZone: "UTC",
  }).format(wallAsUtcMs("1970-01-01", time));
}

/** Un instante real (timestamp o ISO) mostrado en la hora del club. */
export function formatInstant(
  instant: number | string | Date,
  tz: string,
  options: { date?: DateStyle; time?: "short" | "medium" } = { date: "medium", time: "short" },
): string {
  return new Intl.DateTimeFormat(getLocale(), {
    dateStyle: options.date,
    timeStyle: options.time,
    timeZone: parseTimezone(tz),
  }).format(new Date(instant));
}
