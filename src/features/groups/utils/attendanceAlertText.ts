import type { t as translate } from "@/shared/config/i18n";

import type { AttendanceAlert } from "../schemas/groupAttendance.schema";

type AlertOf<K extends AttendanceAlert["kind"]> = Extract<AttendanceAlert, { kind: K }>;

/** El texto de cada aviso, por su `kind`: un tipo nuevo de Core se añade aquí. */
const ALERT_TEXT: { [K in AttendanceAlert["kind"]]: (alert: AlertOf<K>, t: typeof translate) => string } = {
  consecutive_absences: ({ count }, t) => t("groups.student.alert.consecutiveAbsences", { count }),
  absences_in_last: ({ absences, of }, t) => t("groups.student.alert.absencesInLast", { count: absences, of }),
};

/**
 * El aviso de las faltas de un alumno, traducido («2 ausencias seguidas», «3
 * ausencias en las últimas 4 clases»). Core decide si hay aviso y con qué
 * cifras; la app solo lo escribe.
 */
export function attendanceAlertText(alert: AttendanceAlert, t: typeof translate): string {
  const write = ALERT_TEXT[alert.kind] as (alert: AttendanceAlert, t: typeof translate) => string;
  return write(alert, t);
}
