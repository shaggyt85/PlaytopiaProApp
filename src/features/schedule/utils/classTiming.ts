import { wallAsUtcMs } from "@/shared/utils/clubClock";

import type { ScheduleClass } from "../schemas/schedule.schema";

const MINUTE_MS = 60_000;
export const MINUTES_PER_HOUR = 60;
export const MINUTES_PER_DAY = 24 * MINUTES_PER_HOUR;

/** Cómo está una clase respecto a «ahora». */
export type ClassStatus = "past" | "live" | "next" | "upcoming";

type Timed = Pick<ScheduleClass, "class_date" | "class_time" | "duration_minutes">;

/** Inicio y fin como hora de pared comparable (`wallAsUtcMs`). */
export function classSpan(c: Timed): { start: number; end: number } {
  const start = wallAsUtcMs(c.class_date, c.class_time);
  return { start, end: start + c.duration_minutes * MINUTE_MS };
}

/**
 * Minutos desde las 00:00 de su día en que empieza y termina, para colocarla en
 * la tira de horas. Una clase que pasa de medianoche se corta a las 24:00: la
 * tira es de un día.
 */
export function classMinutes(c: Pick<ScheduleClass, "class_time" | "duration_minutes">): {
  start: number;
  end: number;
} {
  const [hours = 0, minutes = 0] = c.class_time.split(":").map(Number);
  const start = hours * MINUTES_PER_HOUR + minutes;
  return { start, end: Math.min(MINUTES_PER_DAY, start + c.duration_minutes) };
}

/**
 * El estado de una clase a `nowWall` (`wallNow`). La próxima la decide Core
 * (`next_class`): se marca por su id y no se vuelve a calcular aquí.
 */
export function classStatus(
  c: Timed & Pick<ScheduleClass, "id">,
  nowWall: number,
  nextClassId: number | undefined,
): ClassStatus {
  const { start, end } = classSpan(c);
  if (end <= nowWall) return "past";
  if (start <= nowWall) return "live";
  return c.id === nextClassId ? "next" : "upcoming";
}
