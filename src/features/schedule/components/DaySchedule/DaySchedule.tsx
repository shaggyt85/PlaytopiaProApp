import { View } from "react-native";

import { ErrorState } from "@/shared/components/ErrorState";
import { LoadingState } from "@/shared/components/LoadingState";
import { useTranslation } from "@/shared/hooks/useTranslation";
import type { SchoolCard } from "@/shared/schemas/schoolCard.schema";
import { formatWeekdayDay } from "@/shared/utils/formatDate";

import { useAnnounceOnChange } from "../../hooks/useAnnounceOnChange";
import type { ScheduleClub } from "../../hooks/useScheduleClubs";
import { useScheduleMonth } from "../../hooks/useScheduleMonth";
import { useSelectedDay } from "../../hooks/useSelectedDay";
import { dayLabel } from "../../utils/dayLabel";
import { localToday, wallNow } from "../../utils/scheduleDates";
import { DayHeader } from "../DayHeader";
import { DayTimeline } from "../DayTimeline";
import { DayToolbar } from "../DayToolbar";
import { FreeDayCard } from "../FreeDayCard";

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
  useAnnounceOnChange(label);

  let content;
  if (!hasData) content = error ? <ErrorState error={error} onRetry={refetch} /> : <LoadingState />;
  else if (dayClasses.length === 0) content = <FreeDayCard />;
  else
    content = (
      <DayTimeline classes={dayClasses} isToday={isToday} now={now} nextClassId={nextClassId} clubOf={clubOf} />
    );

  return (
    <View style={styles.container}>
      <DayToolbar date={date} nowWall={wallNow(now)} onPrevious={goPrevious} onNext={goNext} />
      <DayHeader label={label} classCount={hasData ? dayClasses.length : undefined} />
      {content}
    </View>
  );
}
