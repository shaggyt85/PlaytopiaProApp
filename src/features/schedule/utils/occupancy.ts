import type { ScheduleClass } from "@/shared/schemas/schedule.schema";

/**
 * Lo llena que está una clase, de 0 a 1, para su barra (`3/4` → 0,75). Una
 * clase sin plazas da 0 y una con más alumnos que plazas no pasa de llena.
 */
export function occupancy({
  current_participants,
  max_participants,
}: Pick<ScheduleClass, "current_participants" | "max_participants">): number {
  if (max_participants <= 0) return 0;
  return Math.min(1, Math.max(0, current_participants / max_participants));
}
