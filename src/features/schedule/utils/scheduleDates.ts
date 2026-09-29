import { dayjs } from "@/shared/config/dayjs";
import { wallAsUtcMs } from "@/shared/utils/clubClock";

// Fechas de la agenda como `YYYY-MM-DD`, el formato de Core. Las cuentas se
// hacen en UTC (`dayjs.utc`): son fechas de pared, sin zona, y así un cambio de
// hora nunca mueve un día.

const DATE_FORMAT = "YYYY-MM-DD";
/** Días de la cuadrícula del mes: seis semanas, lo que abarca la vista Mes. */
export const MONTH_GRID_DAYS = 42;
const DAYS_PER_WEEK = 7;

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

/** El día de hoy del teléfono. */
export const localToday = (nowMs: number): string => dayjs(nowMs).format(DATE_FORMAT);

/** `date` más `days` días (negativo para ir hacia atrás). */
export const addDays = (date: string, days: number): string =>
  dayjs.utc(date).add(days, "day").format(DATE_FORMAT);

/**
 * La cuadrícula del mes de `date`: del lunes de la semana del día 1 a 41 días
 * después. Día, Semana y Mes leen de la misma petición, y todos los días del mes
 * piden el mismo rango (se reaprovecha la caché).
 */
export function monthGrid(date: string): { from: string; to: string } {
  const first = dayjs.utc(date).startOf("month");
  // `day()`: 0 domingo … 6 sábado. Días desde el lunes anterior (o el mismo).
  const sinceMonday = (first.day() + DAYS_PER_WEEK - 1) % DAYS_PER_WEEK;
  const from = first.subtract(sinceMonday, "day").format(DATE_FORMAT);
  return { from, to: addDays(from, MONTH_GRID_DAYS - 1) };
}
