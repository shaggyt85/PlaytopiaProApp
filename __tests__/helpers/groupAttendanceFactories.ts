import type { AttendanceEntry, StudentAttendance } from "@/features/groups/schemas/groupAttendance.schema";

/** Una clase del historial de ejemplo, tal como la manda Core. */
export const attendanceEntry = (overrides: Partial<AttendanceEntry> = {}): AttendanceEntry => ({
  class_id: 30,
  class_date: "2026-09-28",
  status: "present",
  ...overrides,
});

/** El historial del alumno 55 de ejemplo: dos clases, vino a una, sin aviso. */
export const studentAttendance = (overrides: Partial<StudentAttendance> = {}): StudentAttendance => ({
  student_id: 55,
  recent: [
    attendanceEntry({ class_id: 29, class_date: "2026-09-21", status: "absent" }),
    attendanceEntry(),
  ],
  present: 1,
  alert: null,
  ...overrides,
});
