import type { ScheduleClass } from "@/shared/schemas/schedule.schema";
import { joinParts } from "@/shared/utils/joinParts";

/**
 * Dónde es un grupo: su sede y su pista («Club Padel Indoor · Pista 1»), de su
 * próxima clase. `clubLabel` es el nombre de la sede (`clubOf(…).label`), vacío
 * si ya no está en «Mis clubes»: entonces, solo la pista. Lo escriben «Mis
 * grupos», la cabecera del detalle de un grupo y «Su grupo» en la ficha.
 */
export const groupPlace = (next: Pick<ScheduleClass, "track_name">, clubLabel: string): string =>
  joinParts([clubLabel, next.track_name]);
