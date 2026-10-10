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

/**
 * Los `class_type` de Core que la app distingue (`class_manager::class_type`).
 * Una plaza de recuperación es una clase de una plaza que Core crea con su
 * propio grupo; su alumno sale en la lista de la clase de la que salió.
 */
export const CLASS_TYPE = { RECOVERY: 4 } as const;

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
  /** Rango de nivel, `min - max` («2.5 - 3»); `null` si la clase no tiene. */
  level_range: z.string().nullable(),
  /** `null` si la clase no tiene pista. */
  track_name: z.string().nullable(),
  class_type: z.number().int(),
  /**
   * `true/false` desde Core `722c0465`. El `0/1` de antes se acepta mientras
   * esté desplegado el Core anterior: la app sale primero.
   */
  is_private: z.union([z.boolean(), z.number().int()]),
  /** `null` en las clases sueltas antiguas, sin grupo. */
  group_id: z.number().int().nullable(),
  /** Cuántas clases tiene su grupo («una de 40»). */
  number_of_classes: z.number().int().nullable(),
  students: StudentsSchema,
  /**
   * Desde cuándo se puede pasar lista (instante UTC, RFC 3339): cuando empieza
   * la clase, en la hora de su escuela. Lo calcula Core: la app no escribe la
   * regla ni usa la hora del móvil.
   */
  attendance_opens_at: z.string(),
  /** Hasta cuándo (exclusivo): el final del segundo día después de la clase. */
  attendance_closes_at: z.string(),
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

/**
 * La clase anterior del grupo de una clase (`PreviousClassResponse`), de
 * `GET /MobileTeacher/classes/{db_id}/{class_id}/previous`: la misma forma que
 * una clase de la agenda. `null` si es la primera del grupo o la clase es suelta.
 */
export const PreviousClassResponseSchema = z.object({
  previous_class: ScheduleClassSchema.nullable(),
});
export type PreviousClassResponse = z.infer<typeof PreviousClassResponseSchema>;
