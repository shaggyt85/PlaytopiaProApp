import type { TranslationKey } from "@/shared/locales";

import type { WeeklyHours } from "../schemas/weeklyHours.schema";

import { daysWithHours } from "./daysWithHours";
import { bandsOf } from "./timeBands";

/** Las dos formas de configurar la semana, las de la app de alumnos. Un modo nuevo es una línea. */
export const AVAILABILITY_MODES = [
  { key: "bands", label: "profile.availability.modes.bands" },
  { key: "day", label: "profile.availability.modes.day" },
] as const satisfies readonly { key: string; label: TranslationKey }[];

export type AvailabilityMode = (typeof AVAILABILITY_MODES)[number]["key"];

/**
 * Con qué modo se abre una sede: si su semana son franjas (o está vacía), «Por
 * franja»; si son horas sueltas, «Por día», para que se vean marcadas.
 */
export function initialMode(week: WeeklyHours): AvailabilityMode {
  return daysWithHours(week).length === 0 || bandsOf(week).bands.length > 0 ? "bands" : "day";
}
