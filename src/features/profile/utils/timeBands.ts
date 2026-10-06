import type { TranslationKey } from "@/shared/locales";

import { LAST_HOUR, type WeekDay, type WeeklyHours } from "../schemas/weeklyHours.schema";

import { daysWithHours } from "./daysWithHours";

/** Las horas que se ofrecen, como en la app de alumnos: de las 06:00 a la última. */
export const FIRST_OFFERED_HOUR = 6;

/** Las horas en punto de `from` a `to`, las dos incluidas. */
export const hoursBetween = (from: number, to: number): number[] =>
  Array.from({ length: to - from + 1 }, (_, i) => from + i);

/** Lo que se puede marcar: de las 06:00 a la que empieza a las 23:00. */
export const OFFERED_HOURS = hoursBetween(FIRST_OFFERED_HOUR, LAST_HOUR);

interface TimeBand {
  id: string;
  label: TranslationKey;
  hours: readonly number[];
}

/**
 * Las franjas de «Por franja», las de la app de alumnos: cada una con las horas
 * que **empiezan** en ella (Mañana, de 06:00 a 12:00, son las de 6 a 11). Una
 * franja nueva es una línea aquí. Ninguna lleva la 24, que no existe.
 */
export const TIME_BANDS = [
  { id: "morning", label: "profile.availability.bands.morning", hours: hoursBetween(FIRST_OFFERED_HOUR, 11) },
  { id: "afternoon", label: "profile.availability.bands.afternoon", hours: hoursBetween(12, 17) },
  { id: "evening", label: "profile.availability.bands.evening", hours: hoursBetween(18, LAST_HOUR) },
  { id: "allDay", label: "profile.availability.bands.allDay", hours: OFFERED_HOURS },
] as const satisfies readonly TimeBand[];

export type BandId = (typeof TIME_BANDS)[number]["id"];

/** Lo que se marca en «Por franja»: qué días y qué franjas. */
export interface BandSelection {
  days: WeekDay[];
  bands: BandId[];
}

/** Las horas de esas franjas, juntas, ordenadas y sin repetir. */
export function bandHours(bands: readonly BandId[]): number[] {
  const hours = new Set(TIME_BANDS.filter((band) => bands.includes(band.id)).flatMap((band) => band.hours));
  return [...hours].sort((a, b) => a - b);
}

/**
 * La semana que sale de lo marcado: cada día marcado con las horas de las
 * franjas marcadas; los demás, sin disponibilidad. Sin franjas, la semana
 * vacía.
 */
export function applyBands({ days, bands }: BandSelection): WeeklyHours {
  const hours = bandHours(bands);
  if (hours.length === 0) return {};
  return Object.fromEntries(days.map((day) => [day, hours]));
}

/**
 * Lo que se ve marcado al abrir: los días con alguna hora y, si todos tienen
 * las mismas horas y son justo franjas enteras, esas franjas. Si no (horas
 * sueltas de «Por día»), ninguna franja: la semana se ve en el detalle tal
 * cual.
 */
export function bandsOf(week: WeeklyHours): BandSelection {
  const days = daysWithHours(week);
  const first = [...new Set(week[days[0]] ?? [])].sort((a, b) => a - b);
  const same = days.every((day) => sameHours(week[day] ?? [], first));
  const bands = TIME_BANDS.filter((band) => band.hours.every((hour) => first.includes(hour))).map((band) => band.id);
  const exact = same && sameHours(bandHours(bands), first);
  return { days, bands: exact ? bands : [] };
}

const sameHours = (a: readonly number[], b: readonly number[]) => {
  const left = new Set(a);
  return left.size === new Set(b).size && b.every((hour) => left.has(hour));
};
