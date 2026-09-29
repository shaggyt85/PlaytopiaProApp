import { memo } from "react";
import { View } from "react-native";

import { DiagonalGradient } from "@/shared/components/DiagonalGradient";
import { glow } from "@/shared/config/theme";
import { Text } from "@/shared/components/Text";
import { useTranslation } from "@/shared/hooks/useTranslation";

import type { ScheduleClub } from "../../hooks/useScheduleClubs";
import type { ScheduleClass } from "../../schemas/schedule.schema";
import { classA11yLabel } from "../../utils/classA11yLabel";
import { classMeta } from "../../utils/classMeta";
import type { ClassStatus } from "../../utils/classTiming";
import type { Placement } from "../../utils/dayLayout";
import type { BlockGeometry } from "../../utils/timelineGeometry";
import { BLOCK_DETAIL_MIN_HEIGHT } from "../../utils/timelineMetrics";
import { ClubDot } from "../ClubDot";

import { useStyles } from "./ScheduleClassBlock.styles";

// En Android la sombra (`elevation`) solo se pinta con fondo: el del color del
// club, que el degradado tapa.
const nextGlow = (color: string) => ({ ...glow(color), backgroundColor: color });

interface ScheduleClassBlockProps {
  item: ScheduleClass;
  club: ScheduleClub;
  status: ClassStatus;
  geometry: BlockGeometry;
  placement: Placement;
}

/**
 * Una clase en la tira del día, con el degradado de su club: título, «hora ·
 * duración · pista» y, si cabe, el club y las plazas. Apagada si ya terminó y
 * con «PRÓXIMA» si es la que dice Core. Aún no se puede tocar: el detalle de la
 * clase llega en su propio paso.
 *
 * `memo`: cuando la hora avanza, solo se vuelve a pintar la que cambia de estado.
 */
export const ScheduleClassBlock = memo(function ScheduleClassBlock({
  item,
  club,
  status,
  geometry,
  placement,
}: ScheduleClassBlockProps) {
  const styles = useStyles();
  const { t } = useTranslation();
  const width = 100 / placement.columns;
  const meta = classMeta(item, t, [item.track_name]);

  return (
    <View
      style={[
        styles.slot,
        { top: geometry.top, height: geometry.height, left: `${placement.column * width}%`, width: `${width}%` },
        status === "past" && styles.past,
      ]}
      accessible
      accessibilityLabel={classA11yLabel(item, club.label, status, t)}
      testID={`class-${item.id}`}
    >
      <View
        style={[styles.card, status === "next" && [styles.next, nextGlow(club.colors.color)]]}
        testID={`class-${item.id}-card`}
      >
        <DiagonalGradient colors={club.colors.gradient} style={styles.fill} />
        <View style={styles.header}>
          <Text variant="mark" color="onPrimary" numberOfLines={1} style={styles.title}>
            {item.title}
          </Text>
          {status === "next" ? (
            <View style={[styles.pill, styles.nextPill]} testID={`class-${item.id}-next`}>
              <Text variant="badge" color="onPrimary">
                {t("schedule.day.next")}
              </Text>
            </View>
          ) : null}
        </View>
        <Text variant="tab" color="onPrimary" numberOfLines={1} style={styles.meta}>
          {meta}
        </Text>
        {geometry.height > BLOCK_DETAIL_MIN_HEIGHT ? (
          <View style={styles.details} testID={`class-${item.id}-details`}>
            {club.label ? (
              <View style={[styles.pill, styles.clubPill]} testID={`class-${item.id}-club`}>
                <ClubDot color={club.colors.color} />
                <Text variant="badge" color="onPrimary" numberOfLines={1}>
                  {club.label}
                </Text>
              </View>
            ) : null}
            <Text variant="tab" color="onPrimary">
              {`${item.current_participants}/${item.max_participants}`}
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
});
