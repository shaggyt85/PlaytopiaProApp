import { queryOptions, skipToken } from "@tanstack/react-query";

import { CachePolicy } from "@/shared/config/cachePolicies";
import { ENDPOINTS } from "@/shared/config/endpoints";
import type { IHttpClient } from "@/shared/services/BaseHttpClient";
import { httpClient } from "@/shared/services/httpClient";
import { scheduleKeys } from "@/shared/services/scheduleService";

import { GroupAttendanceResponseSchema, type StudentAttendance } from "../schemas/groupAttendance.schema";

/**
 * Claves de caché del historial de asistencia: una por grupo (escuela + grupo)
 * y profesor, no por clase. Cualquier clase del grupo da el mismo historial,
 * así que el detalle del grupo y todas sus fichas comparten una sola petición
 * aunque cambie su próxima clase.
 *
 * Cuelgan de `scheduleKeys.all`: pasar lista ya invalida esa raíz, así que el
 * historial se refresca sin que la asistencia sepa que existe.
 */
export const groupAttendanceKeys = {
  all: [...scheduleKeys.all, "group-attendance"] as const,
  of: (teacherId: number | undefined, dbId: number, groupId: number) =>
    [...groupAttendanceKeys.all, teacherId, dbId, groupId] as const,
};

/** El profesor sale del token. */
export interface IGroupAttendanceService {
  /**
   * El historial de los alumnos del grupo de `classId`, una clase suya. Vacío
   * si la clase no tiene grupo.
   */
  getGroupAttendance(dbId: number, classId: number): Promise<StudentAttendance[]>;
}

export class GroupAttendanceService implements IGroupAttendanceService {
  constructor(private readonly http: IHttpClient) {}

  async getGroupAttendance(dbId: number, classId: number): Promise<StudentAttendance[]> {
    const data = await this.http.get<unknown>(ENDPOINTS.MOBILE_TEACHER.GROUP_ATTENDANCE(dbId, classId));
    return GroupAttendanceResponseSchema.parse(data).students;
  }
}

export const groupAttendanceService: IGroupAttendanceService = new GroupAttendanceService(httpClient);

/** El grupo cuyo historial se pide, y una clase suya con la que pedirlo. */
export interface GroupAttendanceTarget {
  dbId: number;
  groupId: number;
  /** Una clase del grupo que da el profesor: su próxima. */
  classId: number;
}

/**
 * El historial de asistencia de un grupo. `STANDARD`: las marcas pasadas
 * cambian poco, y pasar lista lo invalida (cuelga de `scheduleKeys.all`). Sin
 * profesor en sesión no se pide nada (`skipToken`).
 */
export const groupAttendanceQuery = (
  teacherId: number | undefined,
  { dbId, groupId, classId }: GroupAttendanceTarget,
  service: IGroupAttendanceService = groupAttendanceService,
) =>
  queryOptions({
    queryKey: groupAttendanceKeys.of(teacherId, dbId, groupId),
    queryFn: teacherId === undefined ? skipToken : () => service.getGroupAttendance(dbId, classId),
    ...CachePolicy.STANDARD,
  });
