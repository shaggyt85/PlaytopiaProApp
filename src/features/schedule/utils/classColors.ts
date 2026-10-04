import type { ColorPair } from "@/shared/config/theme";

import type { ScheduleClass } from "../schemas/schedule.schema";

import { colorAt } from "./colorAt";

/**
 * El color de cada clase de un día: por su orden (hora y, si coinciden, id) y en
 * ciclo sobre `palette`, como el prototipo, que da un color a cada clase para dar
 * vida a la agenda. Fijo y no al azar: un mismo día sale igual en Día, en Semana
 * y en los puntos de la tira, y no cambia al repintar.
 */
export function classColors<T extends ColorPair>(
  classes: readonly Pick<ScheduleClass, "id" | "class_time">[],
  palette: readonly T[],
): Map<number, T> {
  const ordered = [...classes].sort((a, b) => a.class_time.localeCompare(b.class_time) || a.id - b.id);
  return new Map(ordered.map((c, index) => [c.id, colorAt(palette, index)]));
}
