import { View } from "react-native";

import { Text } from "@/shared/components/Text";
import type { IconComponent } from "@/shared/config/icons";
import { useTheme } from "@/shared/hooks/useTheme";
import { useTranslation } from "@/shared/hooks/useTranslation";

import { ICON_SIZE, useStyles } from "./StatTile.styles";

interface StatTileProps {
  Icon: IconComponent;
  /** El valor: «2/4», «2.5 - 3». */
  value: string;
  /** Ya traducido: «Alumnos». */
  label: string;
}

/** Una cifra de la cabecera del detalle: el icono, el valor y lo que es, sobre el degradado del club. */
export function StatTile({ Icon, value, label }: StatTileProps) {
  const styles = useStyles();
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <View style={styles.tile} accessible accessibilityLabel={t("schedule.detail.stat", { label, value })}>
      <View style={styles.icon}>
        <Icon size={ICON_SIZE} color={theme.colors.onPrimary} />
      </View>
      <Text variant="statValue" color="onPrimary" numberOfLines={1}>
        {value}
      </Text>
      <Text variant="statLabel" color="onPrimary" style={styles.label}>
        {label}
      </Text>
    </View>
  );
}
