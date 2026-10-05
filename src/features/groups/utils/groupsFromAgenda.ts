import { CLASS_TYPE, type ScheduleClass } from "@/shared/schemas/schedule.schema";
import { wallAsUtcMs } from "@/shared/utils/clubClock";

/** Un grupo del profesor, como lo enseña «Mis grupos». */
export interface TeacherGroup {
  /** Su escuela y su grupo: los ids de grupo son de cada escuela. */
  key: string;
  /** Su próxima clase: de ella salen sus alumnos, plazas, hora, sede y pista. */
  next: ScheduleClass;
  /**
   * Una fecha de cada día de la semana en que tiene clase por delante, de lunes
   * a domingo: con ellas se escriben sus días («Lunes, miércoles»).
   */
  weekdayDates: string[];
  /** Cuántas clases le quedan por delante en las que se miran. */
  upcoming: number;
}

/** Su inicio como instante: Core lo manda como la apertura de la asistencia, que es cuando empieza. */
const startOf = (c: ScheduleClass) => Date.parse(c.attendance_opens_at);

/** El día de la semana de una fecha de pared, de lunes (0) a domingo (6). */
const weekdayOf = (date: string) => (new Date(wallAsUtcMs(date)).getUTCDay() + 6) % 7;

/**
 * Los grupos del profesor a partir de su agenda: en Core toda clase es de un
 * grupo, también las de una sola sesión, así que cada grupo con alguna clase
 * suya por delante es un grupo activo.
 *
 * - Las plazas de recuperación no son grupos: son el contenedor de un alumno que
 *   ya sale en la clase de la que salió.
 * - Una clase antigua sin grupo (`group_id` a `null`) cuenta como su propio grupo.
 * - Cada grupo, con su próxima clase; ordenados por ella, la más cercana antes.
 */
export function groupsFromAgenda(classes: readonly ScheduleClass[], nowMs: number): TeacherGroup[] {
  const byGroup = new Map<string, ScheduleClass[]>();
  for (const c of classes) {
    if (c.class_type === CLASS_TYPE.RECOVERY || startOf(c) <= nowMs) continue;
    const key = c.group_id === null ? `${c.db_id}-class-${c.id}` : `${c.db_id}-${c.group_id}`;
    const sessions = byGroup.get(key);
    if (sessions) sessions.push(c);
    else byGroup.set(key, [c]);
  }

  return [...byGroup]
    .map(([key, sessions]) => {
      const sorted = [...sessions].sort((a, b) => startOf(a) - startOf(b));
      const byWeekday = new Map<number, string>();
      for (const s of sorted) {
        const day = weekdayOf(s.class_date);
        if (!byWeekday.has(day)) byWeekday.set(day, s.class_date);
      }
      return {
        key,
        next: sorted[0],
        weekdayDates: [...byWeekday].sort(([a], [b]) => a - b).map(([, date]) => date),
        upcoming: sorted.length,
      };
    })
    .sort((a, b) => startOf(a.next) - startOf(b.next));
}
