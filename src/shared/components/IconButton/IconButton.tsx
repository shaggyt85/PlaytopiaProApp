import { Pressable, type PressableProps } from "react-native";

import type { IconComponent } from "@/shared/config/icons";
import { useTheme } from "@/shared/hooks/useTheme";

import { useStyles } from "./IconButton.styles";

export interface IconButtonProps extends Omit<PressableProps, "children" | "style"> {
  Icon: IconComponent;
  /** Lo que lee el lector de pantalla, ya traducido. */
  accessibilityLabel: string;
  /** Diámetro del círculo (por defecto el área táctil mínima, 44). */
  size?: number;
}

/**
 * Botón redondo con un icono (los de Lovable: la campana, la X de un panel):
 * círculo de superficie con borde fino. Si es más pequeño que el área táctil
 * mínima, la completa con `hitSlop`. Sin `onPress` queda desactivado: el lector
 * de pantalla lo anuncia así y no se anima al tocarlo.
 */
export function IconButton({ Icon, size, hitSlop, onPress, disabled, ...rest }: IconButtonProps) {
  const theme = useTheme();
  const diameter = size ?? theme.touchTarget;
  const styles = useStyles();
  const inactive = Boolean(disabled) || !onPress;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: inactive }}
      onPress={onPress}
      disabled={inactive}
      hitSlop={hitSlop ?? Math.max(0, (theme.touchTarget - diameter) / 2)}
      style={({ pressed }) => [
        styles.circle,
        { width: diameter, height: diameter, borderRadius: diameter / 2 },
        pressed && styles.pressed,
      ]}
      {...rest}
    >
      <Icon size={Math.round(diameter * ICON_RATIO)} color={theme.colors.text} />
    </Pressable>
  );
}

// El icono ocupa algo menos de la mitad del círculo (20 en 44, 16 en 36).
const ICON_RATIO = 0.45;
