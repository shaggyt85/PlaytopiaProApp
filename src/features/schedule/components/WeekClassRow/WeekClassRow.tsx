import { IconLoChevronRight, IconLoClock } from "@playtopia/icons/react-native";
import { memo } from "react";
import { View } from "react-native";

import { DiagonalGradient } from "@/shared/components/DiagonalGradient";
import { Text } from "@/shared/components/Text";
import { useTheme } from "@/shared/hooks/useTheme";
import { useTranslation } from "@/shared/hooks/useTranslation";

import type { ScheduleClub } from "../../hooks/useScheduleClubs";
import type { ScheduleClass } from "../../schemas/schedule.schema";
import { classA11yLabel } from "../../utils/classA11yLabel";
import { durationMeta } from "../../utils/classMeta";
import type { ClassStatus } from "../../utils/classTiming";
import { occupancy } from "../../utils/occupancy";
import { ClubBadge } from "../ClubBadge";
import { TimeSquare } from "../TimeSquare";

import { CHEVRON_SIZE, CLOCK_SIZE, TIME_SQUARE_SIZE, useStyles } from "./WeekClassRow.styles";

interface WeekClassRowProps {
  item: ScheduleClass;
  club: ScheduleClub;
  status: ClassStatus;
}

/**
 * Una clase en la vista Semana (las capturas): la hora en su cuadrado, el
 * título con la pastilla del club y «EN VIVO» si está en curso, «60 min · club ·
 * pista», la barra de ocupación con «2/4» y la flecha. Apagada si ya terminó,
 * como en Día. Aún no se puede tocar: el detalle de la clase llega en su paso.
 *
 * `memo`: cada minuto solo se vuelve a pintar la fila que cambia de estado.
 */
export const WeekClassRow = memo(function WeekClassRow({ item, club, status }: WeekClassRowProps) {
  const styles = useStyles();
  const theme = useTheme();
  const { t } = useTranslation();
  const live = status === "live";

  return (
    <View
      style={[styles.row, live && styles.live, status === "past" && styles.past]}
      accessible
      accessibilityLabel={classA11yLabel(item, club.label, status, t)}
      testID={`week-class-${item.id}`}
    >
      <TimeSquare time={item.class_time} colors={club.colors} size={TIME_SQUARE_SIZE} />
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text variant="rowTitle" numberOfLines={1} style={styles.title}>
            {item.title}
          </Text>
          <ClubBadge club={club} size="mini" />
          {live ? (
            <View style={styles.livePill} testID={`week-class-${item.id}-live`}>
              <Text variant="statusBadge" color="onPrimary">
                {t("schedule.week.live")}
              </Text>
            </View>
          ) : null}
        </View>
        <View style={styles.metaRow}>
          <IconLoClock size={CLOCK_SIZE} color={theme.colors.textSecondary} />
          <Text variant="meta" color="textSecondary" numberOfLines={1} style={styles.meta}>
            {durationMeta(item, t, [club.label, item.track_name])}
          </Text>
        </View>
        <View style={styles.seatsRow}>
          <View style={styles.bar}>
            <View style={[styles.barFill, { width: `${occupancy(item) * 100}%` }]} testID={`week-class-${item.id}-bar`}>
              <DiagonalGradient colors={club.colors.gradient} style={styles.fill} />
            </View>
          </View>
          <Text variant="chip" color="textSecondary">
            {`${item.current_participants}/${item.max_participants}`}
          </Text>
        </View>
      </View>
      <IconLoChevronRight size={CHEVRON_SIZE} color={theme.colors.textSecondary} />
    </View>
  );
});
