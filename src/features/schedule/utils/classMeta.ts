import type { t as translate } from "@/shared/config/i18n";
import type { ScheduleClass } from "@/shared/schemas/schedule.schema";
import { joinParts } from "@/shared/utils/joinParts";

/**
 * «75 min» y lo que cada fila añade detrás: «75 min · Wave Padel Club · Pista 2»
 * en Semana, donde la hora va en su cuadrado. Lo que falta no deja separador.
 */
export function durationMeta(
  c: Pick<ScheduleClass, "duration_minutes">,
  t: typeof translate,
  // Lo que falte (una clase sin pista) no se pinta: lo descarta `joinParts`.
  extra: readonly (string | null)[] = [],
): string {
  return joinParts([t("schedule.day.minutes", { count: c.duration_minutes }), ...extra]);
}
