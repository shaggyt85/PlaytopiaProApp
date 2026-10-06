import type { t as translate } from "@/shared/config/i18n";

/**
 * La línea bajo el nombre del profesor: su rol y, si los dijo, sus años de
 * experiencia («Entrenador · 6 años de experiencia»). Sin el dato, solo el rol:
 * nada de «0 años» ni un hueco. Con 0, «menos de un año». La misma para todos,
 * sin mirar el género.
 */
export function roleLine(years: number | null, t: typeof translate): string {
  return years === null ? t("profile.role") : t("profile.roleWithExperience", { count: years });
}
