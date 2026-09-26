import { useRef, useState } from "react";
import { ActivityIndicator, Pressable, type PressableProps } from "react-native";

import { Text } from "@/shared/components/Text";
import { useTheme } from "@/shared/hooks/useTheme";

import { useStyles } from "./Button.styles";

export type ButtonVariant = "primary" | "secondary" | "ghost";

export interface ButtonProps extends Omit<PressableProps, "onPress" | "children"> {
  title: string;
  /** Si devuelve una promesa, el botón queda ocupado hasta que termine. */
  onPress: () => void | Promise<unknown>;
  variant?: ButtonVariant;
  loading?: boolean;
}

/**
 * Botón del tema. Ignora las pulsaciones mientras está ocupado (`loading` o
 * la promesa de `onPress` sin terminar): así un doble toque no envía dos
 * veces el mismo formulario.
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

  const textColor = variant === "primary" ? "onPrimary" : "primary";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: inactive, busy }}
      onPress={handlePress}
      disabled={inactive}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        pressed && styles.pressed,
        inactive && styles.disabled,
      ]}
      {...rest}
    >
      {busy && (
        <ActivityIndicator
          color={theme.colors[textColor]}
          testID="button-loading"
        />
      )}
      <Text variant="button" color={textColor}>
        {title}
      </Text>
    </Pressable>
  );
}
