import type { t as translate } from "@/shared/config/i18n";
import { formatClubTime } from "@/shared/utils/formatDate";
import { joinParts } from "@/shared/utils/joinParts";

import type { ScheduleClass } from "../schemas/schedule.schema";

/**
 * La línea de datos de una clase: «16:00 · 75 min» y lo que cada tarjeta añade
 * detrás (la pista en la tira, el nivel en la próxima clase). Lo que falta no
 * deja separador.
 */
export function classMeta(
  c: Pick<ScheduleClass, "class_time" | "duration_minutes">,
  t: typeof translate,
  extra: readonly string[] = [],
): string {
  return joinParts([
    formatClubTime(c.class_time),
    t("schedule.day.minutes", { count: c.duration_minutes }),
    ...extra,
  ]);
}
