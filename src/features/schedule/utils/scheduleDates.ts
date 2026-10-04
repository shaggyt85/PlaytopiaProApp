import { dayjs } from "@/shared/config/dayjs";
import { wallAsUtcMs } from "@/shared/utils/clubClock";

import { MINUTES_PER_HOUR } from "./classTiming";

// Fechas de la agenda como `YYYY-MM-DD`, el formato de Core. Las cuentas se
// hacen en UTC (`dayjs.utc`): son fechas de pared, sin zona, y así un cambio de
// hora nunca mueve un día.

const DATE_FORMAT = "YYYY-MM-DD";
/** Días de la cuadrícula del mes: seis semanas, lo que abarca la vista Mes. */
export const MONTH_GRID_DAYS = 42;
export const DAYS_PER_WEEK = 7;

/**
 * «Ahora» como hora de pared del teléfono, en el mismo formato que las clases
 * (`wallAsUtcMs`), para compararlas.
 *
 * Excepción a la regla de fechas (CLAUDE.md, «nunca con la zona del móvil»),
 * decidida con Robert: Core no manda la zona de cada club, y el profesor casi
 * siempre está en la zona de sus clubes. `nowMs` es `serverNow()`, el reloj del
 * móvil corregido con el del servidor.
 */
export function wallNow(nowMs: number): number {
  const local = dayjs(nowMs);
  return wallAsUtcMs(local.format(DATE_FORMAT), local.format("HH:mm:ss"));
}

/** Minutos desde las 00:00 del teléfono, para la línea de «ahora». */
export function localMinutes(nowMs: number): number {
  const local = dayjs(nowMs);
  return local.hour() * MINUTES_PER_HOUR + local.minute();
}

/** El día de hoy del teléfono. */
export const localToday = (nowMs: number): string => dayjs(nowMs).format(DATE_FORMAT);

/** `date` más `days` días (negativo para ir hacia atrás). */
export const addDays = (date: string, days: number): string =>
  dayjs.utc(date).add(days, "day").format(DATE_FORMAT);

/** Días desde el lunes de su semana (0 el lunes … 6 el domingo). */
const sinceMonday = (date: string): number =>
  // `day()`: 0 domingo … 6 sábado.
  (dayjs.utc(date).day() + DAYS_PER_WEEK - 1) % DAYS_PER_WEEK;

/** El lunes de la semana de `date` (el mismo día si es lunes). */
export const mondayOf = (date: string): string => addDays(date, -sinceMonday(date));

/** El día 1 del mes de `date`. */
const firstOfMonth = (date: string): string => dayjs.utc(date).startOf("month").format(DATE_FORMAT);

/**
 * La cuadrícula del mes de `date`: del lunes de la semana del día 1 a 41 días
 * después. Día, Semana y Mes leen de la misma petición, y todos los días del mes
 * piden el mismo rango (se reaprovecha la caché).
 */
export function monthGrid(date: string): { from: string; to: string } {
  const from = mondayOf(firstOfMonth(date));
  return { from, to: addDays(from, MONTH_GRID_DAYS - 1) };
}

/** Los 7 días de la semana de `date`, de lunes a domingo. */
export function weekDays(date: string): string[] {
  const monday = mondayOf(date);
  return Array.from({ length: DAYS_PER_WEEK }, (_, i) => addDays(monday, i));
}

/**
 * Las celdas de la vista Mes: huecos (`null`) hasta el día 1, empezando en
 * lunes, los días del mes y huecos hasta completar la última semana.
 */
export function monthCells(date: string): (string | null)[] {
  const first = firstOfMonth(date);
  const daysInMonth = dayjs.utc(first).daysInMonth();
  const cells: (string | null)[] = [
    ...Array<null>(sinceMonday(first)).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => addDays(first, i)),
  ];
  while (cells.length % DAYS_PER_WEEK !== 0) cells.push(null);
  return cells;
}

/**
 * `date` más `months` meses, con el mismo número de día o, si el mes no lo
 * tiene, el último (31 de enero → 28 de febrero).
 */
export const addMonths = (date: string, months: number): string =>
  dayjs.utc(date).add(months, "month").format(DATE_FORMAT);

/** Cuántos días van de `from` a `to` (negativo si `to` es anterior). */
export const daysBetween = (from: string, to: string): number => dayjs.utc(to).diff(dayjs.utc(from), "day");

/** Las celdas del mes (`monthCells`) en semanas de 7: una fila de la cuadrícula cada una. */
export function chunkWeeks<T>(cells: readonly T[]): T[][] {
  const weeks: T[][] = [];
  for (let i = 0; i < cells.length; i += DAYS_PER_WEEK) weeks.push(cells.slice(i, i + DAYS_PER_WEEK));
  return weeks;
}

/** Un día respecto a hoy: ya pasó, es hoy o está por venir. */
export type DayTense = "past" | "today" | "future";

/** Si `date` ya pasó, es hoy o está por venir (las fechas `YYYY-MM-DD` se comparan como texto). */
export function dayTense(date: string, today: string): DayTense {
  if (date === today) return "today";
  return date < today ? "past" : "future";
}

/**
 * Qué días salen en la vista Semana: el día tocado en la tira si hay uno; si
 * no, de hoy al domingo en la semana actual (lo que ya pasó se ve en Día) y los
 * 7 días en las demás.
 */
export function visibleWeekDays(days: readonly string[], today: string, picked: string | null): string[] {
  if (picked) return [picked];
  return days.includes(today) ? days.filter((day) => day >= today) : [...days];
}

/**
 * Los días del mes de `date` que tienen clases, en orden: la lista de la vista
 * Mes. La respuesta trae la cuadrícula entera (42 días); los de los meses de al
 * lado no entran.
 */
export function monthDaysWithClasses(byDate: ReadonlyMap<string, readonly unknown[]>, date: string): string[] {
  const month = date.slice(0, 7);
  return [...byDate.entries()]
    .filter(([day, classes]) => day.startsWith(month) && classes.length > 0)
    .map(([day]) => day)
    .sort();
}
