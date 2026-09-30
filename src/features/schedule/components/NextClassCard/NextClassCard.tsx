import { IconLoChevronRight } from "@playtopia/icons/react-native";
import { useState } from "react";
import { View, type LayoutChangeEvent } from "react-native";

import { DiagonalGradient } from "@/shared/components/DiagonalGradient";
import { RadialGlow } from "@/shared/components/RadialGlow";
import { Text } from "@/shared/components/Text";
import { useTheme } from "@/shared/hooks/useTheme";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { joinParts } from "@/shared/utils/joinParts";

import { useOpenClass } from "../../hooks/useOpenClass";
import type { ScheduleClub } from "../../hooks/useScheduleClubs";
import type { NextClass } from "../../schemas/schedule.schema";
import { classA11yLabel } from "../../utils/classA11yLabel";
import { classMeta } from "../../utils/classMeta";
import { relativeDay } from "../../utils/relativeDay";
import { ClubDot } from "../ClubDot";
import { PressableScale } from "../PressableScale";
import { StudentAvatars } from "../StudentAvatars";

import { CHEVRON_SIZE, CORNER_GLOW, useStyles } from "./NextClassCard.styles";

/** El `gradient-ink` del prototipo va a 160°, no a 135°. */
const INK_ANGLE = 160;

interface NextClassCardProps {
  item: NextClass;
  club: ScheduleClub;
  /** Hoy, `YYYY-MM-DD`: si la clase es otro día, se dice cuál. */
  today: string;
}

/**
 * La tarjeta de la próxima clase, encima de la agenda (la captura): la marca
 * «● PRÓXIMA CLASE», el título, el club con su punto y la pista, «hora ·
 * duración · nivel» (con «Mañana» o «lunes 25» si no es hoy), los alumnos y
 * «3/4 alumnos». Al tocarla se abre su detalle.
 */
export function NextClassCard({ item, club, today }: NextClassCardProps) {
  const styles = useStyles();
  const theme = useTheme();
  const { t } = useTranslation();
  const openClass = useOpenClass();
  const [size, setSize] = useState({ width: 0, height: 0 });

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (width !== size.width || height !== size.height)
      setSize({ width, height });
  };

  const day = relativeDay(item.class_date, today, t);
  const level = t("schedule.next.level", { range: item.level_range });
  const seats = t("schedule.next.students", {
    taken: item.current_participants,
    max: item.max_participants,
  });
  const label = joinParts(
    [day, classA11yLabel(item, club.label, "next", t), level],
    ", ",
  );

  return (
    <PressableScale
      onPress={() => openClass(item)}
      accessibilityLabel={label}
      accessibilityHint={t("schedule.detail.openHint")}
      testID="next-class"
    >
      <View style={styles.card} onLayout={onLayout}>
        <DiagonalGradient
          colors={theme.gradients.ink}
          angle={INK_ANGLE}
          style={styles.fill}
        />
        <RadialGlow
          width={size.width}
          height={size.height}
          glows={[
            {
              color: theme.colors.primary,
              opacity: CORNER_GLOW.opacity,
              cx: size.width + CORNER_GLOW.fromRight,
              cy: CORNER_GLOW.fromTop,
              r: CORNER_GLOW.radius,
              reach: 1,
            },
          ]}
        />

        <View style={styles.content}>
          <View style={styles.labelRow}>
            <View style={styles.labelDot} />
            <Text variant="chip" color="primary">
              {t("schedule.next.title")}
            </Text>
          </View>
          <Text variant="subtitle" numberOfLines={1}>
            {item.title}
          </Text>
          <View style={styles.clubRow}>
            <ClubDot color={club.colors.color} />
            {club.label ? (
              <Text variant="mark" numberOfLines={1} style={styles.clubName}>
                {club.label}
              </Text>
            ) : null}
            {item.track_name ? (
              <Text variant="mark" color="primary" numberOfLines={1}>
                {club.label ? `· ${item.track_name}` : item.track_name}
              </Text>
            ) : null}
          </View>
          <Text variant="meta" color="textSecondary" numberOfLines={1}>
            {joinParts([day, classMeta(item, t, [level])])}
          </Text>
          <View style={styles.studentsRow}>
            <StudentAvatars students={item.students} />
            <Text variant="meta" color="textSecondary">
              {seats}
            </Text>
          </View>
        </View>

        <IconLoChevronRight
          size={CHEVRON_SIZE}
          color={theme.colors.textSecondary}
        />
      </View>
    </PressableScale>
  );
}
