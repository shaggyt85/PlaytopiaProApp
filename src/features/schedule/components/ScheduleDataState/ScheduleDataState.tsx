import type { ReactNode } from "react";

import { ErrorState } from "@/shared/components/ErrorState";
import { LoadingState } from "@/shared/components/LoadingState";

interface ScheduleDataStateProps {
  /** Ya hay datos que pintar (`useScheduleMonth().hasData`). */
  hasData: boolean;
  error: unknown;
  onRetry: () => void | Promise<unknown>;
  /** Lo que se pinta con datos. */
  children: ReactNode;
}

/**
 * Los estados de las vistas de la agenda, en un solo sitio: sin datos,
 * «Cargando…» o el error con «Reintentar»; con datos, la vista. El error solo se
 * enseña si no hay nada que pintar: si falla una recarga, se siguen viendo las
 * clases. Lo usan Día, Semana y Mes.
 */
export function ScheduleDataState({ hasData, error, onRetry, children }: ScheduleDataStateProps) {
  if (hasData) return children;
  return error ? <ErrorState error={error} onRetry={onRetry} /> : <LoadingState />;
}
