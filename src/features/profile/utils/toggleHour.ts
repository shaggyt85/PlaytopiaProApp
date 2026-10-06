import type { WeekDay, WeeklyHours } from "../schemas/weeklyHours.schema";

import { toggleIn } from "./toggleIn";

/**
 * La semana con esa hora de ese día marcada o quitada («Por día»), sin tocar la
 * de entrada. Un día que se queda sin horas sale de la semana.
 */
export function toggleHour(week: WeeklyHours, day: WeekDay, hour: number): WeeklyHours {
  const hours = toggleIn(week[day] ?? [], hour).sort((a, b) => a - b);
  const { [day]: _old, ...rest } = week;
  return hours.length > 0 ? { ...rest, [day]: hours } : rest;
}
