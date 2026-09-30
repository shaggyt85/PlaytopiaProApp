import { IconLoMapPin } from "@playtopia/icons/react-native";
import { View } from "react-native";

import { Text } from "@/shared/components/Text";
import { useTheme } from "@/shared/hooks/useTheme";
import { useTranslation } from "@/shared/hooks/useTranslation";
import type { SchoolCard } from "@/shared/schemas/schoolCard.schema";
import { joinParts } from "@/shared/utils/joinParts";

import type { ScheduleClub } from "../../hooks/useScheduleClubs";
import { ClubDot } from "../ClubDot";
import { GradientSquare } from "../GradientSquare";

import { PIN_SIZE, SQUARE_SIZE, useStyles } from "./ClubCard.styles";

interface ClubCardProps {
  /** El nombre y el color del club (`clubOf`). */
  club: ScheduleClub;
  /** Su tarjeta de sede de «Mis clubes» (`cardOf`): la dirección. */
  card: Pick<SchoolCard, "address">;
}

/**
 * El club de la clase en su detalle (la captura): el cuadrado con su degradado y
 * su punto (el emoji del club en el prototipo), el nombre y la calle. Sin
 * teléfono ni minutos en coche por ahora. Se lee de una vez.
 */
export function ClubCard({ club, card }: ClubCardProps) {
  const styles = useStyles();
  const theme = useTheme();
  const { t } = useTranslation();
  const address = card.address.trim();

  return (
    <View
      style={styles.card}
      accessible
      accessibilityLabel={t("schedule.detail.clubA11y", { details: joinParts([club.label, address], ", ") })}
      testID="club-card"
    >
      <GradientSquare colors={club.colors} size={SQUARE_SIZE}>
        <ClubDot color={club.colors.color} ring size="lg" />
      </GradientSquare>
      <View style={styles.content}>
        <Text variant="smallTitle" numberOfLines={1}>
          {club.label}
        </Text>
        {address ? (
          <View style={styles.addressRow}>
            <IconLoMapPin size={PIN_SIZE} color={theme.colors.textSecondary} />
            <Text variant="meta" color="textSecondary" numberOfLines={1} style={styles.address}>
              {address}
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}
