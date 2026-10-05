import { z } from "zod";

import { AttendanceStatusSchema } from "@/shared/schemas/schedule.schema";

// Contrato de Core (Scalar, grupo Mobile Teacher): el historial de asistencia
// de los alumnos del grupo de una clase,
// `GET /api/MobileTeacher/classes/{db_id}/{class_id}/group-attendance`
// (`GroupAttendanceResponse`). Todo viene calculado: la app no cuenta, no ordena
// ni decide el aviso.

/** Una clase del historial de un alumno (`AttendanceEntryDto`). */
export const AttendanceEntrySchema = z.object({
  class_id: z.number().int(),
  /** Fecha de pared del club, `YYYY-MM-DD`: se enseña tal cual. */
  class_date: z.string(),
  status: AttendanceStatusSchema,
});
export type AttendanceEntry = z.infer<typeof AttendanceEntrySchema>;

/** El aviso de las faltas de un alumno (`AttendanceAlertDto`), según `kind`. */
export const AttendanceAlertSchema = z.discriminatedUnion("kind", [
  /** Sus últimas `count` clases, seguidas, sin venir. */
  z.object({ kind: z.literal("consecutive_absences"), count: z.number().int().nonnegative() }),
  /** `absences` ausencias en sus últimas `of` clases. */
  z.object({
    kind: z.literal("absences_in_last"),
    absences: z.number().int().nonnegative(),
    of: z.number().int().nonnegative(),
  }),
]);
export type AttendanceAlert = z.infer<typeof AttendanceAlertSchema>;

/** El historial de un alumno en su grupo (`StudentAttendanceDto`). */
export const StudentAttendanceSchema = z.object({
  student_id: z.number().int(),
  /** Sus últimas 10 clases con marca, de la más antigua a la más reciente. */
  recent: z.array(AttendanceEntrySchema),
  /** Cuántas de ellas vino. */
  present: z.number().int().nonnegative(),
  /** `null` si no hay nada que avisar. */
  alert: AttendanceAlertSchema.nullable(),
});
export type StudentAttendance = z.infer<typeof StudentAttendanceSchema>;

/**
 * Uno por alumno con alguna marca en el grupo, por su id; quien no tiene
 * ninguna no sale. Vacío si la clase no tiene grupo.
 */
export const GroupAttendanceResponseSchema = z.object({
  students: z.array(StudentAttendanceSchema),
});
export type GroupAttendanceResponse = z.infer<typeof GroupAttendanceResponseSchema>;
