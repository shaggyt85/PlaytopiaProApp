import { memo } from "react";
import { View } from "react-native";

import { Text } from "@/shared/components/Text";
import { useTranslation } from "@/shared/hooks/useTranslation";

import type { LegendClub } from "../../hooks/useScheduleClubs";
import { ClubBadge } from "../ClubBadge";

import { useStyles } from "./ClubLegend.styles";

interface ClubLegendProps {
  clubs: readonly LegendClub[];
}

/**
 * La fila «CLUBES» del prototipo: una pastilla por club de «Mis clubes» con su
 * color, para saber de qué club es cada clase. No filtra. `memo`: la lista es
 * estable, así el reloj de la pantalla no la vuelve a pintar cada minuto. Sin
 * clubes no sale.
 */
export const ClubLegend = memo(function ClubLegend({ clubs }: ClubLegendProps) {
  const styles = useStyles();
  const { t } = useTranslation();
  if (clubs.length === 0) return null;

  return (
    <View style={styles.container} testID="club-legend">
      <Text variant="chip" color="textSecondary">
        {t("schedule.legend")}
      </Text>
      {clubs.map((club) => (
        <ClubBadge key={club.key} club={club} size="legend" />
      ))}
    </View>
  );
});
