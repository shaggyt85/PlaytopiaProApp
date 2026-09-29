import type { t as translate } from "@/shared/config/i18n";
import { formatClubTime } from "@/shared/utils/formatDate";
import { joinParts } from "@/shared/utils/joinParts";

import type { ScheduleClass } from "../schemas/schedule.schema";

import type { ClassStatus } from "./classTiming";

/** El texto que anuncia el lector de pantalla por cada estado; «por venir» no dice nada. */
const STATUS_KEY = {
  past: "schedule.day.a11y.past",
  live: "schedule.day.a11y.live",
  next: "schedule.day.a11y.next",
} as const;

/**
 * Lo que el lector de pantalla dice de una tarjeta de la agenda, entero y de una
 * vez: «Cantera Tarde, 16:00, 75 minutos, Pista 1, Sede Centro, 3 de 4 plazas,
 * próxima clase». Lo que falta (sin pista, sede sin nombre) no se dice.
 */
export function classA11yLabel(
  c: ScheduleClass,
  clubLabel: string,
  status: ClassStatus,
  t: typeof translate,
): string {
  return joinParts(
    [
      c.title,
      formatClubTime(c.class_time),
      t("schedule.day.a11y.duration", { count: c.duration_minutes }),
      c.track_name,
      clubLabel,
      t("schedule.day.a11y.seats", { taken: c.current_participants, max: c.max_participants }),
      status === "upcoming" ? "" : t(STATUS_KEY[status]),
    ],
    ", ",
  );
}
