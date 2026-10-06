import { z } from "zod";

import { TeacherProfileSchema } from "@/shared/schemas/teacherProfile.schema";

import { WeeklyHoursSchema } from "./weeklyHours.schema";

// Lo que Perfil pide además del perfil de siempre (`GET /api/UserTeacher/{id}
// ?include=hours,availability`): sus horas y su disponibilidad. Solo lo usa
// Perfil; el resto del perfil es el mismo contrato compartido.

/** Una sede donde trabaja, tal como sale en su perfil (`ProfileClubDto`). */
export const ProfileClubSchema = z.object({
  /** Escuela. La identidad de una sede es `db_id` + `club_id`. */
  db_id: z.number().int(),
  /** Sede dentro de la escuela. */
  club_id: z.number().int(),
  school_name: z.string(),
  /** `null` si la escuela no le puso nombre propio a la sede. */
  club_name: z.string().nullable(),
});
export type ProfileClub = z.infer<typeof ProfileClubSchema>;

/** Minutos y clases, planificadas y hechas (`HoursTallyDto`). «Hecha» es la que ya empezó. */
export const HoursTallySchema = z.object({
  planned_minutes: z.number().int().nonnegative(),
  done_minutes: z.number().int().nonnegative(),
  planned_classes: z.number().int().nonnegative(),
  done_classes: z.number().int().nonnegative(),
});
export type HoursTally = z.infer<typeof HoursTallySchema>;

/** Las cifras de un mes: el total y las de cada sede, también las que van a 0. */
export const HoursMonthSchema = z.object({
  /** `"2026-10"`. */
  month: z.string().regex(/^\d{4}-\d{2}$/),
  total: HoursTallySchema,
  /** La sede, por `db_id` y `club_id`, en `hours.clubs`. */
  clubs: z.array(ProfileClubSchema.pick({ db_id: true, club_id: true }).extend(HoursTallySchema.shape)),
});
export type HoursMonth = z.infer<typeof HoursMonthSchema>;

/** Sus horas en las sedes donde trabaja ahora (`TeacherHoursResponse`). */
export const TeacherHoursSchema = z.object({
  /** Cada sede una vez, en el orden del desglose de cada mes. */
  clubs: z.array(ProfileClubSchema),
  /** Del más reciente (el actual) al más antiguo. */
  months: z.array(HoursMonthSchema),
});
export type TeacherHours = z.infer<typeof TeacherHoursSchema>;

/** Una sede donde trabaja con su semana (`ClubAvailabilityDto`). */
export const ClubAvailabilitySchema = ProfileClubSchema.extend({
  week: WeeklyHoursSchema,
});
export type ClubAvailability = z.infer<typeof ClubAvailabilitySchema>;

/** El perfil con sus horas y su disponibilidad: lo que responde Core con `include`. */
export const ProfileDetailsSchema = TeacherProfileSchema.extend({
  hours: TeacherHoursSchema,
  /** Cada sede donde trabaja, en el orden de `hours`; sin semana guardada, vacía. */
  availability: z.array(ClubAvailabilitySchema),
});
export type ProfileDetails = z.infer<typeof ProfileDetailsSchema>;
