import type { ReactNode } from "react";
import { View } from "react-native";

import { Text } from "@/shared/components/Text";

import { useStyles } from "./ScreenHeader.styles";

export interface ScreenHeaderProps {
  /** Línea pequeña en mayúsculas sobre el título. Textos ya traducidos. */
  greeting?: string;
  /** Sin título (p. ej. mientras carga) se reserva su hueco: nada salta al llegar. */
  title?: string;
  subtitle?: string;
  /** Hueco a la derecha (p. ej. la campana). */
  right?: ReactNode;
}

/** Cabecera de pantalla de Lovable (`ScreenHeader`). Solo pinta lo que recibe. */
export function ScreenHeader({ greeting, title, subtitle, right }: ScreenHeaderProps) {
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
          <Text variant="hero" accessibilityRole="header" numberOfLines={1} style={styles.title}>
            {title}
          </Text>
        ) : (
          <View style={styles.titlePlaceholder} testID="screen-header-title-placeholder" />
        )}
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
