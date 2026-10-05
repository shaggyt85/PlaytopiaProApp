import type { ColorPair } from "@/shared/config/theme";
import type { ScheduleClass } from "@/shared/schemas/schedule.schema";
import { colorAt } from "@/shared/utils/colorAt";

/**
 * El color de un grupo: por su id, en ciclo sobre `palette`, y no por su sitio
 * en la lista, así es el mismo en «Mis grupos» y en su detalle. Una clase
 * antigua sin grupo, por el suyo.
 */
export const groupColors = <T extends ColorPair>(next: Pick<ScheduleClass, "group_id" | "id">, palette: readonly T[]): T =>
  colorAt(palette, next.group_id ?? next.id);
