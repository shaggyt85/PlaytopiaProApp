import { memo } from "react";
import { View } from "react-native";

import type { ScheduleClub } from "@/shared/hooks/useScheduleClubs";
import type { ScheduleClass } from "@/shared/schemas/schedule.schema";
import type { SchoolCard } from "@/shared/schemas/schoolCard.schema";
import { capitalize, formatWeekdayDay } from "@/shared/utils/formatDate";

import type { DayTense } from "../../utils/scheduleDates";
import { DayClassList } from "../DayClassList";
import { DayHeading } from "../DayHeading";
import { WeekClassRow } from "../WeekClassRow";

import { useStyles } from "./WeekDayCard.styles";

interface WeekDayCardProps {
  /** El día, `YYYY-MM-DD`. */
  date: string;
  tense: DayTense;
  /** El tocado en la tira (su aro). */
  picked: boolean;
  classes: readonly ScheduleClass[];
  /** «Ahora» como hora de pared, solo en la tarjeta de hoy: las demás no la necesitan. */
  nowWall?: number;
  /** La próxima según Core, solo en la tarjeta de hoy: se marca «PRÓXIMA». */
  nextClassId?: number;
  clubOf: (branch: Pick<SchoolCard, "db_id" | "club_id">) => ScheduleClub;
}

/**
 * Un día de la vista Semana: «Lunes 18», «HOY · 23:10» si es hoy, cuántas
 * clases tiene y sus filas, o «Día libre». Hoy con el aro de marca y el día
 * tocado con uno más suave; los demás, más apagados.
 *
 * `memo`: el reloj de la pantalla solo le llega a la tarjeta de hoy, así cada
 * minuto no se repinta la semana entera.
 */
export const WeekDayCard = memo(function WeekDayCard({
  date,
  tense,
  picked,
  classes,
  nowWall,
  nextClassId,
  clubOf,
}: WeekDayCardProps) {
  const styles = useStyles();
  const isToday = tense === "today";

  return (
    <View style={[styles.card, isToday ? styles.today : picked ? styles.picked : styles.other]} testID={`week-day-${date}`}>
      <DayHeading
        title={capitalize(formatWeekdayDay(date))}
        count={classes.length}
        nowWall={isToday ? nowWall : undefined}
        size="card"
      />
      <DayClassList
        classes={classes}
        tense={tense}
        nowWall={nowWall}
        nextClassId={nextClassId}
        clubOf={clubOf}
        Row={WeekClassRow}
      />
    </View>
  );
});
