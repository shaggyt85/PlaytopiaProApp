import type { t as translate } from "@/shared/config/i18n";
import { formatWeekdayDay } from "@/shared/utils/formatDate";

import { addDays } from "./scheduleDates";

/**
 * Qué día es una clase visto desde hoy, para la tarjeta de la próxima: nada si
 * es hoy (basta la hora), «Mañana» o «lunes 25».
 */
export function relativeDay(date: string, today: string, t: typeof translate): string {
  if (date === today) return "";
  if (date === addDays(today, 1)) return t("schedule.next.tomorrow");
  return formatWeekdayDay(date);
}
