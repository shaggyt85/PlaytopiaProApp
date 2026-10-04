import type { AttendanceStatus, ClassStudent, ScheduleClass, ScheduleResponse } from "../schemas/schedule.schema";
import type { AttendanceTarget } from "../services/scheduleService";

/** El alumno marcado en las clases de una escuela: los demás, tal cual. */
function markIn<T extends ScheduleClass>(c: T, { dbId, classId, studentId }: AttendanceTarget, status: AttendanceStatus): T {
  if (c.db_id !== dbId) return c;
  const isTarget = (s: ClassStudent) => s.class_id === classId && s.student_id === studentId;
  if (!c.students.some(isTarget)) return c;
  return { ...c, students: c.students.map((s) => (isTarget(s) ? { ...s, attendance: status } : s)) };
}

/**
 * La agenda con la marca de un alumno ya puesta, para verla al instante
 * mientras Core la guarda. El alumno se busca por la clase en la que está
 * inscrito (`class_id`), así quien recupera se marca en la tarjeta de su clase
 * aunque esté en su plaza. Lo que no cambia sigue siendo el mismo objeto.
 */
export function withAttendance(
  data: ScheduleResponse,
  target: AttendanceTarget,
  status: AttendanceStatus,
): ScheduleResponse {
  return {
    classes: data.classes.map((c) => markIn(c, target, status)),
    next_class: data.next_class ? markIn(data.next_class, target, status) : null,
  };
}
