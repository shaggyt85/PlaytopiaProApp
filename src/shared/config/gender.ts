import type { TranslationKey } from "@/shared/locales";

/** Género tal como lo guarda Core (`gender`): 0 no lo dice, 1 masculino, 2 femenino. */
export const GENDER = {
  NONE: 0,
  MALE: 1,
  FEMALE: 2,
} as const;

export type Gender = (typeof GENDER)[keyof typeof GENDER];

/** Opciones que se eligen con botón. "No lo dice" va aparte, como casilla. */
export const GENDER_OPTIONS: readonly { value: Gender; label: TranslationKey }[] = [
  { value: GENDER.MALE, label: "gender.male" },
  { value: GENDER.FEMALE, label: "gender.female" },
];
