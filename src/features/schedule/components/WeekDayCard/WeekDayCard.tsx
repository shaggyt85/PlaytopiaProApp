import { memo } from "react";
import { View } from "react-native";

import { Chip } from "@/shared/components/Chip";
import { Text } from "@/shared/components/Text";
import { useTranslation } from "@/shared/hooks/useTranslation";
import type { SchoolCard } from "@/shared/schemas/schoolCard.schema";
import { capitalize, formatWallTime, formatWeekdayDay } from "@/shared/utils/formatDate";

import type { ScheduleClub } from "../../hooks/useScheduleClubs";
import type { ScheduleClass } from "../../schemas/schedule.schema";
import type { DayTense } from "../../utils/scheduleDates";
import { DayClassList } from "../DayClassList";
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
  clubOf: (sede: Pick<SchoolCard, "db_id" | "club_id">) => ScheduleClub;
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
  clubOf,
}: WeekDayCardProps) {
  const styles = useStyles();
  const { t } = useTranslation();
  const isToday = tense === "today";

  return (
    <View style={[styles.card, isToday ? styles.today : picked ? styles.picked : styles.other]} testID={`week-day-${date}`}>
      <View style={styles.header}>
        <View style={styles.title}>
          <Text variant="subtitle">{capitalize(formatWeekdayDay(date))}</Text>
          {isToday && nowWall !== undefined ? (
            <Chip label={t("schedule.week.todayNow", { time: formatWallTime(nowWall) })} dot={false} />
          ) : null}
        </View>
        <Text variant="tab" color="textSecondary">
          {t("schedule.day.classes", { count: classes.length })}
        </Text>
      </View>
      <DayClassList classes={classes} tense={tense} nowWall={nowWall} clubOf={clubOf} Row={WeekClassRow} />
    </View>
  );
});
