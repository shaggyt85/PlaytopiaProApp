import type { ScheduleClass } from "../schemas/schedule.schema";

/** Las plazas de una clase como las pinta el prototipo: «3/4». */
export const seatsLabel = ({
  current_participants,
  max_participants,
}: Pick<ScheduleClass, "current_participants" | "max_participants">): string =>
  `${current_participants}/${max_participants}`;
