import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { useSessionUserId } from "@/shared/store/sessionStore";

import type { ScheduleClass, ScheduleResponse } from "../schemas/schedule.schema";
import { monthScheduleQuery, scheduleService, type ScheduleReader } from "../services/scheduleService";
import { classesByDate } from "../utils/classesByDate";

/** Un día sin clases: siempre la misma lista, para que `memo` no vea un cambio. */
const NO_CLASSES: readonly ScheduleClass[] = [];
/** Sin datos todavía: siempre el mismo `Map` vacío. */
const NO_DAYS: ReadonlyMap<string, readonly ScheduleClass[]> = new Map();

// Fuera del hook: TanStack solo vuelve a agrupar si cambia la respuesta.
const selectByDate = (data: ScheduleResponse) => classesByDate(data.classes);

/**
 * Las clases del día `date` (`YYYY-MM-DD`). Pide la cuadrícula de su mes entera
 * (`monthScheduleQuery`): cambiar de día dentro del mes no vuelve a pedir nada,
 * y la vista Mes usará la misma respuesta. La próxima clase no sale de aquí:
 * la da `useNextClass`, siempre con el mes de hoy.
 *
 * Solo lo que pinta la vista, leído propiedad a propiedad: copiar la query
 * entera haría que TanStack avisara de cualquier cambio.
 */
export function useScheduleMonth(date: string, service: ScheduleReader = scheduleService) {
  const teacherId = useSessionUserId();
  const recipe = useMemo(() => monthScheduleQuery(teacherId, date, service), [teacherId, date, service]);
  const query = useQuery({ ...recipe, select: selectByDate });

  return {
    dayClasses: query.data?.get(date) ?? NO_CLASSES,
    /** Las clases de cada día de la cuadrícula: la semana lee de aquí sus 7 días. */
    byDate: query.data ?? NO_DAYS,
    /** Ya hay datos que pintar (aunque falle una recarga). */
    hasData: query.data !== undefined,
    isPending: query.isPending,
    error: query.error,
    refetch: query.refetch,
  };
}
