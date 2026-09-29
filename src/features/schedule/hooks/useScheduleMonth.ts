import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { useSessionUserId } from "@/shared/store/sessionStore";

import { scheduleQuery, scheduleService, type IScheduleService } from "../services/scheduleService";
import { monthGrid } from "../utils/scheduleDates";

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
  const query = useQuery(scheduleQuery(teacherId, from, to, service));

  // Core las manda por fecha y hora: basta con quedarse con las del día.
  const dayClasses = useMemo(
    () => (query.data?.classes ?? []).filter((c) => c.class_date === date),
    [query.data, date],
  );

  return {
    dayClasses,
    nextClass: query.data?.next_class ?? null,
    isPending: query.isPending,
    error: query.error,
    refetch: query.refetch,
  };
}
