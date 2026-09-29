import { infiniteQueryOptions, queryOptions, skipToken } from "@tanstack/react-query";

import { CachePolicy } from "@/shared/config/cachePolicies";
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

// ── Recetas de las queries ───────────────────────────────────────────────────
//
// Clave, cómo se pide y su caché, en un solo sitio (como `teacherProfileQuery`).
// Sin profesor en sesión no se pide nada (`skipToken`).

/** «Mis clubes». Cambia cuando un club le da de alta o de baja: `STANDARD`. */
export const myClubsQuery = (
  teacherId: number | undefined,
  service: Pick<INetworkService, "getMyClubs"> = networkService,
) =>
  queryOptions({
    queryKey: networkKeys.myClubs(teacherId),
    queryFn: teacherId === undefined ? skipToken : () => service.getMyClubs(),
    ...CachePolicy.STANDARD,
  });

/** La primera página de «Cerca de mí». */
const FIRST_PAGE = 1;

/**
 * «Cerca de mí», página a página: la siguiente mientras queden.
 *
 * `STATIC` (1 hora) y no `STANDARD`, aunque no es un catálogo: la lista solo
 * cambia cuando se abre una escuela o le dan de alta en una, que pasa muy de vez
 * en cuando, y cada vuelta a pedirla serían tantas peticiones como páginas
 * cargadas. Para ver algo nuevo ya, se desliza hacia abajo.
 */
export const joinableSchoolsQuery = (
  teacherId: number | undefined,
  service: Pick<INetworkService, "getJoinableSchools"> = networkService,
) =>
  infiniteQueryOptions({
    queryKey: networkKeys.joinableSchools(teacherId),
    queryFn:
      teacherId === undefined
        ? skipToken
        : ({ pageParam }) => service.getJoinableSchools(pageParam),
    initialPageParam: FIRST_PAGE,
    getNextPageParam: ({ pagination }) =>
      pagination.page < pagination.total_pages ? pagination.page + 1 : undefined,
    ...CachePolicy.STATIC,
  });
