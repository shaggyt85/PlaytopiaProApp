import { IconLoActivity, IconLoArrowLeft, IconLoClock, IconLoMapPin, IconLoUsers } from "@playtopia/icons/react-native";
import { useState } from "react";
import { View, type LayoutChangeEvent } from "react-native";

import { DiagonalGradient } from "@/shared/components/DiagonalGradient";
import { IconButton } from "@/shared/components/IconButton";
import { IconText } from "@/shared/components/IconText";
import { RadialGlow } from "@/shared/components/RadialGlow";
import { Text } from "@/shared/components/Text";
import type { ColorPair } from "@/shared/config/theme";
import { useTheme } from "@/shared/hooks/useTheme";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { formatClassDate } from "@/shared/utils/formatDate";
import { joinParts } from "@/shared/utils/joinParts";

import type { ScheduleClass } from "../../schemas/schedule.schema";
import { classTimeRange } from "../../utils/classTimeRange";
import { studentsLabel } from "../../utils/seatsLabel";
import { ClubDot } from "../ClubDot";

import { BACK_SIZE, CORNER_GLOW, useStyles } from "./ClassHero.styles";

interface ClassHeroProps {
  item: ScheduleClass;
  /** El nombre del club (`clubOf(item).label`); vacío si la sede ya no está en «Mis clubes». */
  clubLabel: string;
  /** El color de la clase en su día (`useClassDetail`), el mismo que en la agenda. */
  colors: ColorPair;
  onBack: () => void;
}

/**
 * La cabecera compacta del detalle de una clase, como el prototipo: el degradado
 * de la clase con el halo en la esquina, ←, el título, el club con su punto y
 * dos líneas de datos: «Lunes, 18 de noviembre · 08:30–09:30» y la pista, el
 * nivel y «3/4 alumnos».
 *
 * Provisional: el nivel lleva `IconLoActivity` hasta que `@playtopia/icons`
 * publique `IconLoBarChart2` (1.10.0).
 */
export function ClassHero({ item, clubLabel, colors, onBack }: ClassHeroProps) {
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
      <DiagonalGradient colors={colors.gradient} style={styles.fill} />
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

      <IconButton
        Icon={IconLoArrowLeft}
        size={BACK_SIZE}
        variant="onColor"
        accessibilityLabel={t("common.back")}
        onPress={onBack}
      />

      <Text variant="subtitle" color="onPrimary" accessibilityRole="header" style={styles.title}>
        {item.title}
      </Text>
      {clubLabel ? (
        <View style={styles.clubRow}>
          <ClubDot color={theme.colors.onPrimary} />
          <Text variant="labelStrong" color="onPrimary" numberOfLines={1} style={styles.soft}>
            {clubLabel}
          </Text>
        </View>
      ) : null}

      <View style={styles.meta}>
        <IconText
          Icon={IconLoClock}
          label={joinParts([formatClassDate(item.class_date), classTimeRange(item, t)])}
          size="hero"
          color="onPrimary"
        />
        <View style={styles.metaRow}>
          {item.track_name ? (
            <IconText Icon={IconLoMapPin} label={item.track_name} size="hero" color="onPrimary" />
          ) : null}
          <IconText Icon={IconLoActivity} label={item.level_range} size="hero" color="onPrimary" />
          <IconText Icon={IconLoUsers} label={studentsLabel(item, t)} size="hero" color="onPrimary" />
        </View>
      </View>
    </View>
  );
}
