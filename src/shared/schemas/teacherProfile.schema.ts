import { z } from "zod";

/**
 * Lo que la app usa del perfil del profesor (`GET` / `PATCH
 * /api/UserTeacher/{id}`, `TeacherResponse` en Scalar). Zod descarta el resto;
 * se añaden campos cuando una pantalla los necesita.
 */
export const TeacherProfileSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  /** Versión aceptada; `null` si nunca los aceptó (p. ej. alta desde el CRM). */
  terms_version: z.string().nullable(),
  accepted_terms_at: z.string().nullable(),
});
export type TeacherProfile = z.infer<typeof TeacherProfileSchema>;

/** Lo que la app cambia del perfil. */
export type TeacherProfileChanges = Partial<Pick<TeacherProfile, "terms_version">>;
