import { View } from "react-native";

import { Text } from "@/shared/components/Text";
import type { IconComponent } from "@/shared/config/icons";
import { useTranslation } from "@/shared/hooks/useTranslation";

import { ICON_SIZE, useStyles } from "./StatTile.styles";

interface StatTileProps {
  Icon: IconComponent;
  /** El valor: «3», «14», «5:50 h». */
  value: string;
  /** Ya traducido: «clases hoy», «alumnos hoy». */
  label: string;
  /** El color del icono y de la cifra (`text-magenta`, `text-sky`, `text-gold`). */
  color: string;
}

/**
 * Una cifra del día encima de la agenda (el `Kpi` de Lovable): el icono y la
 * cifra en su color y, debajo, lo que es en gris, en una línea. El lector de
 * pantalla las dice juntas: «clases hoy: 3».
 */
export function StatTile({ Icon, value, label, color }: StatTileProps) {
  const styles = useStyles();
  const { t } = useTranslation();

  return (
    <View style={styles.tile} accessible accessibilityLabel={t("schedule.detail.stat", { label, value })}>
      <View style={styles.head}>
        <Icon size={ICON_SIZE} color={color} />
        <Text variant="statValue" numberOfLines={1} style={{ color }}>
          {value}
        </Text>
      </View>
      <Text variant="statLabel" color="textSecondary" numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}
