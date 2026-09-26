/**
 * Políticas de caché con nombre (guía §7). Cada query elige una:
 *
 *   useQuery({ queryKey, queryFn, ...CachePolicy.LIVE })
 *
 * Los tiempos se definen aquí una sola vez. Salirse de una política exige un
 * comentario con el porqué; si la misma excepción aparece en una segunda
 * pantalla, se convierte en una política nueva.
 */

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;

export const CachePolicy = {
  /** Catálogos, niveles, deportes, configuración del club. */
  STATIC: {
    staleTime: HOUR,
    gcTime: 24 * HOUR,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  },

  /** Por defecto: perfil, listados normales. */
  STANDARD: {
    staleTime: 5 * MINUTE,
    gcTime: 10 * MINUTE,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  },

  /** Lo que cambia otro actor (el club, un alumno): asistencia, inscritos. */
  LIVE: {
    staleTime: 30 * SECOND,
    gcTime: 5 * MINUTE,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  },

  /** Lo que nunca puede verse viejo: versión de la app, normativas. */
  ALWAYS_FRESH: {
    staleTime: 0,
    gcTime: 5 * MINUTE,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  },

  /**
   * Pantallas que esperan un cambio externo: pregunta cada `intervalMs`
   * solo mientras `whilePending(data)` sea cierto, y nunca en segundo plano.
   *
   *   ...CachePolicy.POLLING(30_000, (data) => data?.items.some((i) => i.pending) ?? false)
   */
  POLLING: <TData>(
    intervalMs: number,
    whilePending: (data: TData | undefined) => boolean,
  ) => ({
    staleTime: 0,
    gcTime: 5 * MINUTE,
    refetchInterval: (query: { state: { data: TData | undefined } }) =>
      whilePending(query.state.data) ? intervalMs : false,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  }),
} as const;
