import { z } from "zod";

import { joinPhone } from "@/shared/components/PhoneInput";
import { GENDER } from "@/shared/config/gender";
import type { TranslationKey } from "@/shared/locales";

// Los datos personales del profesor: las mismas reglas al darse de alta y al
// editarlos en Perfil. Se escriben una vez aquí; cada formulario las usa o las
// extiende.

// Los mensajes de validación son claves de i18n tipadas: una clave que no
// existe no compila. El formulario las traduce al mostrarlas (`useFieldErrorText`).
export const message = (key: TranslationKey) => ({ error: key });

/** Email de cualquier formulario (acceso, registro, recuperación y Perfil). */
export const EmailSchema = z
  .string(message("validation.emailRequired"))
  .trim()
  .min(1, message("validation.emailRequired"))
  .pipe(z.email(message("validation.emailInvalid")));

/** El número sin prefijo: el prefijo sale del país elegido. */
const PhoneSchema = z
  .string()
  .regex(/^\d*$/, message("validation.phoneNumbersOnly"))
  .min(9, message("validation.phoneMin"))
  .max(15, message("validation.phoneMax"));

/** Única fuente de las reglas de los datos personales. */
export const PersonalDataFormSchema = z.object({
  firstName: z.string().trim().min(2, message("validation.firstNameMin")),
  lastName: z.string().trim().min(2, message("validation.lastNameMin")),
  email: EmailSchema,
  country: z.string().length(2),
  phone: PhoneSchema,
  /** Fecha de calendario "YYYY-MM-DD"; vacía si no la dice (en Perfil es opcional). */
  birthday: z.string(),
  gender: z.union([z.literal(GENDER.NONE), z.literal(GENDER.MALE), z.literal(GENDER.FEMALE)]),
});

/** Lo que se escribe en el formulario (antes de validar). */
export type PersonalDataFormInput = z.input<typeof PersonalDataFormSchema>;
/** El formulario ya validado. */
export type PersonalDataForm = z.output<typeof PersonalDataFormSchema>;

/** Los datos personales como los espera Core (`POST` y `PATCH /api/UserTeacher`). */
export interface PersonalDataRequest {
  name: string;
  last_name: string;
  email: string;
  phone_number: string;
  /** `NaiveDateTime` de Core: la fecha con hora 00:00:00. Sin fecha, no se envía. */
  birthday?: string;
  gender: number;
}

/** Del formulario validado al cuerpo de Core: el alta y Perfil, la misma conversión. */
export function toPersonalDataRequest(form: PersonalDataForm): PersonalDataRequest {
  return {
    name: form.firstName,
    last_name: form.lastName,
    email: form.email,
    phone_number: joinPhone(form.country, form.phone),
    ...(form.birthday ? { birthday: `${form.birthday}T00:00:00` } : {}),
    gender: form.gender,
  };
}
