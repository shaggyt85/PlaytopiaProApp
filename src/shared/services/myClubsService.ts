import { queryOptions, skipToken } from "@tanstack/react-query";

import { CachePolicy } from "@/shared/config/cachePolicies";
import { MyClubsResponseSchema, type MyClubsResponse } from "@/shared/schemas/schoolCard.schema";

import type { IHttpClient } from "./BaseHttpClient";
import { httpClient } from "./httpClient";

/** Ruta de Core de «Mis clubes» (Scalar, grupo Mobile Teacher). */
export const MY_CLUBS_ENDPOINTS = {
  /** Las sedes donde trabaja el profesor del token. */
  CLUBS: "/MobileTeacher/clubs",
} as const;

/**
 * Claves de caché de «Mis clubes»: siempre con el id del profesor, para que
 * otro en el mismo móvil no vea la del anterior.
 */
export const myClubsKeys = {
  all: ["my-clubs"] as const,
  of: (teacherId: number | undefined) => [...myClubsKeys.all, teacherId] as const,
};

/**
 * Las sedes donde trabaja el profesor. Las usan «Red de clubes» (la lista) y la
 * agenda (nombre y color de cada club): un solo sitio para el endpoint.
 */
export interface IMyClubsService {
  getMyClubs(): Promise<MyClubsResponse>;
}

export class MyClubsService implements IMyClubsService {
  constructor(private readonly http: IHttpClient) {}

  async getMyClubs(): Promise<MyClubsResponse> {
    return MyClubsResponseSchema.parse(await this.http.get<unknown>(MY_CLUBS_ENDPOINTS.CLUBS));
  }
}

export const myClubsService: IMyClubsService = new MyClubsService(httpClient);

/**
 * La receta de «Mis clubes»: clave, cómo se pide y su caché. Cambia cuando un
 * club le da de alta o de baja: `STANDARD`. Sin profesor no se pide nada
 * (`skipToken`).
 */
export const myClubsQuery = (
  teacherId: number | undefined,
  service: IMyClubsService = myClubsService,
) =>
  queryOptions({
    queryKey: myClubsKeys.of(teacherId),
    queryFn: teacherId === undefined ? skipToken : () => service.getMyClubs(),
    ...CachePolicy.STANDARD,
  });
