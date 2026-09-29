import { useInfiniteQuery, useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { useCallback } from "react";

import { useSessionUserId } from "@/shared/store/sessionStore";

import type { JoinableSchoolsResponse, SchoolCard } from "../schemas/network.schema";
import {
  joinableSchoolsQuery,
  networkKeys,
  networkService,
  type INetworkService,
} from "../services/networkService";

/** Lo que la pantalla pinta: la lista entera, sin saber cómo se pagina. */
export interface JoinableSchools {
  schools: SchoolCard[];
  /** Todas las sedes a las que puede unirse, no solo las cargadas. */
  totalCount: number;
}

/** La identidad de una sede es su escuela y su sucursal. */
const sedeKey = (card: SchoolCard) => `${card.db_id}-${card.club_id}`;

/**
 * Junta las páginas en una lista. Core pagina por posición: si entre dos páginas
 * se abre una escuela o le dan de alta en una, una sede puede saltar de página y
 * llegar dos veces. Se queda la primera.
 */
export function mergePages(data: InfiniteData<JoinableSchoolsResponse>): JoinableSchools {
  const seen = new Set<string>();
  const schools = data.pages
    .flatMap((page) => page.schools)
    .filter((card) => {
      const key = sedeKey(card);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  const last = data.pages[data.pages.length - 1];
  return { schools, totalCount: last?.pagination.total_count ?? 0 };
}

interface Options {
  /** Solo se pide con la pestaña «Cerca de mí» a la vista. */
  enabled: boolean;
  service?: Pick<INetworkService, "getJoinableSchools">;
}

/**
 * Las sedes a las que el profesor puede pedir unirse, página a página.
 *
 * `refresh()` vuelve a la primera página y solo pide esa: el `refetch()` de una
 * lista infinita pediría otra vez todas las páginas cargadas, una detrás de otra.
 */
export function useJoinableSchools({ enabled, service = networkService }: Options) {
  const teacherId = useSessionUserId();
  const queryClient = useQueryClient();
  const query = useInfiniteQuery({
    ...joinableSchoolsQuery(teacherId, service),
    select: mergePages,
    enabled,
  });

  const refresh = useCallback(
    () => queryClient.resetQueries({ queryKey: networkKeys.joinableSchools(teacherId) }),
    [queryClient, teacherId],
  );

  // Solo lo que pinta la lista, y leído propiedad a propiedad: copiar la query
  // entera (`...query`) haría que TanStack avisara de cualquier cambio.
  return {
    data: query.data,
    isPending: query.isPending,
    error: query.error,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    fetchNextPage: query.fetchNextPage,
    refetch: query.refetch,
    refresh,
  };
}
