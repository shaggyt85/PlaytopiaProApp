import { queryOptions, skipToken } from "@tanstack/react-query";

import { CachePolicy } from "@/shared/config/cachePolicies";
import { ENDPOINTS } from "@/shared/config/endpoints";
import {
  AttendanceMarkSchema,
  PreviousClassResponseSchema,
  ScheduleResponseSchema,
  type AttendanceMark,
  type AttendanceStatus,
  type ScheduleClass,
  type ScheduleResponse,
} from "@/shared/schemas/schedule.schema";
import type { IHttpClient } from "@/shared/services/BaseHttpClient";
import { httpClient } from "@/shared/services/httpClient";

/**
 * Claves de caché de la agenda: con el id del profesor, para que otro en el
 * mismo móvil no vea la del anterior, y con el rango, porque cada vista (día,
 * semana, mes) pide el suyo. Todo cuelga de `all` (marcar la asistencia lo
 * invalida todo); las agendas (`ScheduleResponse`) cuelgan además de `agendas`
 * y las clases anteriores (una clase o `null`) de `previousClasses`: cada forma
 * por su lado, para poner en cada una la marca al instante.
 */
export const scheduleKeys = {
  all: ["schedule"] as const,
  agendas: ["schedule", "classes"] as const,
  previousClasses: ["schedule", "previous"] as const,
  classes: (teacherId: number | undefined, from: string, to: string) =>
    [...scheduleKeys.agendas, teacherId, from, to] as const,
  previous: (teacherId: number | undefined, dbId: number, classId: number) =>
    [...scheduleKeys.previousClasses, teacherId, dbId, classId] as const,
};

/** A quién se marca: la escuela, la clase del alumno (su plaza, si recupera) y el alumno. */
export interface AttendanceTarget {
  dbId: number;
  classId: number;
  studentId: number;
}

/** El profesor sale del token. */
export interface IScheduleService {
  /** Las clases entre `from` y `to` (`YYYY-MM-DD`, incluidos) y la próxima. */
  getClasses(from: string, to: string): Promise<ScheduleResponse>;
  /** Marca si un alumno vino. Marcar lo mismo otra vez devuelve la marca que había. */
  markAttendance(target: AttendanceTarget, status: AttendanceStatus): Promise<AttendanceMark>;
  /** La clase anterior del grupo de una clase suya, o `null` si no tiene. */
  getPreviousClass(dbId: number, classId: number): Promise<ScheduleClass | null>;
}

/** Lo único que necesitan las consultas de la agenda: leer las clases. */
export type ScheduleReader = Pick<IScheduleService, "getClasses">;

export class ScheduleService implements IScheduleService {
  constructor(private readonly http: IHttpClient) {}

  async getClasses(from: string, to: string): Promise<ScheduleResponse> {
    return this.http.get(ENDPOINTS.MOBILE_TEACHER.CLASSES, ScheduleResponseSchema, {
      params: { from, to },
    });
  }

  async markAttendance(
    { dbId, classId, studentId }: AttendanceTarget,
    status: AttendanceStatus,
  ): Promise<AttendanceMark> {
    return this.http.put(ENDPOINTS.MOBILE_TEACHER.ATTENDANCE(dbId, classId, studentId), { status }, AttendanceMarkSchema);
  }

  async getPreviousClass(dbId: number, classId: number): Promise<ScheduleClass | null> {
    const { previous_class } = await this.http.get(ENDPOINTS.MOBILE_TEACHER.PREVIOUS(dbId, classId), PreviousClassResponseSchema);
    return previous_class;
  }
}

export const scheduleService: IScheduleService = new ScheduleService(httpClient);

/**
 * Las clases de un rango. `LIVE`: las plazas («3/4») cambian cuando un alumno se
 * apunta o se da de baja, y el club puede mover una clase; así se vuelve a
 * preguntar al volver a la app. Pedirla a menudo cuesta poco: en Core la sirve
 * su caché. Sin profesor en sesión no se pide nada (`skipToken`).
 */
export const scheduleQuery = (
  teacherId: number | undefined,
  from: string,
  to: string,
  service: ScheduleReader = scheduleService,
) =>
  queryOptions({
    queryKey: scheduleKeys.classes(teacherId, from, to),
    queryFn: teacherId === undefined ? skipToken : () => service.getClasses(from, to),
    ...CachePolicy.LIVE,
  });

/**
 * La clase anterior del grupo de una clase. `STANDARD`: una clase que ya pasó
 * cambia poco; marcar la asistencia la invalida (cuelga de `scheduleKeys.all`).
 * Sin profesor en sesión no se pide nada (`skipToken`).
 */
export const previousClassQuery = (
  teacherId: number | undefined,
  dbId: number,
  classId: number,
  service: Pick<IScheduleService, "getPreviousClass"> = scheduleService,
) =>
  queryOptions({
    queryKey: scheduleKeys.previous(teacherId, dbId, classId),
    queryFn: teacherId === undefined ? skipToken : () => service.getPreviousClass(dbId, classId),
    ...CachePolicy.STANDARD,
  });
