import type { t as translate } from "@/shared/config/i18n";
import type { ScheduleClass } from "@/shared/schemas/schedule.schema";
import { wallAsUtcMs } from "@/shared/utils/clubClock";
import { formatClubTime, formatWallTime } from "@/shared/utils/formatDate";

const MINUTE_MS = 60_000;

type Timed = Pick<ScheduleClass, "class_date" | "class_time" | "duration_minutes">;

/** Inicio y fin como hora de pared comparable (`wallAsUtcMs`). */
export function classSpan(c: Timed): { start: number; end: number } {
  const start = wallAsUtcMs(c.class_date, c.class_time);
  return { start, end: start + c.duration_minutes * MINUTE_MS };
}

/** De qué hora a qué hora es una clase: «08:30–09:30». El fin sale de su duración (`classSpan`). */
export function classTimeRange(c: Timed, t: typeof translate): string {
  return t("common.timeRange", {
    start: formatClubTime(c.class_time),
    end: formatWallTime(classSpan(c).end),
  });
}
