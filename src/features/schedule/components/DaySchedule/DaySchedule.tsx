import { View } from "react-native";

import { useTranslation } from "@/shared/hooks/useTranslation";
import type { SchoolCard } from "@/shared/schemas/schoolCard.schema";
import { formatWeekdayDay } from "@/shared/utils/formatDate";

import type { ScheduleClub } from "../../hooks/useScheduleClubs";
import { useScheduleMonth } from "../../hooks/useScheduleMonth";
import { useSelectedDay } from "../../hooks/useSelectedDay";
import { dayLabel } from "../../utils/dayLabel";
import { localToday, wallNow } from "../../utils/scheduleDates";
import { DayHeader } from "../DayHeader";
import { DayTimeline } from "../DayTimeline";
import { FreeDayCard } from "../FreeDayCard";
import { ScheduleDataState } from "../ScheduleDataState";
import { ScheduleToolbar } from "../ScheduleToolbar";

import { useStyles } from "./DaySchedule.styles";

interface DayScheduleProps {
  /** El reloj de la pantalla (`useForegroundNow` cada minuto). */
  now: number;
  /** La próxima clase (`useNextClass`), la misma de su tarjeta. */
  nextClassId: number | undefined;
  clubOf: (sede: Pick<SchoolCard, "db_id" | "club_id">) => ScheduleClub;
}

/**
 * La vista Día de la agenda: las flechas, la pastilla del día y, según los
 * datos, «Cargando…», el error con «Reintentar», «Día libre» o la tira de horas.
 * El error solo se enseña si no hay nada que pintar: si falla una recarga, se
 * siguen viendo las clases.
 */
export function DaySchedule({ now, nextClassId, clubOf }: DayScheduleProps) {
  const styles = useStyles();
  const { t } = useTranslation();
  const { date, isToday, goPrevious, goNext } = useSelectedDay(localToday(now));
  const { dayClasses, hasData, error, refetch } = useScheduleMonth(date);
  const label = dayLabel(formatWeekdayDay(date), isToday, t);


  return (
    <View style={styles.container}>
      <ScheduleToolbar
        view="day"
        date={date}
        isToday={isToday}
        nowWall={wallNow(now)}
        onPrevious={() => goPrevious("day")}
        onNext={() => goNext("day")}
      />
      <DayHeader label={label} classCount={hasData ? dayClasses.length : undefined} />
      <ScheduleDataState hasData={hasData} error={error} onRetry={refetch}>
        {dayClasses.length === 0 ? (
          <FreeDayCard />
        ) : (
          <DayTimeline classes={dayClasses} isToday={isToday} now={now} nextClassId={nextClassId} clubOf={clubOf} />
        )}
      </ScheduleDataState>
    </View>
  );
}
