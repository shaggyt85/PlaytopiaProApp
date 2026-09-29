import { sedeKey } from "@/shared/utils/sedeKey";

import type { ScheduleClass } from "../schemas/schedule.schema";

/** Cuántos puntos lleva como mucho un día en la tira de la semana y en el mes. */
export const MAX_DAY_DOTS = 3;

/**
 * Los puntos de cada día: el color de cada club distinto con clases ese día, en
 * el orden de sus clases y hasta \`MAX_DAY_DOTS\`. Se calcula una vez por
 * respuesta (quien lo usa lo guarda con \`useMemo\`), no cada minuto.
 */
export function dotsByDate(
  byDate: ReadonlyMap<string, readonly ScheduleClass[]>,
  colorOf: (c: ScheduleClass) => string,
): Map<string, string[]> {
  const dots = new Map<string, string[]>();
  for (const [date, classes] of byDate) {
    const seen = new Set<string>();
    const colors: string[] = [];
    for (const c of classes) {
      const club = sedeKey(c);
      if (seen.has(club)) continue;
      seen.add(club);
      colors.push(colorOf(c));
      if (colors.length === MAX_DAY_DOTS) break;
    }
    dots.set(date, colors);
  }
  return dots;
}
