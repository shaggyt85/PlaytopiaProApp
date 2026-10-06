import type { ComponentType } from "react";

import type { TranslationKey } from "@/shared/locales";
import type { TeacherProfile } from "@/shared/schemas/teacherProfile.schema";

import type { ProfileSection } from "../../store/profileEditorStore";
import { PersonalDataEditor } from "../PersonalDataEditor";

/** Lo que recibe cada editor: el perfil guardado y cómo cerrarse al terminar. */
export interface ProfileEditorProps {
  profile: TeacherProfile;
  onDone: () => void;
}

/**
 * Qué editor abre cada sección, con su título (el mismo de su tarjeta). Un
 * editor nuevo es una entrada aquí: el panel no cambia (`satisfies` obliga a
 * que cada sección tenga el suyo).
 */
export const PROFILE_EDITORS = {
  personal: { title: "profile.personal.title", Editor: PersonalDataEditor },
} as const satisfies Record<ProfileSection, { title: TranslationKey; Editor: ComponentType<ProfileEditorProps> }>;
