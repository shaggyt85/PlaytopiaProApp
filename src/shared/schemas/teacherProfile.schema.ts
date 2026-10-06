import { z } from "zod";

/** Un código estable de Core con su nombre ya traducido (`Accept-Language`). */
const NamedCodeSchema = z.object({
  /** Estable: es lo que se manda al guardar el perfil. */
  code: z.string(),
  /** En el idioma de la app, o en español si Core no lo tiene traducido. */
  name: z.string(),
});

/** Un deporte que da, con sus especialidades, en el orden del catálogo. */
export const TeacherSportSchema = NamedCodeSchema.extend({
  specialties: z.array(NamedCodeSchema),
});
export type TeacherSport = z.infer<typeof TeacherSportSchema>;

/**
 * Lo que la app usa del perfil del profesor (`GET` / `PATCH
 * /api/UserTeacher/{id}`, `TeacherProfileResponse` en Scalar). Zod descarta el
 * resto; se añaden campos cuando una pantalla los necesita.
 *
 * Lleva textos que traduce Core (los deportes): su query key lleva el idioma.
 */
export const TeacherProfileSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  last_name: z.string(),
  email: z.string(),
  phone_number: z.string(),
  /**
   * Fecha de nacimiento como la guarda Core (`"1990-05-15T00:00:00"`, sin
   * zona): es una fecha de calendario y se muestra tal cual.
   */
  birthday: z.string().nullable(),
  /** Como lo guarda Core (`GENDER`, `shared/config/gender`); `null` si no hay. */
  gender: z.number().int().nullable(),
  /** URL de su foto, o la de por defecto si no subió ninguna: la pone Core. */
  avatar: z.string().nullable(),
  /** Versión aceptada; `null` si nunca los aceptó (p. ej. alta desde el CRM). */
  terms_version: z.string().nullable(),
  accepted_terms_at: z.string().nullable(),
  /** Su presentación; `null` si no escribió ninguna. */
  description: z.string().nullable(),
  /** Años de experiencia; `null` si no los dijo. */
  experience_years: z.number().int().nullable(),
  /** Lo que da. Lo que el Super Admin desactiva deja de salir. */
  sports: z.array(TeacherSportSchema),
});
export type TeacherProfile = z.infer<typeof TeacherProfileSchema>;

/** Lo que la app cambia del perfil. */
export type TeacherProfileChanges = Partial<Pick<TeacherProfile, "terms_version">>;
