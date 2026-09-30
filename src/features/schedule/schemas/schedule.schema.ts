import { z } from "zod";

import { compareText } from "@/shared/utils/compareText";

// Contrato de Core (Scalar, grupo Mobile Teacher): la agenda del profesor,
// `GET /api/MobileTeacher/classes?from=&to=` (`TeacherClassesResponse`).

/** Un alumno de la clase: solo el nombre, para las iniciales de la tarjeta. */
export const StudentNameSchema = z.object({
  name: z.string(),
  last_name: z.string(),
});
export type StudentName = z.infer<typeof StudentNameSchema>;

/** Por nombre y, si coincide, por apellido, como los ordena el idioma activo. */
const byName = (a: StudentName, b: StudentName) => compareText(a.name, b.name) || compareText(a.last_name, b.last_name);

/**
 * Los alumnos de una clase, ordenados al validarlos: Core los junta sin orden, y
 * así la tarjeta de la próxima clase y el detalle los ponen igual (con el mismo
 * color para cada uno, que sale de su posición).
 */
const StudentsSchema = z.array(StudentNameSchema).transform((students) => [...students].sort(byName));

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
