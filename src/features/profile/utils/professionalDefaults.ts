import type { TeacherProfile, TeacherSport } from "@/shared/schemas/teacherProfile.schema";

import type { ProfessionalForm } from "../schemas/professional.schema";

/**
 * El formulario relleno con lo guardado, **solo con lo que el catálogo aún
 * ofrece**: Core rechaza el guardado entero si va una especialidad que el Super
 * Admin desactivó. Un deporte que se queda sin ninguna de sus especialidades
 * elegidas no se envía.
 */
export function professionalDefaults(
  profile: Pick<TeacherProfile, "experience_years" | "description" | "sports">,
  catalog: readonly TeacherSport[],
): ProfessionalForm {
  const sports = profile.sports.flatMap((saved) => {
    const offered = catalog.find((sport) => sport.code === saved.code);
    if (!offered) return [];
    const specialties = saved.specialties
      .map((s) => s.code)
      .filter((code) => offered.specialties.some((s) => s.code === code));
    return offered.specialties.length > 0 && specialties.length === 0 ? [] : [{ code: saved.code, specialties }];
  });
  return {
    experienceYears: profile.experience_years,
    description: profile.description ?? "",
    sports,
  };
}
