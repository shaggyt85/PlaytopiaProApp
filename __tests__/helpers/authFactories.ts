import { TERMS_VERSION } from "@/features/auth/schemas/signUp.schema";
import type { TeacherTerms } from "@/features/auth/schemas/terms.schema";

/** Respuesta de `POST /api/auth/login/teacher` del profesor 42 de la escuela 7. */
export const signInTokens = {
  access_token: "acceso",
  refresh_token: "refresco",
  id: 42,
  role_id: 4,
  db_id: 7,
};

/** Términos del profesor 42 con esa versión aceptada (`null`: nunca los aceptó). */
export const teacherTerms = (version: string | null = TERMS_VERSION): TeacherTerms => ({
  id: 42,
  terms_version: version,
  accepted_terms_at: version ? "2026-09-26T10:00:00" : null,
});
