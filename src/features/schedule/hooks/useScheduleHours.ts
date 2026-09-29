import type { HourSpan } from "../utils/hourSpan";

/** La franja del prototipo: de 08:00 a 21:00. */
export const DEFAULT_SCHEDULE_HOURS: HourSpan = { start: 8, end: 21 };

/**
 * La franja de horas que enseña la agenda. Hoy es la del prototipo; cuando el
 * perfil del profesor diga en qué horas está disponible (hay clubes de 24
 * horas), saldrá de ahí y solo cambia este hook. Aunque sea más corta, la tira
 * se amplía sola para que quepan las clases del día (`visibleHours`).
 */
export function useScheduleHours(): HourSpan {
  return DEFAULT_SCHEDULE_HOURS;
}
