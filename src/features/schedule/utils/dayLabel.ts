import type { t as translate } from "@/shared/config/i18n";
import { formatWeekdayDay } from "@/shared/utils/formatDate";

/**
 * El nombre del día que se ve: «Hoy · lunes 18» si es hoy y «martes 19» si no.
 * Lo pintan la pastilla del día y lo anuncia el lector de pantalla al cambiar de
 * día, así los dos dicen lo mismo.
 */
export function dayLabel(date: string, isToday: boolean, t: typeof translate): string {
  const day = formatWeekdayDay(date);
  return isToday ? t("schedule.day.today", { day }) : day;
}
