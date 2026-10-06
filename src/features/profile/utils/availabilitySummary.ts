import type { t as translate } from "@/shared/config/i18n";
import { formatHourOfDay, formatWeekdayShort } from "@/shared/utils/formatDate";
import { joinParts } from "@/shared/utils/joinParts";

import { WEEK_DISPLAY_ORDER, type WeeklyHours } from "../schemas/weeklyHours.schema";

import { weekRanges } from "./weekRanges";

/** Lo que dice la tarjeta de una semana: cuánto y cuándo. */
export interface AvailabilitySummary {
  /** «3 días · 14 h semanales», o que aún no la ha indicado. */
  title: string;
  /** «Lun 16:00–19:00 · Mié 09:00–11:00 y 17:00–19:00»; vacío si no hay nada. */
  detail: string;
}

/**
 * El resumen de una semana de horas, de lunes a domingo (`WEEK_DISPLAY_ORDER`):
 * los días con alguna hora, el total de horas y los tramos de cada día
 * (`weekRanges`, escritos con `formatHourOfDay` y `common.timeRange`).
 */
export function availabilitySummary(week: WeeklyHours, t: typeof translate): AvailabilitySummary {
  const days = WEEK_DISPLAY_ORDER.filter((day) => (week[day]?.length ?? 0) > 0);
  if (days.length === 0) return { title: t("profile.availability.empty"), detail: "" };

  const hours = days.reduce((sum, day) => sum + new Set(week[day]).size, 0);
  const detail = joinParts(
    days.map((day) => {
      const ranges = weekRanges(week[day] ?? []).map(({ start, end }) =>
        t("common.timeRange", { start: formatHourOfDay(start), end: formatHourOfDay(end) }),
      );
      return t("profile.availability.day", {
        day: formatWeekdayShort(Number(day)),
        ranges: ranges.join(t("profile.availability.rangeSeparator")),
      });
    }),
  );

  return {
    title: t("profile.availability.summary", {
      days: t("profile.availability.days", { count: days.length }),
      hours,
    }),
    detail,
  };
}
