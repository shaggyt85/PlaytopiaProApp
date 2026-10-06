import { z } from "zod";

import { GENDER } from "@/shared/config/gender";
import {
  PersonalDataFormSchema,
  message,
  toPersonalDataRequest,
  type PersonalDataRequest,
} from "@/shared/schemas/personalData.schema";

/**
 * Versión vigente de los términos y condiciones, la que se acepta al
 * registrarse o, tras el login, en el modal de términos. Se envía a Core como
 * evidencia de consentimiento (GDPR). Súbela cuando cambien materialmente los
 * términos: a quien tenga otra, la app se los vuelve a pedir.
 */
export const TERMS_VERSION = "2026-07-01";

// ── Formulario ────────────────────────────────────────────────────────────

/** Contraseña con los requisitos de la app de alumnos. */
const PasswordSchema = z
  .string()
  .min(8, message("validation.passwordMin"))
  .max(50, message("validation.passwordMax"))
  .regex(/[A-Z]/, message("validation.passwordUppercase"))
  .regex(/[a-z]/, message("validation.passwordLowercase"))
  .regex(/[0-9]/, message("validation.passwordNumber"))
  .regex(/[!@#$%^&*(),.?":{}|<>]/, message("validation.passwordSpecialChar"))
  .refine((value) => !/\s/.test(value), message("validation.passwordNoSpaces"));

/**
 * El formulario de registro: los datos personales (las mismas reglas que en
 * Perfil, `PersonalDataFormSchema`), con la fecha de nacimiento obligatoria, y
 * la contraseña y los términos.
 */
export const SignUpFormSchema = PersonalDataFormSchema.extend({
  birthday: z.string().min(1, message("validation.birthdayRequired")),
  password: PasswordSchema,
  confirmPassword: z.string().min(1, message("validation.confirmPasswordRequired")),
  acceptedTerms: z.boolean().refine((accepted) => accepted, message("validation.acceptTerms")),
}).refine((form) => form.password === form.confirmPassword, {
  ...message("validation.passwordsDontMatch"),
  path: ["confirmPassword"],
});

/** Lo que se escribe en el formulario (antes de validar). */
export type SignUpFormInput = z.input<typeof SignUpFormSchema>;
/** El formulario ya validado. */
export type SignUpForm = z.output<typeof SignUpFormSchema>;

export const SIGN_UP_DEFAULTS: SignUpFormInput = {
  firstName: "",
  lastName: "",
  email: "",
  country: "ES",
  phone: "",
  birthday: "",
  gender: GENDER.NONE,
  password: "",
  confirmPassword: "",
  acceptedTerms: false,
};

// ── Contrato de Core (Scalar) ─────────────────────────────────────────────

/** POST /api/UserTeacher sin el `registration_token`, que firma el servicio. */
export interface SignUpRequest extends PersonalDataRequest {
  password: string;
  terms_version: string;
}

/** Respuesta 201. Trae tokens, pero tras el alta el profesor inicia sesión. */
export const SignUpResponseSchema = z.object({
  id: z.number().int(),
  email: z.string(),
});
export type SignUpResponse = z.infer<typeof SignUpResponseSchema>;

/** Del formulario validado al cuerpo que espera Core: los datos personales, como en Perfil, y la contraseña. */
export function toSignUpRequest(form: SignUpForm): SignUpRequest {
  return { ...toPersonalDataRequest(form), password: form.password, terms_version: TERMS_VERSION };
}
