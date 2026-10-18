import type { TeacherProfile } from "@/shared/schemas/teacherProfile.schema";

import { TERMS_VERSION } from "../config/terms";

/** ¿Tiene aceptada la versión vigente? Si no, se le piden antes de seguir. */
export const hasCurrentTerms = (profile: Pick<TeacherProfile, "terms_version">): boolean =>
  profile.terms_version === TERMS_VERSION;
