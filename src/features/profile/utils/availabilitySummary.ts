import type { t as translate } from "@/shared/config/i18n";

import type { WeeklyHours } from "../schemas/weeklyHours.schema";

import { daysWithHours } from "./daysWithHours";

/**
 * Lo que dice la tarjeta de una semana, como el prototipo: «3 días · 14 h
 * semanales» (los días con alguna hora y el total de horas). Sin ninguna, que
 * aún no la ha indicado. Los tramos de cada día no van en la tarjeta: se ven
 * en el editor (`dayRangesLabel`).
 */
export function availabilitySummary(week: WeeklyHours, t: typeof translate): string {
  const days = daysWithHours(week);
  if (days.length === 0) return t("profile.availability.empty");

  const hours = days.reduce((sum, day) => sum + new Set(week[day]).size, 0);
  return t("profile.availability.summary", {
    days: t("profile.availability.days", { count: days.length }),
    hours,
  });
}
