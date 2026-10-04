import { View } from "react-native";

import { Text } from "@/shared/components/Text";
import type { IconComponent } from "@/shared/config/icons";
import { useTheme } from "@/shared/hooks/useTheme";
import { useTranslation } from "@/shared/hooks/useTranslation";

import { ICON_SIZE, STAT_TILE_TEXT, useStyles } from "./StatTile.styles";

type StatTileProps = {
  Icon: IconComponent;
  /** El valor: «2/4», «2.5 - 3», «5:50 h». */
  value: string;
  /** Ya traducido: «Alumnos», «clases hoy». */
  label: string;
} & (
  | {
      /** La cabecera del detalle (por defecto): todo en blanco sobre el degradado del club. */
      variant?: "hero";
    }
  | {
      /** La fila del día encima de la agenda: el icono y la cifra en su color, el texto en gris. */
      variant: "today";
      /** El color del icono y de la cifra (`text-magenta`, `text-sky`, `text-gold`). */
      color: string;
    }
);

/**
 * Una cifra con su icono y lo que es. Dos sitios del prototipo, con la misma
 * pieza: las de la cabecera del detalle de una clase (`hero`) y las del día
 * encima de la agenda (`today`, el `Kpi` de Lovable). El lector de pantalla las
 * dice juntas: «Alumnos: 2/4».
 */
export function StatTile(props: StatTileProps) {
  const { Icon, value, label, variant = "hero" } = props;
  const styles = useStyles();
  const theme = useTheme();
  const { t } = useTranslation();
  const text = STAT_TILE_TEXT[variant];
  const color = props.variant === "today" ? props.color : theme.colors.onPrimary;

  return (
    <View style={styles[`${variant}Tile`]} accessible accessibilityLabel={t("schedule.detail.stat", { label, value })}>
      <View style={styles[`${variant}Head`]}>
        <View style={styles[`${variant}Icon`]}>
          <Icon size={ICON_SIZE} color={color} />
        </View>
        <Text variant={text.value} numberOfLines={1} style={{ color }}>
          {value}
        </Text>
      </View>
      <Text variant="statLabel" color={text.label} numberOfLines={text.labelLines} style={styles[`${variant}Label`]}>
        {label}
      </Text>
    </View>
  );
}
