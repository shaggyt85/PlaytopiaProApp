import { z } from "zod";

/**
 * Lo que la pantalla de términos necesita del perfil del profesor
 * (`GET` / `PATCH /api/UserTeacher/{id}`, `TeacherResponse` en Scalar). Zod
 * descarta el resto de campos.
 */
export const TeacherTermsSchema = z.object({
  id: z.number().int(),
  /** Versión aceptada; `null` si nunca los aceptó (p. ej. alta desde el CRM). */
  terms_version: z.string().nullable(),
  accepted_terms_at: z.string().nullable(),
});
export type TeacherTerms = z.infer<typeof TeacherTermsSchema>;
