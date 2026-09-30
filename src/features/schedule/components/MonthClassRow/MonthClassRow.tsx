import { memo } from "react";
import { View } from "react-native";

import { Text } from "@/shared/components/Text";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { joinParts } from "@/shared/utils/joinParts";

import { useOpenClass } from "../../hooks/useOpenClass";
import { classA11yLabel } from "../../utils/classA11yLabel";
import { seatsLabel } from "../../utils/seatsLabel";
import { ClubBadge } from "../ClubBadge";
import type { DayClassRowProps } from "../DayClassList";
import { PressableScale } from "../PressableScale";
import { TimeSquare } from "../TimeSquare";

import { TIME_SQUARE_SIZE, useStyles } from "./MonthClassRow.styles";

/**
 * Una clase en la lista del día de la vista Mes (la captura): la hora en su
 * cuadrado, el título con la pastilla del club y «Wave Padel Club · Pista 2 ·
 * 2/4». Más sencilla que la de Semana: sin barra ni flecha. Apagada si ya
 * terminó. Al tocarla se abre su detalle.
 */
export const MonthClassRow = memo(function MonthClassRow({ item, club, status }: DayClassRowProps) {
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
      <TimeSquare time={item.class_time} colors={club.colors} size={TIME_SQUARE_SIZE} />
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text variant="rowTitle" numberOfLines={1} style={styles.title}>
            {item.title}
          </Text>
          <ClubBadge club={club} size="mini" />
        </View>
        <Text variant="meta" color="textSecondary" numberOfLines={1}>
          {joinParts([club.label, item.track_name, seatsLabel(item)])}
        </Text>
      </View>
    </PressableScale>
  );
});
