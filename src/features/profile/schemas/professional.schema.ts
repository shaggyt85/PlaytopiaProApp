import { z } from "zod";

import type { ChosenSport, ProfessionalRequest } from "@/shared/schemas/teacherProfile.schema";
import { message } from "@/shared/schemas/validationMessage";

/** Los años de experiencia, de 0 a este tope: el mismo que valida Core (`EXPERIENCE_YEARS_MAX`). */
export const EXPERIENCE_YEARS_MAX = 60;
/** La presentación, hasta estos caracteres: el mismo tope que Core (`DESCRIPTION_MAX_LEN`). */
export const DESCRIPTION_MAX_LENGTH = 500;

const ChosenSportSchema = z.object({ code: z.string(), specialties: z.array(z.string()) }) satisfies z.ZodType<ChosenSport>;

/**
 * El formulario del perfil profesional. Sin mínimo de deportes: Core acepta la
 * lista vacía (se los quita), y puede que aún no quiera elegir.
 */
export const ProfessionalFormSchema = z.object({
  /** `null` si no lo ha dicho: no se muestra un 0 que no eligió. */
  experienceYears: z.number().int().min(0).max(EXPERIENCE_YEARS_MAX).nullable(),
  description: z.string().max(DESCRIPTION_MAX_LENGTH, message("validation.descriptionMax")),
  sports: z.array(ChosenSportSchema),
});
export type ProfessionalForm = z.infer<typeof ProfessionalFormSchema>;

/** Del formulario al cuerpo de Core. Una presentación vacía se borra (`null`). */
export function toProfessionalRequest(form: ProfessionalForm): ProfessionalRequest {
  return {
    description: form.description.trim() || null,
    experience_years: form.experienceYears,
    sports: form.sports,
  };
}
