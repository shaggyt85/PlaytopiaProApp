import { memo } from "react";
import { View } from "react-native";

import { useTheme } from "@/shared/hooks/useTheme";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { formatWeekdayDay, formatWeekdayInitials } from "@/shared/utils/formatDate";

import type { ScheduleClass } from "../../schemas/schedule.schema";
import { dayMark } from "../../utils/dayMark";
import { DayButton } from "../DayButton";

import { useStyles } from "./WeekStrip.styles";

/** Sin clases ni puntos: siempre la misma lista vacía. */
const NONE: readonly never[] = [];

interface WeekStripProps {
  /** Los 7 días de la semana, de lunes a domingo. */
  days: readonly string[];
  today: string;
  /** El día marcado: el tocado o, si no hay, hoy si es de esta semana. */
  active: string | null;
  /** Los colores de los clubes de cada día (`dotsByDate`). */
  dots: ReadonlyMap<string, readonly string[]>;
  /** Las clases de cada día, para decir cuántas tiene. */
  byDate: ReadonlyMap<string, readonly ScheduleClass[]>;
  onPick: (date: string) => void;
}

/**
 * La tira de la semana: una pastilla por día (`DayButton`) con su letra, su
 * número y hasta tres puntos con los colores de sus clubes. Hoy, si no es el
 * marcado, lleva además el punto coral arriba.
 */
export const WeekStrip = memo(function WeekStrip({ days, today, active, dots, byDate, onPick }: WeekStripProps) {
  const styles = useStyles();
  const theme = useTheme();
  const { t } = useTranslation();
  const letters = formatWeekdayInitials();

  return (
    <View style={styles.row}>
      {days.map((day, index) => (
        <DayButton
          key={day}
          date={day}
          mark={dayMark(day, active, today)}
          variant="strip"
          shape={styles.pill}
          radius={theme.radius.xxl}
          letter={letters[index]}
          dots={dots.get(day) ?? NONE}
          todayMark
          onPick={onPick}
          accessibilityLabel={t("schedule.day.a11y.summary", {
            day: formatWeekdayDay(day),
            classes: t("schedule.day.classes", { count: (byDate.get(day) ?? NONE).length }),
          })}
          testID={`week-strip-${day}`}
        />
      ))}
    </View>
  );
});
