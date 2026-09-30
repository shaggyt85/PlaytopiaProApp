import type {
  NextClass,
  ScheduleClass,
  ScheduleResponse,
} from "@/features/schedule/schemas/schedule.schema";

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
    { name: "Diego", last_name: "Pérez" },
    { name: "Lucía", last_name: "Romero" },
  ],
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
