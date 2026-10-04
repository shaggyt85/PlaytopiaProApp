import type { t as translate } from "@/shared/config/i18n";

import type { ScheduleClass } from "../schemas/schedule.schema";

type Seats = Pick<ScheduleClass, "current_participants" | "max_participants">;

/** Las plazas de una clase a secas, «3/4»: donde ya pone «Alumnos» encima (la cabecera del detalle). */
export const seatsLabel = ({ current_participants, max_participants }: Seats): string =>
  `${current_participants}/${max_participants}`;

/**
 * Las plazas con lo que son, «3/4 alumnos»: el número solo no dice nada. Lo usan
 * la tarjeta de arriba, la vista Día, la Semana y el Mes.
 */
export const studentsLabel = ({ current_participants, max_participants }: Seats, t: typeof translate): string =>
  t("schedule.next.students", { taken: current_participants, max: max_participants });
