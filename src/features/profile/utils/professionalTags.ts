import type { TeacherSport } from "@/shared/schemas/teacherProfile.schema";

/** Una etiqueta del perfil profesional: su clave y su nombre ya traducido por Core. */
export interface ProfessionalTag {
  key: string;
  label: string;
}

/**
 * Las etiquetas del perfil profesional, en el orden del catálogo: las
 * especialidades de cada deporte («Técnica», «Táctica») o, si de un deporte no
 * eligió ninguna, el deporte mismo, para que no desaparezca.
 */
export function professionalTags(sports: readonly TeacherSport[]): ProfessionalTag[] {
  return sports.flatMap((sport) =>
    sport.specialties.length > 0
      ? sport.specialties.map((specialty) => ({ key: `${sport.code}:${specialty.code}`, label: specialty.name }))
      : [{ key: sport.code, label: sport.name }],
  );
}
