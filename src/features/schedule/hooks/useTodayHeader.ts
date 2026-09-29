import type { TranslationKey } from "@/shared/locales";
import { formatWeekdayDate } from "@/shared/utils/formatDate";

import { greetingFor } from "../utils/greeting";

interface TodayHeader {
  /** Clave del saludo según la hora del móvil. */
  greeting: TranslationKey;
  /** "Viernes · 22 de noviembre", en el idioma activo. */
  date: string;
}

/**
 * Saludo y fecha de la cabecera de Hoy para `now` (el reloj de la pantalla,
 * `useForegroundNow`), así la cabecera y la agenda nunca dicen días distintos.
 * La pantalla solo los pinta.
 */
export function useTodayHeader(now: number): TodayHeader {
  return {
    greeting: `schedule.greeting.${greetingFor(new Date(now).getHours())}`,
    date: formatWeekdayDate(now),
  };
}
