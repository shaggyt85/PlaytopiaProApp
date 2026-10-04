import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";

import { useSessionUserId } from "@/shared/store/sessionStore";

import type { ScheduleResponse } from "../schemas/schedule.schema";
import { monthScheduleQuery, scheduleService, type ScheduleReader } from "../services/scheduleService";

// Fuera del hook: TanStack solo lo vuelve a leer si cambia la respuesta.
const selectNextClass = (data: ScheduleResponse) => data.next_class;

/**
 * La próxima clase del profesor según Core (`next_class`), la única fuente de
 * cuál es: la usan su tarjeta y la marca «PRÓXIMA» de la tira. Sale de la
 * respuesta del mes de hoy (Core la calcula desde ahora, sea cual sea el rango),
 * así no cambia al moverse de día con las flechas.
 *
 * `now` es el reloj de la pantalla (cada minuto): en cuanto la clase empieza se
 * vuelve a pedir la agenda, y Core da la siguiente.
 */
export function useNextClass(today: string, now: number, service: ScheduleReader = scheduleService) {
  const teacherId = useSessionUserId();
  const recipe = useMemo(() => monthScheduleQuery(teacherId, today, service), [teacherId, today, service]);
  const { data, refetch } = useQuery({ ...recipe, select: selectNextClass });

  const startsAt = data ? Date.parse(data.starts_at) : undefined;
  const started = startsAt !== undefined && now >= startsAt;
  useEffect(() => {
    if (started) void refetch();
  }, [started, now, refetch]);

  return data ?? null;
}
