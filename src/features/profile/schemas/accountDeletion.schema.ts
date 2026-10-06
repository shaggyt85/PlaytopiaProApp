import { z } from "zod";

import { message } from "@/shared/schemas/validationMessage";

/** El motivo de la baja, entre estos caracteres: los mismos que valida Core (`REASON_MIN_LEN`, `REASON_MAX_LEN`). */
export const REASON_MIN_LENGTH = 10;
export const REASON_MAX_LENGTH = 1000;

/** El formulario de la baja: solo el motivo, sin los espacios de los lados. */
export const DeleteAccountFormSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(REASON_MIN_LENGTH, message("validation.reasonMin"))
    .max(REASON_MAX_LENGTH, message("validation.reasonMax")),
});
export type DeleteAccountForm = z.infer<typeof DeleteAccountFormSchema>;

/**
 * Lo que responde Core a la baja de un profesor (`POST /Mobile/Account/Delete`).
 * Su `message` viene redactado en español y no se usa: el aviso sale de los
 * textos de la app con `anonymize_after_days`.
 */
export const AccountDeletionSchema = z.object({
  summary: z.object({
    /** Escuelas de las que salió. */
    schools_count: z.number().int(),
    /** Sedes de las que salió. */
    clubs_count: z.number().int(),
    /** Sus sesiones sin empezar que se quedaron sin profesor. */
    unassigned_sessions: z.number().int(),
  }),
  /** Días hasta que se borren sus datos personales; hasta entonces, soporte puede recuperarla. */
  anonymize_after_days: z.number().int(),
});
export type AccountDeletion = z.infer<typeof AccountDeletionSchema>;
