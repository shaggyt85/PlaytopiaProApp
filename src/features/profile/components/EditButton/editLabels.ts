import type { TranslationKey } from "@/shared/locales";

import type { EditableSection } from "../../store/profileEditorStore";

/** Lo que dice al lector de pantalla el «Editar» de cada tarjeta. */
export const EDIT_LABELS = {
  personal: "profile.personal.edit",
  professional: "profile.professional.edit",
  availability: "profile.availability.edit",
} as const satisfies Record<EditableSection, TranslationKey>;
