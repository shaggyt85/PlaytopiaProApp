import type { t as translate } from "@/shared/config/i18n";
import { joinParts } from "@/shared/utils/joinParts";

import type { ScheduleClass } from "../schemas/schedule.schema";

/**
 * «75 min» y lo que cada fila añade detrás: «75 min · Wave Padel Club · Pista 2»
 * en Semana, donde la hora va en su cuadrado. Lo que falta no deja separador.
 */
export function durationMeta(
  c: Pick<ScheduleClass, "duration_minutes">,
  t: typeof translate,
  extra: readonly string[] = [],
): string {
  return joinParts([t("schedule.day.minutes", { count: c.duration_minutes }), ...extra]);
}
