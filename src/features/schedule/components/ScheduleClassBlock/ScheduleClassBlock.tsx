import {
  IconLoActivity,
  IconLoChevronRight,
  IconLoClock,
  IconLoMapPin,
  IconLoUsers,
} from "@playtopia/icons/react-native";
import { memo } from "react";
import { View } from "react-native";

import { DiagonalGradient } from "@/shared/components/DiagonalGradient";
import { IconText } from "@/shared/components/IconText";
import { PressableScale } from "@/shared/components/PressableScale";
import { StripeCard } from "@/shared/components/StripeCard";
import { Text } from "@/shared/components/Text";
import type { ColorPair } from "@/shared/config/theme";
import { useOpenClass } from "@/shared/hooks/useOpenClass";
import type { ScheduleClub } from "@/shared/hooks/useScheduleClubs";
import { useTheme } from "@/shared/hooks/useTheme";
import { useTranslation } from "@/shared/hooks/useTranslation";
import type { ScheduleClass } from "@/shared/schemas/schedule.schema";
import { studentsLabel } from "@/shared/utils/seatsLabel";

import { classA11yLabel } from "../../utils/classA11yLabel";
import type { ClassStatus } from "../../utils/classTiming";
import type { BlockGeometry } from "../../utils/timelineGeometry";
import { STATUS_PILL_OF, StatusPill } from "../StatusPill";

import { CHEVRON_SIZE, useStyles } from "./ScheduleClassBlock.styles";

interface ScheduleClassBlockProps {
  item: ScheduleClass;
  /** Su color en el día (por su orden, en ciclo): la franja. */
  colors: ColorPair;
  /** Su club: lo dice el lector de pantalla. */
  club: ScheduleClub;
  status: ClassStatus;
  geometry: BlockGeometry;
}

/**
 * Una clase en la tira del día, como el prototipo final: la tarjeta oscura con
 * la franja de su color a la izquierda (cada clase el suyo, por su orden en el
 * día, para dar vida a la agenda; la de la próxima, con el degradado de marca),
 * su marca de estado, el título, la pista y «duración · nivel · plazas». Sin el
 * nombre del club, como el prototipo (el lector de pantalla sí lo dice).
 * La que ya terminó, apagada y «COMPLETADA». Al tocarla se abre su detalle.
 *
 * Provisional: el nivel lleva `IconLoActivity` hasta que `@playtopia/icons`
 * publique `IconLoBarChart2` (1.10.0).
 *
 * `memo`: cuando la hora avanza, solo se vuelve a pintar la que cambia de estado.
 */
export const ScheduleClassBlock = memo(function ScheduleClassBlock({
  item,
  colors,
  club,
  status,
  geometry,
}: ScheduleClassBlockProps) {
  const styles = useStyles();
  const theme = useTheme();
  const { t } = useTranslation();
  const openClass = useOpenClass();
  const next = status === "next";
  const pill = STATUS_PILL_OF[status];

  return (
    <View
      style={[
        styles.slot,
        { top: geometry.top, height: geometry.height },
        status === "past" && styles.past,
      ]}
      testID={`class-${item.id}`}
    >
      <PressableScale
        onPress={() => openClass(item)}
        accessibilityLabel={classA11yLabel(item, club.label, status, t)}
        accessibilityHint={t("schedule.detail.openHint")}
        style={[styles.press, next ? styles.nextGlow : styles.lifted]}
        testID={`class-${item.id}-card`}
      >
        <StripeCard
          stripe={next ? theme.gradients.brand : colors.gradient}
          radius="lg"
          style={[styles.card, next && styles.nextRing]}
        >
          <DiagonalGradient colors={theme.gradients.classCard} style={styles.fill} />
          <View style={styles.content}>
            {pill ? (
              <View style={styles.pills}>
                <StatusPill variant={pill} testID={`class-${item.id}-${pill}`} />
              </View>
            ) : null}
            <Text variant="rowTitle" numberOfLines={1}>
              {item.title}
            </Text>
            {item.track_name ? <IconText Icon={IconLoMapPin} label={item.track_name} numberOfLines={1} /> : null}
            <View style={styles.metaRow}>
              <IconText Icon={IconLoClock} label={t("schedule.day.minutes", { count: item.duration_minutes })} />
              <IconText Icon={IconLoActivity} label={item.level_range} />
              <IconText Icon={IconLoUsers} label={studentsLabel(item, t)} />
            </View>
          </View>
          <View style={styles.chevron}>
            <IconLoChevronRight size={CHEVRON_SIZE} color={theme.colors.textSecondary} />
          </View>
        </StripeCard>
      </PressableScale>
    </View>
  );
});
