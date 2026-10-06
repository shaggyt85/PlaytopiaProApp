import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { BrandGradient } from "@/shared/components/BrandGradient";
import { Text } from "@/shared/components/Text";
import type { IconComponent } from "@/shared/config/icons";
import type { ThemeColor } from "@/shared/config/theme";
import { useTheme } from "@/shared/hooks/useTheme";

import { useStyles } from "./Button.styles";

export type ButtonVariant = "primary" | "solid" | "secondary" | "danger" | "dangerOutline" | "link";

/** El icono delante del texto (`h-4 w-4`). */
const BUTTON_ICON_SIZE = 16;

/** Color del texto de cada variante, activa y cuando no se puede pulsar. */
const TEXT_COLOR: Record<ButtonVariant, { active: ThemeColor; inactive: ThemeColor }> = {
  primary: { active: "onPrimary", inactive: "onPrimary" },
  solid: { active: "onPrimary", inactive: "textSecondary" },
  secondary: { active: "primary", inactive: "primary" },
  danger: { active: "danger", inactive: "textSecondary" },
  dangerOutline: { active: "danger", inactive: "textSecondary" },
  link: { active: "link", inactive: "link" },
};

export interface ButtonProps extends Omit<PressableProps, "onPress" | "children"> {
  title: string;
  /** Si devuelve una promesa, el botón queda ocupado hasta que termine. */
  onPress: () => void | Promise<unknown>;
  variant?: ButtonVariant;
  loading?: boolean;
  /** Delante del texto, de su mismo color (el ⎋ de «Cerrar sesión»). */
  Icon?: IconComponent;
}

/**
 * Botón de Playtopia (el mismo que la app de alumnos):
 * - `primary`: píldora con el degradado de marca; gris si no se puede pulsar.
 * - `solid`: píldora lisa del color primario, la del registro; apagada si no se puede pulsar.
 * - `secondary`: píldora con borde.
 * - `danger`: tarjeta con el texto en rojo, para salir de la cuenta («Cerrar sesión»).
 * - `dangerOutline`: la de `danger` con el borde rojo suave, para lo que no
 *   tiene vuelta atrás desde la app («Borrar cuenta»).
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
  Icon,
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

  const textColor = TEXT_COLOR[variant][inactive ? "inactive" : "active"];
  // Fondo de las variantes sin degradado; `primary` pinta el suyo abajo.
  const bodyStyle: Record<Exclude<ButtonVariant, "primary">, StyleProp<ViewStyle>> = {
    solid: [styles.body, styles.solid, inactive && styles.solidInactive],
    secondary: [styles.body, styles.secondary],
    danger: [styles.body, styles.danger],
    dangerOutline: [styles.body, styles.dangerOutline],
    link: styles.link,
  };

  const label = (
    <>
      {busy && (
        <ActivityIndicator color={theme.colors[textColor]} testID="button-loading" />
      )}
      {Icon && !busy ? <Icon size={BUTTON_ICON_SIZE} color={theme.colors[textColor]} /> : null}
      <Text
        variant={variant === "link" ? "link" : "button"}
        color={textColor}
        style={variant === "link" && styles.linkText}
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
        <BrandGradient inactive={inactive} style={styles.body}>
          {label}
        </BrandGradient>
      ) : (
        <View style={bodyStyle[variant]}>{label}</View>
      )}
    </Pressable>
  );
}
