import type { t as translate } from "@/shared/config/i18n";
import { formatClubTime } from "@/shared/utils/formatDate";
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

/**
 * La línea de datos de una clase con su hora delante: «16:00 · 75 min» y lo que
 * cada tarjeta añade (la pista en la tira, el nivel en la próxima clase).
 */
export function classMeta(
  c: Pick<ScheduleClass, "class_time" | "duration_minutes">,
  t: typeof translate,
  extra: readonly string[] = [],
): string {
  return joinParts([formatClubTime(c.class_time), durationMeta(c, t, extra)]);
}
