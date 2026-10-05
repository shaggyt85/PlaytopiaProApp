import { memo } from "react";
import { View } from "react-native";

import { Chevron } from "@/shared/components/Chevron";
import { PressableScale } from "@/shared/components/PressableScale";
import { Text } from "@/shared/components/Text";
import { useOpenClass } from "@/shared/hooks/useOpenClass";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { studentsLabel } from "@/shared/utils/seatsLabel";

import { classA11yLabel } from "../../utils/classA11yLabel";
import { durationMeta } from "../../utils/classMeta";
import type { DayClassRowProps } from "../DayClassList";
import { TimeSquare } from "../TimeSquare";

import { TIME_SQUARE_SIZE, useStyles } from "./MonthClassRow.styles";

/**
 * Una clase en la lista de un día de la vista Mes, como el prototipo final: la
 * hora en su cuadrado con su color en el día (el mismo que en Día y Semana), el
 * título (hasta dos líneas), «60 min · pista · 3/4 alumnos» y la flecha. Más
 * sencilla que la de Semana: sin barra ni marca de estado. Sin el club, como en
 * Día y Semana (el lector de pantalla sí lo dice). Apagada si ya terminó. Al
 * tocarla se abre su detalle.
 */
export const MonthClassRow = memo(function MonthClassRow({ item, colors, club, status }: DayClassRowProps) {
  const styles = useStyles();
  const { t } = useTranslation();
  const openClass = useOpenClass();

  return (
    <PressableScale
      onPress={() => openClass(item)}
      accessibilityLabel={classA11yLabel(item, club.label, status, t)}
      accessibilityHint={t("schedule.detail.openHint")}
      style={[styles.row, status === "past" && styles.past]}
      testID={`month-class-${item.id}`}
    >
      <TimeSquare time={item.class_time} colors={colors} size={TIME_SQUARE_SIZE} />
      <View style={styles.content}>
        <Text variant="rowLabel" numberOfLines={2}>
          {item.title}
        </Text>
        <Text variant="meta" color="textSecondary" numberOfLines={1}>
          {durationMeta(item, t, [item.track_name, studentsLabel(item, t)])}
        </Text>
      </View>
      <View style={styles.chevron}>
        <Chevron />
      </View>
    </PressableScale>
  );
});
