import { z } from "zod";

import { compareText } from "@/shared/utils/compareText";

// Contrato de Core (Scalar, grupo Mobile Teacher): la agenda del profesor,
// `GET /api/MobileTeacher/classes?from=&to=` (`TeacherClassesResponse`).

/** El nombre de un alumno: lo que necesitan sus iniciales y su fila. */
export const StudentNameSchema = z.object({
  name: z.string(),
  last_name: z.string(),
});
export type StudentName = z.infer<typeof StudentNameSchema>;

/** Si el alumno vino (`present`) o no (`absent`). */
export const AttendanceStatusSchema = z.enum(["present", "absent"]);
export type AttendanceStatus = z.infer<typeof AttendanceStatusSchema>;

/** Un alumno de la clase (`ClassStudentDto`). */
export const ClassStudentSchema = StudentNameSchema.extend({
  /**
   * La clase en la que está inscrito: la de la tarjeta o, si recupera, su plaza
   * de recuperación. Es la que va en la ruta para marcar su asistencia.
   */
  class_id: z.number().int(),
  /** id global del alumno. */
  student_id: z.number().int(),
  /** Su nivel en la sede de la clase; `null` si no tiene matrícula en ella. */
  level: z.number().nullable(),
  /** Su marca de asistencia; `null` si aún no la tiene. */
  attendance: AttendanceStatusSchema.nullable(),
  /** Si está en la clase por una plaza de recuperación. */
  is_recovery: z.boolean(),
});
export type ClassStudent = z.infer<typeof ClassStudentSchema>;

/**
 * La marca guardada (`AttendanceMarkDto`), la respuesta de
 * `PUT /MobileTeacher/classes/{db_id}/{class_id}/attendance/{student_id}`.
 * Marcar otra vez el mismo estado devuelve la que había.
 */
export const AttendanceMarkSchema = z.object({
  student_id: z.number().int(),
  status: AttendanceStatusSchema,
  /** id global del profesor que la marcó. */
  marked_by: z.number().int(),
  /** Instante UTC, RFC 3339. */
  marked_at: z.string(),
});
export type AttendanceMark = z.infer<typeof AttendanceMarkSchema>;

/** Por nombre y, si coincide, por apellido, como los ordena el idioma activo. */
const byName = (a: StudentName, b: StudentName) => compareText(a.name, b.name) || compareText(a.last_name, b.last_name);

/**
 * Los alumnos de una clase, ordenados al validarlos: Core los junta sin orden, y
 * así la tarjeta de la próxima clase y el detalle los ponen igual (con el mismo
 * color para cada uno, que sale de su posición).
 */
const StudentsSchema = z.array(ClassStudentSchema).transform((students) => [...students].sort(byName));

/** Una clase de la agenda (`TeacherClassDto`). */
export const ScheduleClassSchema = z.object({
  /** Escuela. Con `club_id` identifica la sede (su nombre y color, de «Mis clubes»). */
  db_id: z.number().int(),
  /** Sede dentro de la escuela. */
  club_id: z.number().int(),
  /** Id de la clase, para su detalle. */
  id: z.number().int(),
  title: z.string(),
  description: z.string().nullable(),
  /** Fecha de pared del club, `YYYY-MM-DD`: se enseña tal cual. */
  class_date: z.string(),
  /** Hora de pared del club, `HH:MM:SS`: se enseña tal cual. */
  class_time: z.string(),
  duration_minutes: z.number().int(),
  max_participants: z.number().int(),
  /** Plazas ocupadas: el «3» de «3/4». */
  current_participants: z.number().int(),
  /** Rango de nivel, `min - max` («2.5 - 3»). */
  level_range: z.string(),
  /** Vacío si la clase no tiene pista. */
  track_name: z.string(),
  class_type: z.number().int(),
  is_private: z.number().int(),
  /** `null` en las clases sueltas antiguas, sin grupo. */
  group_id: z.number().int().nullable(),
  /** Cuántas clases tiene su grupo («una de 40»). */
  number_of_classes: z.number().int().nullable(),
  students: StudentsSchema,
});
export type ScheduleClass = z.infer<typeof ScheduleClassSchema>;

/** La próxima clase: la misma clase y cuándo empieza como instante. */
export const NextClassSchema = ScheduleClassSchema.extend({
  /** Instante de inicio (UTC, RFC 3339): la hora de su club ya convertida. */
  starts_at: z.string(),
});
export type NextClass = z.infer<typeof NextClassSchema>;

/** La agenda: las clases del rango, pasadas incluidas, y la próxima. */
export const ScheduleResponseSchema = z.object({
  classes: z.array(ScheduleClassSchema),
  /** `null` si no tiene ninguna clase por delante. */
  next_class: NextClassSchema.nullable(),
});
export type ScheduleResponse = z.infer<typeof ScheduleResponseSchema>;
