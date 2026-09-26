import { LinearGradient } from "expo-linear-gradient";
import { useRef, useState } from "react";
import { ActivityIndicator, Pressable, View, type PressableProps } from "react-native";

import { Text } from "@/shared/components/Text";
import type { ThemeColor } from "@/shared/config/theme";
import { useTheme } from "@/shared/hooks/useTheme";

import { useStyles } from "./Button.styles";

export type ButtonVariant = "primary" | "solid" | "secondary" | "link";

export interface ButtonProps extends Omit<PressableProps, "onPress" | "children"> {
  title: string;
  /** Si devuelve una promesa, el botón queda ocupado hasta que termine. */
  onPress: () => void | Promise<unknown>;
  variant?: ButtonVariant;
  loading?: boolean;
}

/**
 * Botón de Playtopia (el mismo que la app de alumnos):
 * - `primary`: píldora con el degradado de marca; gris si no se puede pulsar.
 * - `solid`: píldora violeta lisa, la del registro; apagada si no se puede pulsar.
 * - `secondary`: píldora con borde.
 * - `link`: texto subrayado ("¿Has olvidado tu contraseña?").
 *
 * Ignora las pulsaciones mientras está ocupado (`loading` o la promesa de
 * `onPress` sin terminar): un doble toque no envía dos veces.
 */
export function Button({
  title,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
  ...rest
}: ButtonProps) {
  const styles = useStyles();
  const theme = useTheme();
  const [running, setRunning] = useState(false);
  // Un ref y no solo el estado: dos toques en el mismo frame llegan antes de
  // que React vuelva a pintar.
  const runningRef = useRef(false);

  const busy = loading || running;
  const inactive = Boolean(disabled) || busy;

  const handlePress = async () => {
    if (inactive || runningRef.current) return;
    const result = onPress();
    if (!(result instanceof Promise)) return;
    runningRef.current = true;
    setRunning(true);
    try {
      await result;
    } finally {
      runningRef.current = false;
      setRunning(false);
    }
  };

  const textColor: ThemeColor =
    variant === "primary"
      ? "onPrimary"
      : variant === "solid"
        ? inactive
          ? "textSecondary"
          : "onPrimary"
        : variant === "link"
          ? "link"
          : "primary";

  const label = (
    <>
      {busy && (
        <ActivityIndicator color={theme.colors[textColor]} testID="button-loading" />
      )}
      <Text
        variant="button"
        color={textColor}
        style={variant === "link" ? styles.linkText : undefined}
      >
        {title}
      </Text>
    </>
  );

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: inactive, busy }}
      onPress={handlePress}
      disabled={inactive}
      style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
      {...rest}
    >
      {variant === "primary" ? (
        <LinearGradient
          colors={inactive ? theme.gradients.disabled : theme.gradients.button}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.body}
        >
          {label}
        </LinearGradient>
      ) : (
        <View
          style={
            variant === "solid"
              ? [styles.body, styles.solid, inactive && styles.solidInactive]
              : variant === "secondary"
                ? [styles.body, styles.secondary]
                : styles.link
          }
        >
          {label}
        </View>
      )}
    </Pressable>
  );
}
