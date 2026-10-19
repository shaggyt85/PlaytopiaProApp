import { DataState } from "@/shared/components/DataState";

import { useScheduleMonth } from "../../hooks/useScheduleMonth";
import type { ScheduleViewProps } from "../../utils/scheduleViews";
import { DayTimeline } from "../DayTimeline";
import { FreeDayCard } from "../FreeDayCard";

/**
 * La vista Día, como el prototipo final: directamente la tira de horas o, según
 * los datos, «Cargando…», el error con «Reintentar» o «Día libre». La barra y el
 * día elegido los pone `MySchedule`, igual para las tres vistas.
 */
export function DaySchedule({ now, date, today, nextClassId, clubOf }: ScheduleViewProps) {
  const isToday = date === today;
  const { dayClasses, hasData, error, refetch } = useScheduleMonth(date);

  return (
    <DataState hasData={hasData} error={error} onRetry={refetch}>
      {dayClasses.length === 0 ? (
        <FreeDayCard />
      ) : (
        <DayTimeline classes={dayClasses} isToday={isToday} now={now} nextClassId={nextClassId} clubOf={clubOf} />
      )}
    </DataState>
  );
}
