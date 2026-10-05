import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import { useSessionUserId } from "@/shared/store/sessionStore";

import {
  groupAttendanceQuery,
  groupAttendanceService,
  type GroupAttendanceTarget,
  type IGroupAttendanceService,
} from "../services/groupAttendanceService";

/**
 * Pide de antemano el historial de asistencia del grupo, para que las fichas de
 * sus alumnos se abran ya con él: la misma consulta y la misma clave que la
 * ficha (`useStudentAttendance`). No repinta quien la usa.
 *
 * `prefetchQuery` y no `usePrefetchQuery`: este último no vuelve a pedir si ya
 * hay algo en caché, aunque esté viejo; `prefetchQuery` respeta el `staleTime`
 * de la consulta (`STANDARD`). Sin profesor en sesión no se pide nada.
 */
export function usePrefetchGroupAttendance(
  { dbId, groupId, classId }: GroupAttendanceTarget,
  service: IGroupAttendanceService = groupAttendanceService,
) {
  const client = useQueryClient();
  const teacherId = useSessionUserId();

  useEffect(() => {
    if (teacherId === undefined) return;
    void client.prefetchQuery(groupAttendanceQuery(teacherId, { dbId, groupId, classId }, service));
  }, [client, teacherId, dbId, groupId, classId, service]);
}
