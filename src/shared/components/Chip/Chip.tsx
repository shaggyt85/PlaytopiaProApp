import { View } from "react-native";

import { Text } from "@/shared/components/Text";
import { useTheme } from "@/shared/hooks/useTheme";

import { chipColor, chipVariant, useStyles, type ChipTone } from "./Chip.styles";

interface ChipProps {
  /** Texto ya traducido o dato de Core (la sede). Se pinta en mayúsculas. */
  label: string;
  /** El punto delante (por defecto, sí). Sin él, la pastilla «HOY · 23:10» de la semana. */
  dot?: boolean;
  /** Su color: el de marca (por defecto), el oro de las recuperaciones o el neutro de una etiqueta. */
  tone?: ChipTone;
}

/**
 * El chip del prototipo (`● INDOOR MAD`): punto y texto sobre su color al 20 %.
 * Lo usan la tarjeta de sede de «Red de clubes», la pastilla del día de la
 * agenda («● HOY · LUNES 18»), sin punto la de hoy en la semana y, en oro, la
 * etiqueta «RECUPERACIÓN» de un alumno; en neutro y sin punto, las
 * especialidades del perfil profesional.
 */
export function Chip({ label, dot = true, tone = "primary" }: ChipProps) {
  const styles = useStyles();
  const color = chipColor(useTheme(), tone);
  return (
    <View style={[styles.container, styles[tone]]}>
      {dot ? <View style={[styles.dot, { backgroundColor: color }]} testID="chip-dot" /> : null}
      <Text variant={chipVariant(tone)} numberOfLines={1} style={{ color }}>
        {label}
      </Text>
    </View>
  );
}
