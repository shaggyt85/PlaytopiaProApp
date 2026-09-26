import type { ReactNode } from "react";
import { View } from "react-native";

import { Text } from "@/shared/components/Text";

import { useStyles } from "./ScreenHeader.styles";

export interface ScreenHeaderProps {
  /** Línea pequeña en mayúsculas sobre el título. Textos ya traducidos. */
  greeting?: string;
  title?: string;
  /** El título aún no ha llegado: se reserva su hueco para que nada salte. */
  loading?: boolean;
  subtitle?: string;
  /** Hueco a la derecha (p. ej. la campana). */
  right?: ReactNode;
}

// Como en Lovable, un nombre largo baja a una segunda línea antes de cortarse.
const TITLE_MAX_LINES = 2;

/** Cabecera de pantalla de Lovable (`ScreenHeader`). Solo pinta lo que recibe. */
export function ScreenHeader({ greeting, title, loading = false, subtitle, right }: ScreenHeaderProps) {
  const styles = useStyles();
  return (
    <View style={styles.container}>
      <View style={styles.texts}>
        {greeting ? (
          <Text variant="eyebrow" color="textSecondary">
            {greeting}
          </Text>
        ) : null}
        {title ? (
          <Text variant="hero" accessibilityRole="header" numberOfLines={TITLE_MAX_LINES} style={styles.title}>
            {title}
          </Text>
        ) : loading ? (
          <View style={styles.titlePlaceholder} testID="screen-header-title-placeholder" />
        ) : null}
        {subtitle ? (
          <Text variant="label" color="textSecondary" style={styles.subtitle}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {right}
    </View>
  );
}
