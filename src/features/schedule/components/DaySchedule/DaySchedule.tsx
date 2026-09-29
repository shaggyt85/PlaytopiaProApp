import { useTranslation } from "@/shared/hooks/useTranslation";
import { formatWeekdayDay } from "@/shared/utils/formatDate";

import { useScheduleMonth } from "../../hooks/useScheduleMonth";
import { dayLabel } from "../../utils/dayLabel";
import type { ScheduleViewProps } from "../../utils/scheduleViews";
import { DayHeader } from "../DayHeader";
import { DayTimeline } from "../DayTimeline";
import { FreeDayCard } from "../FreeDayCard";
import { ScheduleDataState } from "../ScheduleDataState";

/**
 * La vista Día: la pastilla del día y, según los datos, «Cargando…», el error
 * con «Reintentar», «Día libre» o la tira de horas. La barra, el día elegido y
 * la leyenda los pone `ScheduleAgenda`, igual para las tres vistas.
 */
export function DaySchedule({ now, date, today, nextClassId, clubOf }: ScheduleViewProps) {
  const { t } = useTranslation();
  const isToday = date === today;
  const { dayClasses, hasData, error, refetch } = useScheduleMonth(date);

  return (
    <>
      <DayHeader label={dayLabel(formatWeekdayDay(date), isToday, t)} classCount={hasData ? dayClasses.length : undefined} />
      <ScheduleDataState hasData={hasData} error={error} onRetry={refetch}>
        {dayClasses.length === 0 ? (
          <FreeDayCard />
        ) : (
          <DayTimeline classes={dayClasses} isToday={isToday} now={now} nextClassId={nextClassId} clubOf={clubOf} />
        )}
      </ScheduleDataState>
    </>
  );
}
