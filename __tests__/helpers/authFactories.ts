import { TERMS_VERSION } from "@/features/auth/schemas/signUp.schema";
import type { TeacherProfile } from "@/shared/schemas/teacherProfile.schema";

import { createTestJwt, teacherClaims } from "./jwt";

/**
 * Respuesta de `POST /api/auth/login/teacher` del profesor 42 de la escuela 7.
 * El access token es un JWT de verdad: de él sale quién es el profesor.
 */
export const signInTokens = {
  access_token: createTestJwt(teacherClaims()),
  refresh_token: "refresco",
  id: 42,
  role_id: 4,
  db_id: 7,
};

/** Perfil del profesor 42 con esa versión de los términos aceptada (`null`: nunca los aceptó). */
export const teacherProfile = (version: string | null = TERMS_VERSION): TeacherProfile => ({
  id: 42,
  name: "David",
  terms_version: version,
  accepted_terms_at: version ? "2026-09-26T10:00:00" : null,
});
