import { useMemo } from "react";

import { useTheme } from "@/shared/hooks/useTheme";

import { dotsByDate } from "../utils/dotsByDate";

import { useScheduleMonth } from "./useScheduleMonth";

/**
 * Los días de la cuadrícula del mes de `date` para Semana y Mes: las clases de
 * cada día (`byDate`), sus puntos de color (`dots`: uno por clase, con su color
 * en el día) y el estado de la carga. Los puntos se calculan aquí, una vez por
 * respuesta, y no en cada vista ni cada minuto.
 */
export function useScheduleDays(date: string) {
  const theme = useTheme();
  const { byDate, hasData, error, refetch } = useScheduleMonth(date);
  const dots = useMemo(() => dotsByDate(byDate, theme.clubColors), [byDate, theme.clubColors]);
  return { byDate, dots, hasData, error, refetch };
}
