import { memo } from "react";

import { Text } from "@/shared/components/Text";
import type { ColorPair } from "@/shared/config/theme";
import { formatClubTime } from "@/shared/utils/formatDate";

import { GradientSquare } from "../GradientSquare";

interface TimeSquareProps {
  /** `class_time` de Core ("08:30:00"). */
  time: string;
  /** Los colores de su club. */
  colors: ColorPair;
  /** El lado: 56 en Semana (`h-14 w-14`) y 48 en Mes (`h-12 w-12`). */
  size: number;
}

/** La hora de una clase en su cuadrado con el degradado del club, delante de su fila en Semana y en Mes. */
export const TimeSquare = memo(function TimeSquare({ time, colors, size }: TimeSquareProps) {
  return (
    <GradientSquare colors={colors} size={size} testID="time-square">
      <Text variant="timeBadge" color="onPrimary">
        {formatClubTime(time)}
      </Text>
    </GradientSquare>
  );
});
