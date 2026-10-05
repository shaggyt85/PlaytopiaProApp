import type {
  AttendanceMark,
  ClassStudent,
  NextClass,
  ScheduleClass,
  ScheduleResponse,
} from "@/features/schedule/schemas/schedule.schema";

/** Un alumno de la clase 31 de ejemplo, sin marca, tal como lo manda Core. */
export const classStudent = (overrides: Partial<ClassStudent> = {}): ClassStudent => ({
  class_id: 31,
  student_id: 55,
  name: "Lucía",
  last_name: "Romero",
  level: 2.5,
  attendance: null,
  is_recovery: false,
  ...overrides,
});

/** La marca que devuelve Core al guardar una. */
export const attendanceMark = (overrides: Partial<AttendanceMark> = {}): AttendanceMark => ({
  student_id: 55,
  status: "present",
  marked_by: 42,
  marked_at: "2026-10-05T16:05:00Z",
  ...overrides,
});

/** Una clase de la agenda de ejemplo, tal como la manda Core. */
export const scheduleClass = (overrides: Partial<ScheduleClass> = {}): ScheduleClass => ({
  db_id: 4,
  club_id: 7,
  id: 31,
  title: "Cantera Tarde",
  description: null,
  class_date: "2026-10-05",
  class_time: "16:00:00",
  duration_minutes: 75,
  max_participants: 4,
  current_participants: 3,
  level_range: "2.5 - 3",
  track_name: "Pista 1",
  class_type: 0,
  is_private: 0,
  group_id: 11,
  number_of_classes: 40,
  // Ya en el orden en que los deja el contrato (por nombre).
  students: [
    classStudent({ student_id: 54, name: "Diego", last_name: "Pérez", level: 3 }),
    classStudent({ student_id: 55, name: "Lucía", last_name: "Romero" }),
  ],
  // Su ventana de asistencia, como la calcula Core: las 16:00 del 5 en Madrid
  // (UTC+2) y el final del 7 allí.
  attendance_opens_at: "2026-10-05T14:00:00Z",
  attendance_closes_at: "2026-10-07T22:00:00Z",
  ...overrides,
});

/** La próxima clase: una clase más su instante de inicio. */
export const nextClass = (overrides: Partial<NextClass> = {}): NextClass => ({
  ...scheduleClass(),
  starts_at: "2026-10-05T14:00:00Z",
  ...overrides,
});

/** La agenda de ejemplo. */
export const scheduleResponse = (overrides: Partial<ScheduleResponse> = {}): ScheduleResponse => ({
  classes: [scheduleClass()],
  next_class: nextClass(),
  ...overrides,
});
