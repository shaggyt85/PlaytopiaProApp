import { memo } from "react";
import { View } from "react-native";

import { Text } from "@/shared/components/Text";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { joinParts } from "@/shared/utils/joinParts";

import { classA11yLabel } from "../../utils/classA11yLabel";
import { seatsLabel } from "../../utils/seatsLabel";
import { ClubBadge } from "../ClubBadge";
import type { DayClassRowProps } from "../DayClassList";
import { TimeSquare } from "../TimeSquare";

import { TIME_SQUARE_SIZE, useStyles } from "./MonthClassRow.styles";

/**
 * Una clase en la lista del día de la vista Mes (la captura): la hora en su
 * cuadrado, el título con la pastilla del club y «Wave Padel Club · Pista 2 ·
 * 2/4». Más sencilla que la de Semana: sin barra ni flecha. Apagada si ya
 * terminó. Aún no se puede tocar.
 */
export const MonthClassRow = memo(function MonthClassRow({ item, club, status }: DayClassRowProps) {
  const styles = useStyles();
  const { t } = useTranslation();

  return (
    <View
      style={[styles.row, status === "past" && styles.past]}
      accessible
      accessibilityLabel={classA11yLabel(item, club.label, status, t)}
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
    </View>
  );
});
