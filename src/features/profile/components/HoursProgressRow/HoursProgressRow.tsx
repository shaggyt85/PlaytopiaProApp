import type { ReactNode } from "react";
import { View } from "react-native";

import { MeterBar } from "@/shared/components/MeterBar";
import { Text } from "@/shared/components/Text";
import type { ThemeColor } from "@/shared/config/theme";
import { useTheme } from "@/shared/hooks/useTheme";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { courtTimeProgressLabel } from "@/shared/utils/courtTime";

import { useStyles } from "./HoursProgressRow.styles";

interface HoursProgressRowProps {
  label: string;
  /** El del texto; el actual del historial va en magenta. */
  labelColor?: ThemeColor;
  /** Delante del nombre: el punto de un club. */
  leading?: ReactNode;
  /** Detrás de las horas: la › de un mes que se abre. */
  trailing?: ReactNode;
  doneMinutes: number;
  plannedMinutes: number;
  /** Lo hecho de lo planificado, de 0 a 1. */
  share: number;
  testID: string;
}

/**
 * Una fila de horas de Perfil: el nombre y lo hecho de lo planificado («9:00 /
 * 12:00 h») en una sola línea, y debajo la barra de su avance a todo el ancho.
 * Único sitio que la dibuja: cada sede en «Horas este mes» y cada mes del
 * historial. Así las horas nunca se parten, sean 5 o 200, y todas las barras
 * empiezan y acaban igual.
 */
export function HoursProgressRow({
  label,
  labelColor = "text",
  leading,
  trailing,
  doneMinutes,
  plannedMinutes,
  share,
  testID,
}: HoursProgressRowProps) {
  const styles = useStyles();
  const theme = useTheme();
  const { t } = useTranslation();
  return (
    <View style={styles.row} testID={testID}>
      <View style={styles.top}>
        {leading}
        <Text variant="rowLabel" color={labelColor} numberOfLines={1} style={styles.label}>
          {label}
        </Text>
        <Text variant="smallFigure" numberOfLines={1}>
          {courtTimeProgressLabel(doneMinutes, plannedMinutes, t)}
        </Text>
        {trailing}
      </View>
      <MeterBar value={share} colors={theme.gradients.brand} size="md" testID={`${testID}-bar`} />
    </View>
  );
}
