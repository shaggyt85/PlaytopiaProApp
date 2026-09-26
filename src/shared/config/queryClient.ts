import { QueryClient } from "@tanstack/react-query";

import { isHttpError } from "@/shared/services/HttpError";

import { CachePolicy } from "./cachePolicies";

const MAX_QUERY_RETRIES = 3;

/**
 * Solo se reintenta lo pasajero: sin red, timeout o un 5xx. Un 4xx es una
 * respuesta clara de Core, y un error que no es HttpError (validación Zod,
 * un fallo de código) no se arregla repitiendo.
 */
export function shouldRetryQuery(failureCount: number, error: unknown): boolean {
  if (failureCount >= MAX_QUERY_RETRIES || !isHttpError(error)) return false;
  if (error.kind !== "http") return true;
  return (error.status ?? 0) >= 500;
}

/** 1 s, 2 s, 4 s… con un tope de 8 s. */
export const queryRetryDelay = (attemptIndex: number) =>
  Math.min(1000 * 2 ** attemptIndex, 8000);

/** Crea un QueryClient con la configuración de la app (los tests crean uno limpio). */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        ...CachePolicy.STANDARD,
        retry: shouldRetryQuery,
        retryDelay: queryRetryDelay,
        // Se intenta aunque el sistema diga que no hay red (a veces se
        // equivoca); si falla de verdad, la query espera a que vuelva.
        networkMode: "offlineFirst",
      },
      mutations: {
        // Nunca se reintenta una mutación sola: si el POST llegó a Core y lo
        // que se perdió fue la respuesta, repetirlo lo ejecuta dos veces.
        // Una mutación idempotente puede activarlo con un comentario.
        retry: false,
        networkMode: "online",
      },
    },
  });
}

export const queryClient = createQueryClient();
