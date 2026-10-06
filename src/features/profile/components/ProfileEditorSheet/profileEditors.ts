import type { ComponentType } from "react";

import type { TranslationKey } from "@/shared/locales";
import type { TeacherProfile } from "@/shared/schemas/teacherProfile.schema";

import type { ProfileSection } from "../../store/profileEditorStore";
import { AvailabilityEditor } from "../AvailabilityEditor";
import { DeleteAccountEditor } from "../DeleteAccountEditor";
import { PersonalDataEditor } from "../PersonalDataEditor";
import { ProfessionalEditor } from "../ProfessionalEditor";

/** Lo que recibe cada editor: el perfil guardado y cómo cerrarse al terminar. */
export interface ProfileEditorProps {
  profile: TeacherProfile;
  onDone: () => void;
}

/**
 * Lo que el panel necesita de cada sección: su título y su editor. Una sección
 * nueva es una entrada aquí: el panel no cambia (`satisfies` obliga a que cada
 * sección tenga lo suyo). Lo que dice cada «Editar», aparte (`EDIT_LABELS`):
 * la baja no tiene.
 */
export const PROFILE_EDITORS = {
  personal: { title: "profile.personal.title", Editor: PersonalDataEditor },
  professional: { title: "profile.professional.title", Editor: ProfessionalEditor },
  availability: { title: "profile.availability.title", Editor: AvailabilityEditor },
  deleteAccount: { title: "profile.deleteAccount.title", Editor: DeleteAccountEditor },
} as const satisfies Record<ProfileSection, { title: TranslationKey; Editor: ComponentType<ProfileEditorProps> }>;
