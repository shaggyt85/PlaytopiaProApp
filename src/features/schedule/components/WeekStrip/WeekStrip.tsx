import { memo } from "react";
import { Pressable, View } from "react-native";

import { BrandGradient } from "@/shared/components/BrandGradient";
import { Text } from "@/shared/components/Text";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { formatDayOfMonth, formatWeekdayDay, formatWeekdayInitials } from "@/shared/utils/formatDate";

import type { ScheduleClass } from "../../schemas/schedule.schema";

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
 * La tira de la semana: una pastilla por día con su letra, su número y hasta
 * tres puntos con los colores de sus clubes. El marcado, con el degradado de
 * marca en relieve; hoy, si no es el marcado, con el aro de marca y el punto
 * coral arriba.
 */
export const WeekStrip = memo(function WeekStrip({ days, today, active, dots, byDate, onPick }: WeekStripProps) {
  const styles = useStyles();
  const { t } = useTranslation();
  const letters = formatWeekdayInitials();

  return (
    <View style={styles.row}>
      {days.map((day, index) => {
        const selected = day === active;
        const isToday = day === today && !selected;
        const count = (byDate.get(day) ?? NONE).length;
        const color = selected ? "onPrimary" : isToday ? "primary" : "textSecondary";
        return (
          <Pressable
            key={day}
            onPress={() => onPick(day)}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            accessibilityLabel={t("schedule.week.dayA11y", {
              day: formatWeekdayDay(day),
              classes: t("schedule.day.classes", { count }),
            })}
            style={[styles.pill, selected ? styles.selected : isToday ? styles.today : styles.other]}
            testID={`week-strip-${day}`}
          >
            {selected ? <BrandGradient style={styles.fill} /> : null}
            <Text variant="chip" color={color}>
              {letters[index]}
            </Text>
            <Text variant="subtitle" color={selected ? "onPrimary" : isToday ? "primary" : "text"}>
              {formatDayOfMonth(day)}
            </Text>
            <View style={styles.dots}>
              {(dots.get(day) ?? NONE).map((dotColor, i) => (
                <View key={i} style={[styles.dot, { backgroundColor: selected ? undefined : dotColor }, selected && styles.dotOnBrand]} />
              ))}
            </View>
            {isToday ? <View style={styles.todayMark} testID="week-strip-today" /> : null}
          </Pressable>
        );
      })}
    </View>
  );
});
