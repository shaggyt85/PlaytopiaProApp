import type { IHttpClient } from "@/shared/services/BaseHttpClient";
import { httpClient } from "@/shared/services/httpClient";

import {
  JoinableSchoolsResponseSchema,
  MyClubsResponseSchema,
  type JoinableSchoolsResponse,
  type MyClubsResponse,
} from "../schemas/network.schema";

import { NETWORK_ENDPOINTS } from "./networkEndpoints";

/**
 * Sedes por página de «Cerca de mí». Se manda siempre, para no depender del
 * defecto de Core (que hoy también es 10).
 */
export const JOINABLE_SCHOOLS_PAGE_SIZE = 10;

/**
 * Claves de caché de «Red de clubes»: siempre con el id del profesor, para que
 * otro profesor en el mismo móvil no vea la caché del anterior.
 */
export const networkKeys = {
  all: ["network"] as const,
  myClubs: (teacherId: number | undefined) => [...networkKeys.all, "my-clubs", teacherId] as const,
  /** La lista entera de páginas: `useInfiniteQuery` guarda todas bajo esta clave. */
  joinableSchools: (teacherId: number | undefined) =>
    [...networkKeys.all, "joinable-schools", teacherId] as const,
};

/** El profesor sale del token: ninguno de los dos pide su id. */
export interface INetworkService {
  getMyClubs(): Promise<MyClubsResponse>;
  /** `page` empieza en 1. */
  getJoinableSchools(page: number): Promise<JoinableSchoolsResponse>;
}

export class NetworkService implements INetworkService {
  constructor(private readonly http: IHttpClient) {}

  async getMyClubs(): Promise<MyClubsResponse> {
    return MyClubsResponseSchema.parse(await this.http.get<unknown>(NETWORK_ENDPOINTS.MY_CLUBS));
  }

  async getJoinableSchools(page: number): Promise<JoinableSchoolsResponse> {
    const data = await this.http.get<unknown>(NETWORK_ENDPOINTS.JOINABLE_SCHOOLS, {
      params: { page, size: JOINABLE_SCHOOLS_PAGE_SIZE },
    });
    return JoinableSchoolsResponseSchema.parse(data);
  }
}

export const networkService: INetworkService = new NetworkService(httpClient);
