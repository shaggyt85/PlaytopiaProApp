import { useQuery } from "@tanstack/react-query";

import { useSessionUserId } from "@/shared/store/sessionStore";

import type { ScheduleClass } from "../schemas/schedule.schema";
import { previousClassQuery, scheduleService, type IScheduleService } from "../services/scheduleService";

/**
 * La clase anterior del grupo de una clase, para su detalle. `null` mientras
 * llega, si no tiene (la primera del grupo o una clase suelta) o si falla: no
 * es lo principal del detalle, así que su sección simplemente no sale.
 */
export function usePreviousClass(
  dbId: number,
  classId: number,
  service: Pick<IScheduleService, "getPreviousClass"> = scheduleService,
): ScheduleClass | null {
  const teacherId = useSessionUserId();
  const { data } = useQuery(previousClassQuery(teacherId, dbId, classId, service));
  return data ?? null;
}
