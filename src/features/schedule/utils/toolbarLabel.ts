import type { t as translate } from "@/shared/config/i18n";
import { formatDayMonthShort, formatMonthYear, formatWallTime, formatWeekdayDay } from "@/shared/utils/formatDate";

import { weekDays } from "./scheduleDates";
import type { ScheduleView } from "./scheduleViews";

type Label = (date: string, nowWall: number, t: typeof translate) => string;

const withTime = (label: string, nowWall: number, t: typeof translate) =>
  t("schedule.toolbar", { label, time: formatWallTime(nowWall) });

/**
 * El texto de la barra en cada vista: «lunes 18 · 21:41», «18 nov – 24 nov ·
 * 21:41» y «noviembre de 2026». La semana se compone siempre igual, sin
 * \`Intl.formatRange\`: así sale lo mismo en los tests, en Android y en iOS.
 */
const TOOLBAR_LABELS = {
  day: (date, nowWall, t) => withTime(formatWeekdayDay(date), nowWall, t),
  week: (date, nowWall, t) => {
    const days = weekDays(date);
    const range = t("schedule.week.range", {
      from: formatDayMonthShort(days[0]),
      to: formatDayMonthShort(days[days.length - 1]),
    });
    return withTime(range, nowWall, t);
  },
  month: (date) => formatMonthYear(date),
} satisfies Record<ScheduleView, Label>;

/** El texto de la barra para el día \`date\` en la vista \`view\`. */
export const toolbarLabel = (view: ScheduleView, date: string, nowWall: number, t: typeof translate): string =>
  TOOLBAR_LABELS[view](date, nowWall, t);
