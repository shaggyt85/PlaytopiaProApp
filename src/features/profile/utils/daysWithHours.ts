import { WEEK_DISPLAY_ORDER, type WeekDay, type WeeklyHours } from "../schemas/weeklyHours.schema";

/**
 * Los días de la semana que tienen alguna hora, de lunes a domingo. Una sola
 * definición: el resumen de la tarjeta, las franjas, «Tu semana» y con qué
 * modo y qué día se abre el editor.
 */
export const daysWithHours = (week: WeeklyHours): WeekDay[] =>
  WEEK_DISPLAY_ORDER.filter((day) => (week[day]?.length ?? 0) > 0);
