import type { t as translate } from "@/shared/config/i18n";
import { formatHourOfDay, formatWeekdayShort } from "@/shared/utils/formatDate";

import type { WeekDay } from "../schemas/weeklyHours.schema";

import { weekRanges } from "./weekRanges";

/**
 * Un día con sus tramos: «Lun 16:00–19:00» o «Mié 09:00–11:00 y 17:00–19:00».
 * Los tramos los calcula `weekRanges` y se escriben con `formatHourOfDay` y
 * `common.timeRange`, el mismo texto que el horario de una clase. Lo usa el
 * detalle «Tu semana» del editor.
 */
export function dayRangesLabel(day: WeekDay, hours: readonly number[], t: typeof translate): string {
  const ranges = weekRanges(hours).map(({ start, end }) =>
    t("common.timeRange", { start: formatHourOfDay(start), end: formatHourOfDay(end) }),
  );
  return t("profile.availability.day", {
    day: formatWeekdayShort(Number(day)),
    ranges: ranges.join(t("profile.availability.rangeSeparator")),
  });
}
