import type { t as translate } from "@/shared/config/i18n";
import { capitalize, formatDayMonthShort, formatMonthYear, formatWeekdayShortDayMonth } from "@/shared/utils/formatDate";

import { weekDays } from "./scheduleDates";

// Los textos del centro de la barra en cada vista (‹ Hoy ›, como el prototipo).
// Cuál se usa lo dice la ficha de cada vista (`SCHEDULE_VIEW_CONFIG`).

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

/** Día: «Hoy» o «Lun 18 sept». */
export const dayToolbarLabel = (date: string, isToday: boolean, t: typeof translate): string =>
  isToday ? t("schedule.toolbar.today") : capitalize(formatWeekdayShortDayMonth(date));

/** Semana: «16 nov – 22 nov». */
export const weekToolbarLabel = (date: string, _isToday: boolean, t: typeof translate): string => weekRange(date, t);

/** Mes: «Noviembre de 2026». */
export const monthToolbarLabel = (date: string): string => capitalize(formatMonthYear(date));
