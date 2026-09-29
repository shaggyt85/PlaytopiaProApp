import { queryOptions, skipToken } from "@tanstack/react-query";

import { CachePolicy } from "@/shared/config/cachePolicies";
import type { IHttpClient } from "@/shared/services/BaseHttpClient";
import { httpClient } from "@/shared/services/httpClient";

import { ScheduleResponseSchema, type ScheduleResponse } from "../schemas/schedule.schema";

import { SCHEDULE_ENDPOINTS } from "./scheduleEndpoints";

/**
 * Claves de caché de la agenda: con el id del profesor, para que otro en el
 * mismo móvil no vea la del anterior, y con el rango, porque cada vista (día,
 * semana, mes) pide el suyo.
 */
export const scheduleKeys = {
  all: ["schedule"] as const,
  classes: (teacherId: number | undefined, from: string, to: string) =>
    [...scheduleKeys.all, "classes", teacherId, from, to] as const,
};

/** El profesor sale del token. `from` y `to`, `YYYY-MM-DD`, incluidos. */
export interface IScheduleService {
  getClasses(from: string, to: string): Promise<ScheduleResponse>;
}

export class ScheduleService implements IScheduleService {
  constructor(private readonly http: IHttpClient) {}

  async getClasses(from: string, to: string): Promise<ScheduleResponse> {
    const data = await this.http.get<unknown>(SCHEDULE_ENDPOINTS.CLASSES, {
      params: { from, to },
    });
    return ScheduleResponseSchema.parse(data);
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
  service: IScheduleService = scheduleService,
) =>
  queryOptions({
    queryKey: scheduleKeys.classes(teacherId, from, to),
    queryFn: teacherId === undefined ? skipToken : () => service.getClasses(from, to),
    ...CachePolicy.LIVE,
  });
