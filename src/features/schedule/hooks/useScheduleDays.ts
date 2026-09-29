import { useMemo } from "react";

import type { SchoolCard } from "@/shared/schemas/schoolCard.schema";

import type { ScheduleClass } from "../schemas/schedule.schema";
import { dotsByDate } from "../utils/dotsByDate";

import type { ScheduleClub } from "./useScheduleClubs";
import { useScheduleMonth } from "./useScheduleMonth";

/**
 * Los días de la cuadrícula del mes de \`date\` para Semana y Mes: las clases de
 * cada día (\`byDate\`), sus puntos de color (\`dots\`) y el estado de la carga.
 * Los puntos se calculan aquí, una vez por respuesta (o si cambian los clubes),
 * y no en cada vista ni cada minuto.
 */
export function useScheduleDays(date: string, clubOf: (sede: Pick<SchoolCard, "db_id" | "club_id">) => ScheduleClub) {
  const { byDate, hasData, error, refetch } = useScheduleMonth(date);
  const dots = useMemo(
    () => dotsByDate(byDate, (c: ScheduleClass) => clubOf(c).colors.color),
    [byDate, clubOf],
  );
  return { byDate, dots, hasData, error, refetch };
}
