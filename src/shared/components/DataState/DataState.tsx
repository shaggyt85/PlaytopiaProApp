import type { ReactNode } from "react";

import { ErrorState } from "@/shared/components/ErrorState";
import { LoadingState } from "@/shared/components/LoadingState";

interface DataStateProps {
  /** Ya hay datos que pintar. */
  hasData: boolean;
  error: unknown;
  onRetry: () => void | Promise<unknown>;
  /** Lo que se pinta con datos. */
  children: ReactNode;
}

/**
 * Los estados de una pantalla con datos, en un solo sitio: sin datos,
 * «Cargando…» o el error con «Reintentar»; con datos, el contenido. El error
 * solo se enseña si no hay nada que pintar: si falla una recarga, se sigue
 * viendo lo que había. Lo usan las vistas de la agenda, el detalle de una clase
 * y «Mis grupos».
 */
export function DataState({ hasData, error, onRetry, children }: DataStateProps) {
  if (hasData) return children;
  return error ? <ErrorState error={error} onRetry={onRetry} /> : <LoadingState />;
}
