import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { dayjs } from "@/shared/config/dayjs";
import { useForegroundNow } from "@/shared/hooks/useForegroundNow";
import { scheduleQuery, scheduleService, type ScheduleReader } from "@/shared/services/scheduleService";
import { useSessionUserId } from "@/shared/store/sessionStore";

import { groupsFromAgenda } from "../utils/groupsFromAgenda";

/** Los días que se miran por delante: los 42 que Core da como mucho en una petición. */
const AHEAD_DAYS = 42;

/**
 * Los grupos del profesor (`groupsFromAgenda`), de su agenda desde hoy y las 6
 * semanas siguientes: la misma petición, el mismo contrato y la misma política
 * de caché (`LIVE`) que la agenda, y marcar una asistencia la invalida igual.
 * Un grupo sin ninguna clase en esas semanas (parado) no sale.
 *
 * «Hoy» y «ahora» son del servidor y se renuevan al volver a la app.
 */
export function useTeacherGroups(service: ScheduleReader = scheduleService) {
  const teacherId = useSessionUserId();
  const now = useForegroundNow();
  const today = dayjs(now).format("YYYY-MM-DD");
  const to = dayjs(now)
    .add(AHEAD_DAYS - 1, "day")
    .format("YYYY-MM-DD");
  const query = useQuery(scheduleQuery(teacherId, today, to, service));
  const groups = useMemo(() => (query.data ? groupsFromAgenda(query.data.classes, now) : []), [query.data, now]);

  return {
    groups,
    /** Ya llegó la agenda (aunque no tenga grupos). */
    hasData: query.data !== undefined,
    error: query.error,
    refetch: query.refetch,
  };
}
