import type { t as translate } from "@/shared/config/i18n";

/**
 * El nombre del día, con «Hoy · » delante si es hoy: «Hoy · lunes 18» en Día y
 * «Hoy · 18 de noviembre» en Mes (cada vista da su día ya formateado). Lo pintan
 * la pastilla y el título de la lista, y lo anuncia el lector de pantalla al
 * cambiar de día, así todos dicen lo mismo.
 */
export function dayLabel(day: string, isToday: boolean, t: typeof translate): string {
  return isToday ? t("schedule.day.today", { day }) : day;
}
