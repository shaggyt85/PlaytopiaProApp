import { LinearGradient } from "expo-linear-gradient";
import type { ReactNode } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";

import type { Theme } from "@/shared/config/theme";
import { useTheme } from "@/shared/hooks/useTheme";

import { useStyles } from "./StripeCard.styles";

interface StripeCardProps {
  /** Los colores de la franja, de arriba abajo (el degradado de marca o el del club). */
  stripe: readonly [string, string, ...string[]];
  /** El radio de la caja: `xxxl` por defecto (`rounded-3xl`, Red de clubes). */
  radius?: keyof Theme["radius"];
  style?: StyleProp<ViewStyle>;
  testID?: string;
  /** El fondo (si lo hay, en posición absoluta) y el contenido, que deja libre `STRIPE_WIDTH`. */
  children: ReactNode;
}

/**
 * La tarjeta con franja de color a la izquierda del prototipo: la caja que
 * recorta, con el borde fino y el fondo `surface`, y la franja vertical. La usan
 * la tarjeta de sede de «Red de clubes» y la clase de la vista Día.
 */
export function StripeCard({ stripe, radius = "xxxl", style, testID, children }: StripeCardProps) {
  const styles = useStyles();
  const theme = useTheme();

  return (
    <View style={[styles.card, { borderRadius: theme.radius[radius] }, style]} testID={testID}>
      {children}
      <LinearGradient colors={stripe} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={styles.stripe} />
    </View>
  );
}
