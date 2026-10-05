import type { ColorPair } from "@/shared/config/theme";
import type { ScheduleClass } from "@/shared/schemas/schedule.schema";

import { classColors } from "./classColors";

/** Cuántos puntos lleva como mucho un día en la tira de la semana y en el mes. */
export const MAX_DAY_DOTS = 3;

/**
 * Los puntos de cada día: uno por clase, con su color en el día (`classColors`,
 * el mismo de su tarjeta en Día y su fila en Semana), en orden y hasta
 * `MAX_DAY_DOTS`. Se calcula una vez por respuesta (quien lo usa lo guarda con
 * `useMemo`), no cada minuto.
 */
export function dotsByDate(
  byDate: ReadonlyMap<string, readonly ScheduleClass[]>,
  palette: readonly ColorPair[],
): Map<string, string[]> {
  const dots = new Map<string, string[]>();
  for (const [date, classes] of byDate) {
    dots.set(date, [...classColors(classes, palette).values()].slice(0, MAX_DAY_DOTS).map((c) => c.color));
  }
  return dots;
}
