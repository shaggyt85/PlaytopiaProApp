import type { CheckEmailResponse } from "../schemas/auth.schema";

/**
 * Adónde va el acceso después del email.
 *
 * - `password`: es profesor y tiene contraseña.
 * - `passwordSetup`: es profesor, pero su club le dio de alta desde el CRM y
 *   aún no tiene contraseña: va a la recuperación para crearla.
 * - `register`: no es profesor. Un email que solo es de alumno tampoco pasa a la
 *   contraseña: la cuenta de profesor es otra.
 */
export type SignInNextStep = "password" | "passwordSetup" | "register";

export function signInNextStep(
  result: Pick<CheckEmailResponse, "is_teacher" | "teacher_needs_password_setup">,
): SignInNextStep {
  if (!result.is_teacher) return "register";
  return result.teacher_needs_password_setup ? "passwordSetup" : "password";
}
