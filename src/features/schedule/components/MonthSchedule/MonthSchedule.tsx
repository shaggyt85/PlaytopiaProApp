import { useCallback, useMemo, useRef } from "react";
import { View } from "react-native";

import { DataState } from "@/shared/components/DataState";
import type { ScheduleClass } from "@/shared/schemas/schedule.schema";
import { formatClassDate } from "@/shared/utils/formatDate";

import { useScheduleDays } from "../../hooks/useScheduleDays";
import { useScrollIntoView } from "../../hooks/useScheduleScroll";
import { dayTense, monthDaysWithClasses } from "../../utils/scheduleDates";
import type { ScheduleViewProps } from "../../utils/scheduleViews";
import { DayClassList } from "../DayClassList";
import { DayHeading } from "../DayHeading";
import { FreeDayCard } from "../FreeDayCard";
import { MonthClassRow } from "../MonthClassRow";
import { MonthGrid } from "../MonthGrid";

import { useStyles } from "./MonthSchedule.styles";

/** Un día sin clases: siempre la misma lista, para que `memo` no vea un cambio. */
const NO_CLASSES: readonly ScheduleClass[] = [];

/**
 * La vista Mes, como el prototipo final: la cuadrícula con los puntos de cada día
 * y, debajo, **todos los días del mes que tienen clases**, cada uno con su franja
 * («Miércoles, 18 de noviembre · HOY · 3 clases», resaltada la del día elegido)
 * y sus filas. Tocar un día de la cuadrícula lo elige y lleva la lista hasta él;
 * si no tiene clases, solo se elige. Un mes sin clases, «Día libre». Sin
 * cuadrícula fija al desplazar: la franja de cada día ya dice dónde se está.
 *
 * Los datos salen de la misma respuesta del mes que Día y Semana.
 */
export function MonthSchedule({ nowWall, date, today, nextClassId, clubOf, onSelect }: ScheduleViewProps) {
  const styles = useStyles();
  const scrollIntoView = useScrollIntoView();
  const { byDate, dots, hasData, error, refetch } = useScheduleDays(date);
  const days = useMemo(() => monthDaysWithClasses(byDate, date), [byDate, date]);
  // Cada día de la lista, para llevarlo a la vista al tocarlo en la cuadrícula.
  const blocks = useRef(new Map<string, View>());

  const onPick = useCallback(
    (day: string) => {
      onSelect(day);
      scrollIntoView(blocks.current.get(day) ?? null);
    },
    [onSelect, scrollIntoView],
  );

  return (
    <View style={styles.container}>
      <MonthGrid date={date} today={today} dots={dots} byDate={byDate} onPick={onPick} />
      <DataState hasData={hasData} error={error} onRetry={refetch}>
        {days.length === 0 ? (
          <FreeDayCard />
        ) : (
          <View style={styles.days}>
            {days.map((day) => {
              const tense = dayTense(day, today);
              const isToday = tense === "today";
              const classes = byDate.get(day) ?? NO_CLASSES;
              return (
                <View
                  key={day}
                  ref={(node) => {
                    if (node) blocks.current.set(day, node);
                    else blocks.current.delete(day);
                  }}
                  style={styles.day}
                  testID={`month-list-${day}`}
                >
                  <DayHeading
                    title={formatClassDate(day)}
                    count={classes.length}
                    nowWall={isToday ? nowWall : undefined}
                    size="strip"
                    active={day === date}
                    testID={`month-heading-${day}`}
                  />
                  <DayClassList
                    classes={classes}
                    tense={tense}
                    nowWall={isToday ? nowWall : undefined}
                    nextClassId={isToday ? nextClassId : undefined}
                    clubOf={clubOf}
                    Row={MonthClassRow}
                  />
                </View>
              );
            })}
          </View>
        )}
      </DataState>
    </View>
  );
}
