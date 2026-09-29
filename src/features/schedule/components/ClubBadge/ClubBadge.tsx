import { View } from "react-native";

import { DiagonalGradient } from "@/shared/components/DiagonalGradient";
import { Text } from "@/shared/components/Text";

import type { ScheduleClub } from "../../hooks/useScheduleClubs";
import { ClubDot } from "../ClubDot";

import { LABEL_VARIANT, useStyles, type ClubBadgeSize } from "./ClubBadge.styles";

interface ClubBadgeProps {
  club: ScheduleClub;
  /** `legend` en la fila «CLUBES»; `mini` en las filas de Semana y Mes. */
  size: ClubBadgeSize;
}

/**
 * La pastilla de un club con su degradado, su punto y su nombre (el
 * `ClubBadgeMini` del prototipo). Sin nombre (una sede que ya no está en «Mis
 * clubes») no sale.
 */
export function ClubBadge({ club, size }: ClubBadgeProps) {
  const styles = useStyles();
  if (!club.label) return null;

  return (
    <View style={styles[size]} testID="club-badge">
      <DiagonalGradient colors={club.colors.gradient} style={styles.fill} />
      <ClubDot color={club.colors.color} ring />
      <Text variant={LABEL_VARIANT[size]} color="onPrimary" numberOfLines={1} style={styles.label}>
        {club.label}
      </Text>
    </View>
  );
}
