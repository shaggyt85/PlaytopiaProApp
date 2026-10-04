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

/**
 * Una fecha de pared del club (`class_date`, "2026-11-18") con las opciones de
 * `Intl` de cada formato. Único sitio que pone el `timeZone: "UTC"` y hace el
 * `wallAsUtcMs`: cada formato de abajo solo dice sus opciones.
 */
function formatWallDate(date: string, options: Intl.DateTimeFormatOptions): string {
  return formatter({ ...options, timeZone: "UTC" }).format(wallAsUtcMs(date));
}

/** `class_date` de Core ("2026-09-26") → "26 sept 2026" (según idioma y estilo). */
export const formatClubDate = (date: string, style: DateStyle = "medium"): string =>
  formatWallDate(date, { dateStyle: style });

/** Fecha de calendario ("1990-05-03") en cifras: "03/05/1990" en español, "05/03/1990" en inglés. */
export const formatNumericDate = (date: string): string =>
  formatWallDate(date, { day: "2-digit", month: "2-digit", year: "numeric" });

/** `class_time` de Core ("08:00:00") → "08:00" (o "08:00 AM" según idioma). */
export function formatClubTime(time: string): string {
  return formatWallTime(wallAsUtcMs("1970-01-01", time));
}

/**
 * Una hora de pared ya como `wallAsUtcMs` (la de «ahora» en la agenda) → "09:21".
 * La hora siempre con dos cifras, como el prototipo («08:00» en la tira).
 */
export function formatWallTime(wallMs: number): string {
  const parts = formatter({ hour: "2-digit", minute: "2-digit", timeZone: "UTC" }).formatToParts(wallMs);
  // El `Intl` de iOS ignora `hour: "2-digit"` en español («7:00»): la hora se
  // rellena aquí, así sale igual en iOS, en Android y en los tests.
  return parts.map((part) => (part.type === "hour" ? part.value.padStart(2, "0") : part.value)).join("");
}

/** `class_date` de Core ("2026-10-05") como día de la semana y número: "lunes 5". */
export const formatWeekdayDay = (date: string): string =>
  `${formatWallDate(date, { weekday: "long" })} ${formatDayOfMonth(date)}`;

/** `class_date` con el día de la semana en corto y el número: "jue 18" (la tarjeta de la próxima clase). */
export const formatWeekdayShortDay = (date: string): string =>
  `${formatWallDate(date, { weekday: "short" })} ${formatDayOfMonth(date)}`;

/** `class_date` con el día de la semana y el mes en corto: "lun 18 sept" (la barra de la agenda). */
export const formatWeekdayShortDayMonth = (date: string): string =>
  `${formatWallDate(date, { weekday: "short" })} ${formatDayMonthShort(date)}`;

/** `class_date` como número del día: "18" (la tira de la semana y la cuadrícula del mes). */
export const formatDayOfMonth = (date: string): string => formatWallDate(date, { day: "numeric" });

/**
 * `class_date` con el día de la semana, el número y el mes, como lo escribe
 * cada idioma y con la primera en mayúscula: "Lunes, 18 de noviembre" (la
 * cabecera del detalle de una clase).
 */
export const formatClassDate = (date: string): string =>
  capitalize(formatWallDate(date, { weekday: "long", day: "numeric", month: "long" }));

/** `class_date` como día y mes: "18 de noviembre" (el título de la lista del mes). */
export const formatDayMonth = (date: string): string => formatWallDate(date, { day: "numeric", month: "long" });

/** `class_date` como día y mes en corto: "18 nov" (los extremos de una semana). */
export const formatDayMonthShort = (date: string): string =>
  formatWallDate(date, { day: "numeric", month: "short" });

/** `class_date` como mes y año, en la forma de cada idioma: "noviembre de 2026". */
export const formatMonthYear = (date: string): string => formatWallDate(date, { month: "long", year: "numeric" });

/** La primera letra en mayúscula, según el idioma activo: "lunes 18" → "Lunes 18". */
export function capitalize(text: string): string {
  return `${text.charAt(0).toLocaleUpperCase(getLocale())}${text.slice(1)}`;
}

// Un lunes cualquiera: sus 7 días dan las letras de la semana en orden.
const A_MONDAY = "2024-01-01";
const weekdayInitialsByLocale = new Map<string, readonly string[]>();

/**
 * Las letras de los días, de lunes a domingo, en el idioma activo: "L M X J V S
 * D" en español, "M T W T F S S" en inglés. Se calculan una vez por idioma.
 */
export function formatWeekdayInitials(): readonly string[] {
  const locale = getLocale();
  let letters = weekdayInitialsByLocale.get(locale);
  if (!letters) {
    const narrow = formatter({ weekday: "narrow", timeZone: "UTC" });
    const monday = wallAsUtcMs(A_MONDAY);
    letters = Array.from({ length: 7 }, (_, i) => narrow.format(monday + i * 86_400_000));
    weekdayInitialsByLocale.set(locale, letters);
  }
  return letters;
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
  return `${capitalize(weekday)} · ${dayMonth}`;
}
