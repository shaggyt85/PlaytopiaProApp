import { z } from "zod";

import type { TranslationKey } from "@/shared/locales";

// Los mensajes de validación son claves de i18n tipadas: una clave que no
// existe no compila. La pantalla las traduce al mostrarlas.
export const message = (key: TranslationKey) => ({ error: key });

/** Email de cualquier formulario del flujo (login, registro, recuperación). */
export const EmailSchema = z
  .string(message("validation.emailRequired"))
  .trim()
  .min(1, message("validation.emailRequired"))
  .pipe(z.email(message("validation.emailInvalid")));

export const EmailFormSchema = z.object({ email: EmailSchema });
export type EmailForm = z.infer<typeof EmailFormSchema>;

export const PasswordFormSchema = z.object({
  password: z.string().min(1, message("validation.passwordRequired")),
});
export type PasswordForm = z.infer<typeof PasswordFormSchema>;

// ── Contratos de Core (Scalar) ────────────────────────────────────────────

/** POST /api/auth/check-email. */
export const CheckEmailResponseSchema = z.object({
  email: z.string(),
  exists: z.boolean(),
  is_student: z.boolean(),
  is_teacher: z.boolean(),
  /**
   * La cuenta de profesor aún no tiene contraseña: la dio de alta su club
   * desde el CRM. No se le pide (no la conoce): se le lleva a crearla por la
   * recuperación. Solo habla de la cuenta de profesor.
   */
  teacher_needs_password_setup: z.boolean(),
});
export type CheckEmailResponse = z.infer<typeof CheckEmailResponseSchema>;

/**
 * POST /api/PassRecovery/request. Siempre `{ status: "ok" }`, exista o no el
 * email (Core no revela qué cuentas hay).
 */
export const PasswordRecoveryResponseSchema = z.object({ status: z.string() });
export type PasswordRecoveryResponse = z.infer<typeof PasswordRecoveryResponseSchema>;

/** POST /api/auth/login/teacher. El campo se llama `username`, no `email`. */
export interface SignInRequest {
  username: string;
  password: string;
}

export const SignInResponseSchema = z.object({
  access_token: z.string().min(1),
  refresh_token: z.string().min(1),
  id: z.number().int(),
  role_id: z.number().int(),
  db_id: z.number().int(),
});
export type SignInResponse = z.infer<typeof SignInResponseSchema>;
