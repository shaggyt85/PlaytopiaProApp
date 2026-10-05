import type { ScheduleClass } from "@/shared/schemas/schedule.schema";

/**
 * Las clases agrupadas por `class_date`, en el orden en que llegan (Core las
 * manda por fecha y hora). Se agrupa una vez por respuesta: cada día se lee
 * directamente, y la vista Semana leerá del mismo `Map`.
 */
export function classesByDate(classes: readonly ScheduleClass[]): Map<string, ScheduleClass[]> {
  const byDate = new Map<string, ScheduleClass[]>();
  for (const c of classes) {
    const day = byDate.get(c.class_date);
    if (day) day.push(c);
    else byDate.set(c.class_date, [c]);
  }
  return byDate;
}
