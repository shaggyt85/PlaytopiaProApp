import { View } from "react-native";

import { Text } from "@/shared/components/Text";
import { useTranslation } from "@/shared/hooks/useTranslation";
import type { SchoolCard } from "@/shared/schemas/schoolCard.schema";
import { formatDayMonth } from "@/shared/utils/formatDate";

import type { ScheduleClub } from "../../hooks/useScheduleClubs";
import { useScheduleDays } from "../../hooks/useScheduleDays";
import type { ScheduleClass } from "../../schemas/schedule.schema";
import { dayLabel } from "../../utils/dayLabel";
import { dayTense, wallNow } from "../../utils/scheduleDates";
import { DayClassList } from "../DayClassList";
import { MonthClassRow } from "../MonthClassRow";
import { MonthGrid } from "../MonthGrid";
import { ScheduleDataState } from "../ScheduleDataState";

import { useStyles } from "./MonthSchedule.styles";

/** Un día sin clases: siempre la misma lista, para que `memo` no vea un cambio. */
const NO_CLASSES: readonly ScheduleClass[] = [];

interface MonthScheduleProps {
  /** El reloj de la pantalla (`useForegroundNow` cada minuto). */
  now: number;
  /** El día elegido de la agenda: su mes es el que se ve y su lista, la de debajo. */
  date: string;
  today: string;
  clubOf: (sede: Pick<SchoolCard, "db_id" | "club_id">) => ScheduleClub;
  /** Tocar un día lo elige en la agenda. */
  onSelect: (date: string) => void;
}

/**
 * La vista Mes: la cuadrícula del mes con los puntos de cada día y, debajo, el
 * día elegido («Hoy · 18 de noviembre») con sus clases en filas compactas, o
 * «Día libre». Los datos salen de la misma respuesta del mes que Día y Semana.
 */
export function MonthSchedule({ now, date, today, clubOf, onSelect }: MonthScheduleProps) {
  const styles = useStyles();
  const { t } = useTranslation();
  const { byDate, dots, hasData, error, refetch } = useScheduleDays(date, clubOf);
  const tense = dayTense(date, today);

  return (
    <View style={styles.container}>
      <MonthGrid date={date} today={today} dots={dots} byDate={byDate} onPick={onSelect} />
      <View style={styles.day}>
        <Text variant="subtitle" accessibilityRole="header">
          {dayLabel(formatDayMonth(date), tense === "today", t)}
        </Text>
        <ScheduleDataState hasData={hasData} error={error} onRetry={refetch}>
          <DayClassList
            classes={byDate.get(date) ?? NO_CLASSES}
            tense={tense}
            nowWall={tense === "today" ? wallNow(now) : undefined}
            clubOf={clubOf}
            Row={MonthClassRow}
          />
        </ScheduleDataState>
      </View>
    </View>
  );
}
