import { memo, useMemo } from "react";
import { View } from "react-native";

import { Text } from "@/shared/components/Text";
import { useTheme } from "@/shared/hooks/useTheme";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { formatWeekdayDay, formatWeekdayInitials } from "@/shared/utils/formatDate";

import type { ScheduleClass } from "../../schemas/schedule.schema";
import { dayMark } from "../../utils/dayMark";
import { chunkWeeks, monthCells } from "../../utils/scheduleDates";
import { DayButton } from "../DayButton";

import { useStyles } from "./MonthGrid.styles";

/** Sin clases ni puntos: siempre la misma lista vacía. */
const NONE: readonly never[] = [];

interface MonthGridProps {
  /** Un día del mes que se ve: el elegido de la agenda. */
  date: string;
  today: string;
  dots: ReadonlyMap<string, readonly string[]>;
  byDate: ReadonlyMap<string, readonly ScheduleClass[]>;
  onPick: (date: string) => void;
}

/**
 * La cuadrícula de la vista Mes: L … D arriba y una fila por semana, con los
 * huecos de antes del día 1 y de después del último vacíos. Cada día es un
 * \`DayButton\` con su número y sus puntos: el elegido, hoy o los demás. Tocar
 * uno lo elige en la agenda y la lista de debajo pasa a ese día.
 *
 * Las semanas en filas de 7 (\`chunkWeeks\`) y cada celda con \`flex: 1\`: miden lo
 * mismo en un móvil que en una tablet, sin calcular anchos.
 */
export const MonthGrid = memo(function MonthGrid({ date, today, dots, byDate, onPick }: MonthGridProps) {
  const styles = useStyles();
  const theme = useTheme();
  const { t } = useTranslation();
  const weeks = useMemo(() => chunkWeeks(monthCells(date)), [date]);

  return (
    <View style={styles.card} testID="month-grid">
      <View style={styles.week}>
        {formatWeekdayInitials().map((letter, index) => (
          <Text key={index} variant="chip" color="textSecondary" align="center" style={styles.slot}>
            {letter}
          </Text>
        ))}
      </View>
      {weeks.map((week, row) => (
        <View key={row} style={styles.week}>
          {week.map((day, index) => {
            if (!day) return <View key={index} style={styles.slot} />;
            return (
              <View key={day} style={styles.slot}>
                <DayButton
                  date={day}
                  mark={dayMark(day, date, today)}
                  variant="cell"
                  shape={styles.cell}
                  radius={theme.radius.xxl}
                  dots={dots.get(day) ?? NONE}
                  onPick={onPick}
                  accessibilityLabel={t("schedule.day.a11y.summary", {
                    day: formatWeekdayDay(day),
                    classes: t("schedule.day.classes", { count: (byDate.get(day) ?? NONE).length }),
                  })}
                  testID={`month-day-${day}`}
                />
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
});
