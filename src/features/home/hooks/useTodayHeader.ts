import type { TranslationKey } from "@/shared/locales";
import { formatWeekdayDate } from "@/shared/utils/formatDate";

import { greetingFor } from "../utils/greeting";

import { useForegroundNow } from "./useForegroundNow";

interface TodayHeader {
  /** Clave del saludo según la hora del móvil. */
  greeting: TranslationKey;
  /** "Viernes · 22 de noviembre", en el idioma activo. */
  date: string;
}

/**
 * Saludo y fecha de la cabecera de Hoy, con la hora del móvil (`serverNow()`),
 * al día cada vez que la app vuelve al primer plano. La pantalla solo los pinta.
 */
export function useTodayHeader(): TodayHeader {
  const now = useForegroundNow();
  return {
    greeting: `home.greeting.${greetingFor(new Date(now).getHours())}`,
    date: formatWeekdayDate(now),
  };
}
