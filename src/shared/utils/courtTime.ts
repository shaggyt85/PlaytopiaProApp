import type { t as translate } from "@/shared/config/i18n";

export const MINUTES_PER_HOUR = 60;

/** Las horas y los minutos a dos cifras de un tiempo: 350 → «5» y «50». */
const clock = (minutes: number) => ({
  hours: Math.floor(minutes / MINUTES_PER_HOUR),
  minutes: String(minutes % MINUTES_PER_HOUR).padStart(2, "0"),
});

/**
 * Un tiempo en pista exacto, con los minutos a dos cifras: «5:50 h», «0:45 h».
 * Sin redondeo, porque es lo que se le paga. Único sitio que escribe horas: el
 * tiempo en pista de hoy en la Agenda y las horas del mes en Perfil.
 */
export function courtTimeLabel(minutes: number, t: typeof translate): string {
  return t("common.courtTime", clock(minutes));
}

/** Lo hecho de lo planificado, exacto: «9:00 / 12:00 h» (las horas de cada club y de cada mes en Perfil). */
export function courtTimeProgressLabel(done: number, planned: number, t: typeof translate): string {
  const d = clock(done);
  const p = clock(planned);
  return t("common.courtTimeProgress", {
    doneHours: d.hours,
    doneMinutes: d.minutes,
    plannedHours: p.hours,
    plannedMinutes: p.minutes,
  });
}
