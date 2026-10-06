import type { ComponentType } from "react";

import type { TranslationKey } from "@/shared/locales";
import type { TeacherProfile } from "@/shared/schemas/teacherProfile.schema";

import type { ProfileSection } from "../../store/profileEditorStore";
import { PersonalDataEditor } from "../PersonalDataEditor";
import { ProfessionalEditor } from "../ProfessionalEditor";

/** Lo que recibe cada editor: el perfil guardado y cómo cerrarse al terminar. */
export interface ProfileEditorProps {
  profile: TeacherProfile;
  onDone: () => void;
}

/**
 * Todo lo de cada sección, en una entrada: su título (el de su tarjeta), lo que
 * dice su «Editar» al lector de pantalla y su editor. Una sección nueva es una
 * entrada aquí: ni el panel ni el botón cambian (`satisfies` obliga a que cada
 * sección tenga lo suyo).
 */
export const PROFILE_EDITORS = {
  personal: { title: "profile.personal.title", editLabel: "profile.personal.edit", Editor: PersonalDataEditor },
  professional: {
    title: "profile.professional.title",
    editLabel: "profile.professional.edit",
    Editor: ProfessionalEditor,
  },
} as const satisfies Record<
  ProfileSection,
  { title: TranslationKey; editLabel: TranslationKey; Editor: ComponentType<ProfileEditorProps> }
>;
