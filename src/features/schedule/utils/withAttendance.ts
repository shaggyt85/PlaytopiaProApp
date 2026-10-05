import type { AttendanceStatus, ClassStudent, ScheduleClass, ScheduleResponse } from "@/shared/schemas/schedule.schema";
import type { AttendanceTarget } from "@/shared/services/scheduleService";

/**
 * Una clase con la marca de un alumno ya puesta, para verla al instante
 * mientras Core la guarda. El alumno se busca por la clase en la que está
 * inscrito (`class_id`), así quien recupera se marca en la tarjeta de su clase
 * aunque esté en su plaza. Si no está en ella, la misma clase, el mismo objeto.
 */
export function withStudentMark<T extends ScheduleClass>(
  c: T,
  { dbId, classId, studentId }: AttendanceTarget,
  status: AttendanceStatus,
): T {
  if (c.db_id !== dbId) return c;
  const isTarget = (s: ClassStudent) => s.class_id === classId && s.student_id === studentId;
  if (!c.students.some(isTarget)) return c;
  return { ...c, students: c.students.map((s) => (isTarget(s) ? { ...s, attendance: status } : s)) };
}

/** La agenda con la marca de un alumno ya puesta en cada clase donde está (`withStudentMark`). */
export function withAttendance(
  data: ScheduleResponse,
  target: AttendanceTarget,
  status: AttendanceStatus,
): ScheduleResponse {
  return {
    classes: data.classes.map((c) => withStudentMark(c, target, status)),
    next_class: data.next_class ? withStudentMark(data.next_class, target, status) : null,
  };
}
