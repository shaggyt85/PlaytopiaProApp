import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { useSessionUserId } from "@/shared/store/sessionStore";

import type { ScheduleClass, ScheduleResponse } from "../schemas/schedule.schema";
import { scheduleQuery, scheduleService, type IScheduleService } from "../services/scheduleService";
import { classesByDate } from "../utils/classesByDate";
import { monthGrid } from "../utils/scheduleDates";

/** Un día sin clases: siempre la misma lista, para que `memo` no vea un cambio. */
const NO_CLASSES: readonly ScheduleClass[] = [];

// Fuera del hook: TanStack solo vuelve a agrupar si cambia la respuesta.
const selectByDate = (data: ScheduleResponse) => ({
  byDate: classesByDate(data.classes),
  nextClass: data.next_class,
});

/**
 * La agenda del día `date` (`YYYY-MM-DD`). Pide la cuadrícula de su mes entera
 * (`monthGrid`): cambiar de día dentro del mes no vuelve a pedir nada, y la vista
 * Mes usará la misma respuesta.
 *
 * Solo lo que pinta la vista, leído propiedad a propiedad: copiar la query
 * entera haría que TanStack avisara de cualquier cambio.
 */
export function useScheduleMonth(date: string, service: IScheduleService = scheduleService) {
  const teacherId = useSessionUserId();
  const { from, to } = useMemo(() => monthGrid(date), [date]);
  const query = useQuery({ ...scheduleQuery(teacherId, from, to, service), select: selectByDate });

  return {
    dayClasses: query.data?.byDate.get(date) ?? NO_CLASSES,
    nextClass: query.data?.nextClass ?? null,
    /** Ya hay datos que pintar (aunque falle una recarga). */
    hasData: query.data !== undefined,
    isPending: query.isPending,
    error: query.error,
    refetch: query.refetch,
  };
}
