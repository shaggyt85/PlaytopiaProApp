import { IconLoArrowLeft, IconLoClock, IconLoFileText, IconLoMapPin, IconLoUsers } from "@playtopia/icons/react-native";
import { useState } from "react";
import { View, type LayoutChangeEvent } from "react-native";

import { DiagonalGradient } from "@/shared/components/DiagonalGradient";
import { IconButton } from "@/shared/components/IconButton";
import { IconText } from "@/shared/components/IconText";
import { RadialGlow } from "@/shared/components/RadialGlow";
import { Text } from "@/shared/components/Text";
import type { IconComponent } from "@/shared/config/icons";
import { useTheme } from "@/shared/hooks/useTheme";
import { useTranslation } from "@/shared/hooks/useTranslation";
import type { TranslationKey } from "@/shared/locales";
import { formatClassDate } from "@/shared/utils/formatDate";
import { joinParts } from "@/shared/utils/joinParts";

import type { ScheduleClub } from "../../hooks/useScheduleClubs";
import type { ScheduleClass } from "../../schemas/schedule.schema";
import { classTimeRange } from "../../utils/classTimeRange";
import { seatsLabel } from "../../utils/seatsLabel";
import { ClubDot } from "../ClubDot";
import { StatTile } from "../StatTile";

import { BACK_SIZE, CORNER_GLOW, useStyles } from "./ClassHero.styles";

interface HeroStat {
  Icon: IconComponent;
  label: TranslationKey;
  value: (c: ScheduleClass) => string;
}

/**
 * Las cifras de la cabecera, en orden. Solo las que tienen datos: «Objetivos»
 * vuelve cuando existan los planes, como una entrada más aquí.
 */
const HERO_STATS: readonly HeroStat[] = [
  { Icon: IconLoUsers, label: "schedule.detail.students", value: seatsLabel },
  { Icon: IconLoFileText, label: "schedule.detail.level", value: (c) => c.level_range },
];

interface ClassHeroProps {
  item: ScheduleClass;
  club: ScheduleClub;
  onBack: () => void;
}

/**
 * La cabecera del detalle de una clase (la captura): el degradado de su club con
 * el halo en la esquina, ← y el nivel, el título, el club con su punto, «Lunes,
 * 18 de noviembre · 08:30–09:30» y la pista, y las cifras.
 */
export function ClassHero({ item, club, onBack }: ClassHeroProps) {
  const styles = useStyles();
  const theme = useTheme();
  const { t } = useTranslation();
  const [size, setSize] = useState({ width: 0, height: 0 });

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (width !== size.width || height !== size.height) setSize({ width, height });
  };

  return (
    <View style={styles.card} onLayout={onLayout} testID="class-hero">
      <DiagonalGradient colors={club.colors.gradient} style={styles.fill} />
      <RadialGlow
        width={size.width}
        height={size.height}
        glows={[
          {
            color: theme.colors.onPrimary,
            opacity: CORNER_GLOW.opacity,
            cx: size.width + CORNER_GLOW.fromRight,
            cy: CORNER_GLOW.fromTop,
            r: CORNER_GLOW.radius,
            reach: 1,
          },
        ]}
      />

      <View style={styles.top}>
        <IconButton
          Icon={IconLoArrowLeft}
          size={BACK_SIZE}
          variant="onColor"
          accessibilityLabel={t("common.back")}
          onPress={onBack}
        />
        <View style={styles.pill}>
          <Text variant="chip" color="onPrimary">
            {item.level_range}
          </Text>
        </View>
      </View>

      <Text variant="title" color="onPrimary" accessibilityRole="header" style={styles.title}>
        {item.title}
      </Text>
      {club.label ? (
        <View style={styles.clubRow}>
          <ClubDot color={club.colors.color} ring />
          <Text variant="labelStrong" color="onPrimary" numberOfLines={1} style={styles.soft}>
            {club.label}
          </Text>
        </View>
      ) : null}

      <View style={styles.metaRow}>
        <IconText
          Icon={IconLoClock}
          label={joinParts([formatClassDate(item.class_date), classTimeRange(item, t)])}
          size="hero"
          color="onPrimary"
          textStyle={styles.soft}
        />
        {item.track_name ? (
          <IconText Icon={IconLoMapPin} label={item.track_name} size="hero" color="onPrimary" textStyle={styles.soft} />
        ) : null}
      </View>

      <View style={styles.stats}>
        {HERO_STATS.map(({ Icon, label, value }) => (
          <StatTile key={label} Icon={Icon} value={value(item)} label={t(label)} />
        ))}
      </View>
    </View>
  );
}
