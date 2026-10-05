import type { t as translate } from "@/shared/config/i18n";
import { classTimeRange } from "@/shared/utils/classTimeRange";
import { capitalize, formatWeekdayName, formatWeekdayShortDayMonth } from "@/shared/utils/formatDate";
import { joinParts } from "@/shared/utils/joinParts";

import type { TeacherGroup } from "./groupsFromAgenda";

/**
 * Cuándo es un grupo, con la hora de su próxima clase: sus días de la semana
 * («Lunes, miércoles · 18:00–19:30») o, si solo le queda una clase, su fecha
 * («Jue 23 oct · 18:00–18:30»): con una sola no se repite ningún día.
 */
export function groupWhen({ next, weekdayDates, upcoming }: TeacherGroup, t: typeof translate): string {
  const days = upcoming > 1 ? weekdayDates.map(formatWeekdayName).join(", ") : formatWeekdayShortDayMonth(next.class_date);
  return joinParts([capitalize(days), classTimeRange(next, t)]);
}
