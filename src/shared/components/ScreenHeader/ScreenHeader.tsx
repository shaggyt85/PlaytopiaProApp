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
  /** Hueco a la izquierda de los textos (p. ej. el avatar del profesor). */
  left?: ReactNode;
  /** Hueco a la derecha (p. ej. la campana). */
  right?: ReactNode;
}

// Como en Lovable, un nombre largo baja a una segunda línea antes de cortarse.
const TITLE_MAX_LINES = 2;

/**
 * Cabecera de pantalla de Lovable (`ScreenHeader`). Solo pinta lo que recibe.
 * Con algo a la izquierda, todo se centra en vertical (`items-center`, como la
 * cabecera de la Agenda del prototipo); sin él, arriba, como hasta ahora.
 */
export function ScreenHeader({ greeting, title, loading = false, subtitle, left, right }: ScreenHeaderProps) {
  const styles = useStyles();
  return (
    <View style={[styles.container, left ? styles.centered : null]} testID="screen-header">
      {left}
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
