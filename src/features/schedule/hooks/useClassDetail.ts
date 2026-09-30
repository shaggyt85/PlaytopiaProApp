import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";

import { useSessionUserId } from "@/shared/store/sessionStore";

import type { ScheduleResponse } from "../schemas/schedule.schema";
import { monthScheduleQuery, scheduleService, type IScheduleService } from "../services/scheduleService";

/**
 * Una clase para su detalle, de la misma caché del mes que la agenda
 * (`monthScheduleQuery(date)`): al venir de la agenda se abre al instante, sin
 * pedir nada; si esa caché no está, se pide ese mes.
 *
 * `item` es `null` si la respuesta no la trae (el club la ha borrado o movida):
 * la pantalla dice «Clase no encontrada». El `select` solo cambia si cambian la
 * escuela o la clase, así TanStack no la vuelve a buscar en cada pintado.
 */
export function useClassDetail(
  dbId: number,
  classId: number,
  date: string,
  service: IScheduleService = scheduleService,
) {
  const teacherId = useSessionUserId();
  const recipe = useMemo(() => monthScheduleQuery(teacherId, date, service), [teacherId, date, service]);
  const selectClass = useCallback(
    (data: ScheduleResponse) => data.classes.find((c) => c.db_id === dbId && c.id === classId) ?? null,
    [dbId, classId],
  );
  const query = useQuery({ ...recipe, select: selectClass });

  return {
    item: query.data ?? null,
    /** Ya llegó la respuesta del mes (aunque no traiga la clase). */
    hasData: query.data !== undefined,
    error: query.error,
    refetch: query.refetch,
  };
}
