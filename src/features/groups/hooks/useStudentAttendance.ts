import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

import { useSessionUserId } from "@/shared/store/sessionStore";

import type { StudentAttendance } from "../schemas/groupAttendance.schema";
import {
  groupAttendanceQuery,
  groupAttendanceService,
  type GroupAttendanceTarget,
  type IGroupAttendanceService,
} from "../services/groupAttendanceService";

/**
 * El historial de asistencia de un alumno en su grupo, para su ficha: de la
 * consulta del grupo entero (una sola petición para todas las fichas del grupo),
 * con un `select` que se queda con el suyo. `attendance` es `null` mientras
 * llega, si falla o si el alumno aún no tiene ninguna marca en el grupo.
 */
export function useStudentAttendance(
  target: GroupAttendanceTarget,
  studentId: number,
  service: IGroupAttendanceService = groupAttendanceService,
) {
  const teacherId = useSessionUserId();
  const select = useCallback(
    (students: StudentAttendance[]) => students.find((s) => s.student_id === studentId) ?? null,
    [studentId],
  );
  const query = useQuery({ ...groupAttendanceQuery(teacherId, target, service), select });
  return { attendance: query.data ?? null, error: query.error };
}
