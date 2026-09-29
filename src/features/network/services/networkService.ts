import { infiniteQueryOptions, skipToken } from "@tanstack/react-query";

import { CachePolicy } from "@/shared/config/cachePolicies";
import type { IHttpClient } from "@/shared/services/BaseHttpClient";
import { httpClient } from "@/shared/services/httpClient";

import { JoinableSchoolsResponseSchema, type JoinableSchoolsResponse } from "../schemas/network.schema";

import { NETWORK_ENDPOINTS } from "./networkEndpoints";

/**
 * Sedes por página de «Cerca de mí». Se manda siempre, para no depender del
 * defecto de Core (que hoy también es 10).
 */
export const JOINABLE_SCHOOLS_PAGE_SIZE = 10;

/**
 * Claves de caché de «Cerca de mí»: siempre con el id del profesor, para que
 * otro profesor en el mismo móvil no vea la caché del anterior. Las de «Mis
 * clubes» son compartidas (`myClubsKeys`).
 */
export const networkKeys = {
  all: ["network"] as const,
  /** La lista entera de páginas: `useInfiniteQuery` guarda todas bajo esta clave. */
  joinableSchools: (teacherId: number | undefined) =>
    [...networkKeys.all, "joinable-schools", teacherId] as const,
};

/** El profesor sale del token: no se pide su id. */
export interface INetworkService {
  /** `page` empieza en 1. */
  getJoinableSchools(page: number): Promise<JoinableSchoolsResponse>;
}

export class NetworkService implements INetworkService {
  constructor(private readonly http: IHttpClient) {}

  async getJoinableSchools(page: number): Promise<JoinableSchoolsResponse> {
    const data = await this.http.get<unknown>(NETWORK_ENDPOINTS.JOINABLE_SCHOOLS, {
      params: { page, size: JOINABLE_SCHOOLS_PAGE_SIZE },
    });
    return JoinableSchoolsResponseSchema.parse(data);
  }
}

export const networkService: INetworkService = new NetworkService(httpClient);

// ── La receta de la query ────────────────────────────────────────────────────
//
// Clave, cómo se pide y su caché, en un solo sitio (como `teacherProfileQuery`).
// Sin profesor en sesión no se pide nada (`skipToken`).

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
