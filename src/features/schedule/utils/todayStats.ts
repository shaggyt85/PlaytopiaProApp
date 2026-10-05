import type { t as translate } from "@/shared/config/i18n";
import type { ScheduleClass } from "@/shared/schemas/schedule.schema";

import { classMinutes, MINUTES_PER_HOUR } from "./classTiming";

type DayClass = Pick<ScheduleClass, "class_time" | "duration_minutes" | "current_participants">;

/** Las cifras de hoy encima de la agenda. */
export interface TodayStats {
  classes: number;
  /** Plazas ocupadas sumadas: un alumno en dos clases cuenta dos veces. */
  students: number;
  /** Tiempo real en pista: lo que coincide en el tiempo (dos pistas a la vez) cuenta una sola vez. */
  minutesOnCourt: number;
}

/**
 * Las cifras de un día a partir de sus clases. Los minutos son los de la unión
 * de sus franjas: dos clases a la misma hora no hacen el doble de tiempo, porque
 * el profesor no se parte en dos. Es lo que se le paga: sin redondeos.
 */
export function todayStats(classes: readonly DayClass[]): TodayStats {
  const spans = classes.map(classMinutes).sort((a, b) => a.start - b.start);
  let minutesOnCourt = 0;
  let open: { start: number; end: number } | undefined;
  for (const span of spans) {
    if (open && span.start <= open.end) {
      open.end = Math.max(open.end, span.end);
    } else {
      if (open) minutesOnCourt += open.end - open.start;
      open = { ...span };
    }
  }
  if (open) minutesOnCourt += open.end - open.start;

  return {
    classes: classes.length,
    students: classes.reduce((sum, c) => sum + c.current_participants, 0),
    minutesOnCourt,
  };
}

/** El tiempo en pista exacto, con los minutos a dos cifras: «5:50 h», «0:45 h». */
export function courtTimeLabel(minutes: number, t: typeof translate): string {
  return t("schedule.today.courtTime", {
    hours: Math.floor(minutes / MINUTES_PER_HOUR),
    minutes: String(minutes % MINUTES_PER_HOUR).padStart(2, "0"),
  });
}
