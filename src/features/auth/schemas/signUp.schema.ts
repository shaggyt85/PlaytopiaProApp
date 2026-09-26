import { z } from "zod";

import { callingCodeOf } from "@/shared/components/PhoneInput";
import { GENDER } from "@/shared/config/gender";

import { EmailSchema, message } from "./auth.schema";

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

/** El número sin prefijo: el prefijo sale del país elegido. */
const PhoneSchema = z
  .string()
  .regex(/^\d*$/, message("validation.phoneNumbersOnly"))
  .min(9, message("validation.phoneMin"))
  .max(15, message("validation.phoneMax"));

/** Única fuente de las reglas del formulario de registro. */
export const SignUpFormSchema = z
  .object({
    firstName: z.string().trim().min(2, message("validation.firstNameMin")),
    lastName: z.string().trim().min(2, message("validation.lastNameMin")),
    email: EmailSchema,
    country: z.string().length(2),
    phone: PhoneSchema,
    /** Fecha de calendario "YYYY-MM-DD". */
    birthday: z.string().min(1, message("validation.birthdayRequired")),
    gender: z.union([z.literal(GENDER.NONE), z.literal(GENDER.MALE), z.literal(GENDER.FEMALE)]),
    password: PasswordSchema,
    confirmPassword: z.string().min(1, message("validation.confirmPasswordRequired")),
    acceptedTerms: z.boolean().refine((accepted) => accepted, message("validation.acceptTerms")),
  })
  .refine((form) => form.password === form.confirmPassword, {
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
export interface SignUpRequest {
  name: string;
  last_name: string;
  email: string;
  password: string;
  phone_number: string;
  /** `NaiveDateTime` de Core: la fecha con hora 00:00:00. */
  birthday: string;
  gender: number;
  terms_version: string;
}

/** Respuesta 201. Trae tokens, pero tras el alta el profesor inicia sesión. */
export const SignUpResponseSchema = z.object({
  id: z.number().int(),
  email: z.string(),
});
export type SignUpResponse = z.infer<typeof SignUpResponseSchema>;

/** Del formulario validado al cuerpo que espera Core. */
export function toSignUpRequest(form: SignUpForm): SignUpRequest {
  return {
    name: form.firstName,
    last_name: form.lastName,
    email: form.email,
    password: form.password,
    phone_number: `+${callingCodeOf(form.country)}${form.phone}`,
    birthday: `${form.birthday}T00:00:00`,
    gender: form.gender,
    terms_version: TERMS_VERSION,
  };
}
