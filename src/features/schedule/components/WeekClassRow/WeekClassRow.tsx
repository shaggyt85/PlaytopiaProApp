import { IconLoChevronRight, IconLoClock } from "@playtopia/icons/react-native";
import { memo } from "react";
import { View } from "react-native";

import { DiagonalGradient } from "@/shared/components/DiagonalGradient";
import { IconText } from "@/shared/components/IconText";
import { Text } from "@/shared/components/Text";
import { useTheme } from "@/shared/hooks/useTheme";
import { useTranslation } from "@/shared/hooks/useTranslation";

import { useOpenClass } from "../../hooks/useOpenClass";
import type { ScheduleClub } from "../../hooks/useScheduleClubs";
import type { ScheduleClass } from "../../schemas/schedule.schema";
import { classA11yLabel } from "../../utils/classA11yLabel";
import { durationMeta } from "../../utils/classMeta";
import type { ClassStatus } from "../../utils/classTiming";
import { occupancy } from "../../utils/occupancy";
import { seatsLabel } from "../../utils/seatsLabel";
import { ClubBadge } from "../ClubBadge";
import { PressableScale } from "../PressableScale";
import { StatusPill } from "../StatusPill";
import { TimeSquare } from "../TimeSquare";

import { CHEVRON_SIZE, TIME_SQUARE_SIZE, useStyles } from "./WeekClassRow.styles";

interface WeekClassRowProps {
  item: ScheduleClass;
  club: ScheduleClub;
  status: ClassStatus;
}

/**
 * Una clase en la vista Semana (las capturas): la hora en su cuadrado, el
 * título con la pastilla del club y «EN VIVO» si está en curso, «60 min · club ·
 * pista», la barra de ocupación con «2/4» y la flecha. Apagada si ya terminó,
 * como en Día. Al tocarla se abre su detalle.
 *
 * `memo`: cada minuto solo se vuelve a pintar la fila que cambia de estado.
 */
export const WeekClassRow = memo(function WeekClassRow({ item, club, status }: WeekClassRowProps) {
  const styles = useStyles();
  const theme = useTheme();
  const { t } = useTranslation();
  const openClass = useOpenClass();
  const live = status === "live";

  return (
    <PressableScale
      onPress={() => openClass(item)}
      accessibilityLabel={classA11yLabel(item, club.label, status, t)}
      accessibilityHint={t("schedule.detail.openHint")}
      style={[styles.row, live && styles.live, status === "past" && styles.past]}
      testID={`week-class-${item.id}`}
    >
      <TimeSquare time={item.class_time} colors={club.colors} size={TIME_SQUARE_SIZE} />
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text variant="rowTitle" numberOfLines={1} style={styles.title}>
            {item.title}
          </Text>
          <ClubBadge club={club} size="mini" />
          {live ? <StatusPill variant="live" testID={`week-class-${item.id}-live`} /> : null}
        </View>
        <IconText
          Icon={IconLoClock}
          label={durationMeta(item, t, [club.label, item.track_name])}
          numberOfLines={1}
          style={styles.metaRow}
        />
        <View style={styles.seatsRow}>
          <View style={styles.bar}>
            <View style={[styles.barFill, { width: `${occupancy(item) * 100}%` }]} testID={`week-class-${item.id}-bar`}>
              <DiagonalGradient colors={club.colors.gradient} style={styles.fill} />
            </View>
          </View>
          <Text variant="chip" color="textSecondary">
            {seatsLabel(item)}
          </Text>
        </View>
      </View>
      <IconLoChevronRight size={CHEVRON_SIZE} color={theme.colors.textSecondary} />
    </PressableScale>
  );
});
