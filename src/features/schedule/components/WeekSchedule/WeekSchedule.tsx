import { useCallback, useMemo, useState } from "react";
import { View } from "react-native";

import { useScheduleDays } from "../../hooks/useScheduleDays";
import type { ScheduleClass } from "../../schemas/schedule.schema";
import { dayTense, visibleWeekDays, weekDays } from "../../utils/scheduleDates";
import type { ScheduleViewProps } from "../../utils/scheduleViews";
import { ScheduleDataState } from "../ScheduleDataState";
import { WeekDayCard } from "../WeekDayCard";
import { WeekFilter } from "../WeekFilter";
import { WeekStrip } from "../WeekStrip";

import { useStyles } from "./WeekSchedule.styles";

/** Un día sin clases: siempre la misma lista, para que `memo` no vea un cambio. */
const NO_CLASSES: readonly ScheduleClass[] = [];

/**
 * La vista Semana: la tira de 7 días y una tarjeta por día, de hoy al domingo en
 * la semana actual y los 7 días en las demás. Tocar un día deja solo ese, con
 * «Filtrado por…» y «Ver toda la semana»; tocar hoy o el ya tocado lo quita.
 *
 * El día tocado solo vale en su semana (`weekDays(date).includes`): al cambiar
 * de semana con las flechas deja de valer solo, sin un efecto que lo borre.
 * Los datos salen de la misma respuesta del mes que Día. Tocar un día también lo
 * elige en la agenda: al pasar a Día, se ve ese.
 */
export function WeekSchedule({ nowWall, date, today, nextClassId, clubOf, onSelect }: ScheduleViewProps) {
  const styles = useStyles();
  const [picked, setPicked] = useState<string | null>(null);
  const { byDate, dots, hasData, error, refetch } = useScheduleDays(date);

  const days = useMemo(() => weekDays(date), [date]);
  const filter = picked && days.includes(picked) && picked !== today ? picked : null;
  const active = filter ?? (days.includes(today) ? today : null);
  const visible = visibleWeekDays(days, today, filter);

  const onPick = useCallback(
    (day: string) => {
      onSelect(day);
      setPicked((current) => (day === today || day === current ? null : day));
    },
    [onSelect, today],
  );
  const onShowAll = useCallback(() => setPicked(null), []);

  return (
    <View style={styles.container}>
      <WeekStrip days={days} today={today} active={active} dots={dots} byDate={byDate} onPick={onPick} />
      {filter ? <WeekFilter date={filter} onShowAll={onShowAll} /> : null}
      <View style={styles.cards}>
        <ScheduleDataState hasData={hasData} error={error} onRetry={refetch}>
          {visible.map((day) => {
            const tense = dayTense(day, today);
            return (
              <WeekDayCard
                key={day}
                date={day}
                tense={tense}
                picked={day === filter}
                classes={byDate.get(day) ?? NO_CLASSES}
                nowWall={tense === "today" ? nowWall : undefined}
                nextClassId={tense === "today" ? nextClassId : undefined}
                clubOf={clubOf}
              />
            );
          })}
        </ScheduleDataState>
      </View>
    </View>
  );
}
