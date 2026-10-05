import type { ClassStudent } from "@/shared/schemas/schedule.schema";

/** Cómo va la asistencia de una clase. */
export interface AttendanceSummary {
  /** Los marcados como presentes. */
  present: number;
  /** Los alumnos de la lista. */
  total: number;
  /** Ya tienen marca todos (y hay alguno): «Asistencia registrada». */
  complete: boolean;
}

/** «2/4 presentes» o, con todos marcados, «✓ Asistencia registrada · 2/4». */
export function attendanceSummary(students: readonly Pick<ClassStudent, "attendance">[]): AttendanceSummary {
  return {
    present: students.filter((s) => s.attendance === "present").length,
    total: students.length,
    complete: students.length > 0 && students.every((s) => s.attendance !== null),
  };
}
