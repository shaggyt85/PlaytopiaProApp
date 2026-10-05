import type { ScheduleClass } from "@/shared/schemas/schedule.schema";

/**
 * Cómo está la asistencia de una clase: aún no se puede pasar lista (`notYet`),
 * se puede (`open`) o ya pasó el plazo (`closed`).
 */
export type AttendanceState = "notYet" | "open" | "closed";

/**
 * La asistencia de una clase a `nowMs` («ahora» del servidor, `serverNow`), con
 * la ventana que manda Core (`attendance_opens_at` y `attendance_closes_at`,
 * este exclusivo). La regla de cuándo abre y cierra es de Core; aquí solo se
 * compara.
 */
export function attendanceState(
  c: Pick<ScheduleClass, "attendance_opens_at" | "attendance_closes_at">,
  nowMs: number,
): AttendanceState {
  if (nowMs < Date.parse(c.attendance_opens_at)) return "notYet";
  return nowMs < Date.parse(c.attendance_closes_at) ? "open" : "closed";
}
