import type { t as translate } from "@/shared/config/i18n";
import { formatClubTime, formatWallTime } from "@/shared/utils/formatDate";

import type { ScheduleClass } from "../schemas/schedule.schema";

import { classSpan } from "./classTiming";

/** De qué hora a qué hora es una clase: «08:30–09:30». El fin sale de su duración (`classSpan`). */
export function classTimeRange(
  c: Pick<ScheduleClass, "class_date" | "class_time" | "duration_minutes">,
  t: typeof translate,
): string {
  return t("schedule.detail.timeRange", {
    start: formatClubTime(c.class_time),
    end: formatWallTime(classSpan(c).end),
  });
}
