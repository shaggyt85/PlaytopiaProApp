import type { ChosenSport } from "@/shared/schemas/teacherProfile.schema";

/**
 * Elige o quita una especialidad de un deporte y devuelve la nueva lista, sin
 * tocar la de entrada. Sin especialidad (`null`), elige o quita el deporte
 * entero (uno del catálogo sin especialidades). Un deporte que se queda sin
 * ninguna deja de estar elegido.
 */
export function toggleSpecialty(
  chosen: readonly ChosenSport[],
  sportCode: string,
  specialtyCode: string | null,
): ChosenSport[] {
  const current = chosen.find((sport) => sport.code === sportCode);
  const others = chosen.filter((sport) => sport.code !== sportCode);

  if (specialtyCode === null) return current ? others : [...chosen, { code: sportCode, specialties: [] }];

  const specialties = current?.specialties.includes(specialtyCode)
    ? current.specialties.filter((code) => code !== specialtyCode)
    : [...(current?.specialties ?? []), specialtyCode];
  return specialties.length > 0 ? [...others, { code: sportCode, specialties }] : others;
}

/** ¿Está elegida? Sin especialidad, si lo está el deporte. */
export function isChosen(chosen: readonly ChosenSport[], sportCode: string, specialtyCode: string | null): boolean {
  const sport = chosen.find((s) => s.code === sportCode);
  return specialtyCode === null ? sport !== undefined : (sport?.specialties.includes(specialtyCode) ?? false);
}
