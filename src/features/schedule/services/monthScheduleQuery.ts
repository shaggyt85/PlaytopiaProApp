import { scheduleQuery, scheduleService, type ScheduleReader } from "@/shared/services/scheduleService";

import { monthGrid } from "../utils/scheduleDates";

/**
 * La agenda del mes de `date`: la cuadrícula de 42 días (`monthGrid`). La usan
 * la vista Día (el mes del día que se ve), la próxima clase (el mes de hoy) y
 * el detalle de una clase: cuando coinciden, es la misma caché.
 */
export const monthScheduleQuery = (
  teacherId: number | undefined,
  date: string,
  service: ScheduleReader = scheduleService,
) => {
  const { from, to } = monthGrid(date);
  return scheduleQuery(teacherId, from, to, service);
};
