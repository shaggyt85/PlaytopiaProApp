import type { t as translate } from "@/shared/config/i18n";
import { formatDayMonthShort, formatMonthYear, formatWallTime, formatWeekdayDay } from "@/shared/utils/formatDate";

import { weekDays } from "./scheduleDates";

// Los textos de la barra en cada vista. Cuál se usa lo dice la ficha de cada
// vista (`SCHEDULE_VIEW_CONFIG`).

const withTime = (label: string, nowWall: number, t: typeof translate) =>
  t("schedule.toolbar", { label, time: formatWallTime(nowWall) });

/**
 * Los extremos de la semana de `date`: «16 nov – 22 nov». Se compone siempre
 * igual, sin `Intl.formatRange`: así sale lo mismo en los tests, en Android y
 * en iOS.
 */
export function weekRange(date: string, t: typeof translate): string {
  const days = weekDays(date);
  return t("schedule.week.range", {
    from: formatDayMonthShort(days[0]),
    to: formatDayMonthShort(days[days.length - 1]),
  });
}

/** Día: «lunes 18 · 21:41». */
export const dayToolbarLabel = (date: string, nowWall: number, t: typeof translate): string =>
  withTime(formatWeekdayDay(date), nowWall, t);

/** Semana: «16 nov – 22 nov · 21:41». */
export const weekToolbarLabel = (date: string, nowWall: number, t: typeof translate): string =>
  withTime(weekRange(date, t), nowWall, t);

/** Mes: «noviembre de 2026». */
export const monthToolbarLabel = (date: string): string => formatMonthYear(date);
