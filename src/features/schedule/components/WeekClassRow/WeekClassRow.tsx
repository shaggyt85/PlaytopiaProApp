import { IconLoClock } from "@playtopia/icons/react-native";
import { memo } from "react";
import { View } from "react-native";

import { Chevron } from "@/shared/components/Chevron";
import { DiagonalGradient } from "@/shared/components/DiagonalGradient";
import { IconText } from "@/shared/components/IconText";
import { PressableScale } from "@/shared/components/PressableScale";
import { Text } from "@/shared/components/Text";
import { useOpenClass } from "@/shared/hooks/useOpenClass";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { studentsLabel } from "@/shared/utils/seatsLabel";

import { classA11yLabel } from "../../utils/classA11yLabel";
import { durationMeta } from "../../utils/classMeta";
import { occupancy } from "../../utils/occupancy";
import type { DayClassRowProps } from "../DayClassList";
import { STATUS_PILL_OF, StatusPill } from "../StatusPill";
import { TimeSquare } from "../TimeSquare";

import { TIME_SQUARE_SIZE, useStyles } from "./WeekClassRow.styles";

/**
 * Una clase en la vista Semana, como el prototipo final: la hora en su cuadrado
 * y la barra de ocupación con su color en el día (el mismo que en Día), el
 * título (hasta dos líneas), su marca («EN VIVO», «PRÓXIMA» o «COMPLETADA»),
 * «◷ 60 min · pista», «2/4» y la flecha. Sin el club, como en Día (el lector de
 * pantalla sí lo dice). Resaltada si está en curso o es la próxima, apagada si ya
 * terminó. Al tocarla se abre su detalle.
 *
 * `memo`: cada minuto solo se vuelve a pintar la fila que cambia de estado.
 */
export const WeekClassRow = memo(function WeekClassRow({ item, colors, club, status }: DayClassRowProps) {
  const styles = useStyles();
  const { t } = useTranslation();
  const openClass = useOpenClass();
  const pill = STATUS_PILL_OF[status];
  const highlighted = status === "live" || status === "next";

  return (
    <PressableScale
      onPress={() => openClass(item)}
      accessibilityLabel={classA11yLabel(item, club.label, status, t)}
      accessibilityHint={t("schedule.detail.openHint")}
      style={[styles.row, highlighted && styles.highlighted, status === "past" && styles.past]}
      testID={`week-class-${item.id}`}
    >
      <TimeSquare time={item.class_time} colors={colors} size={TIME_SQUARE_SIZE} />
      <View style={styles.content}>
        <Text variant="rowTitle" numberOfLines={2}>
          {item.title}
        </Text>
        {pill ? (
          <View style={styles.pills}>
            <StatusPill variant={pill} testID={`week-class-${item.id}-${pill}`} />
          </View>
        ) : null}
        <IconText
          Icon={IconLoClock}
          label={durationMeta(item, t, [item.track_name])}
          numberOfLines={1}
          style={styles.metaRow}
        />
        <View style={styles.seatsRow}>
          <View style={styles.bar}>
            <View style={[styles.barFill, { width: `${occupancy(item) * 100}%` }]} testID={`week-class-${item.id}-bar`}>
              <DiagonalGradient colors={colors.gradient} style={styles.fill} />
            </View>
          </View>
          <Text variant="chip" color="textSecondary">
            {studentsLabel(item, t)}
          </Text>
        </View>
      </View>
      <Chevron />
    </PressableScale>
  );
});
