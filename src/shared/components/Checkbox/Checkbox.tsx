import type { ReactNode } from "react";
import { Pressable, View } from "react-native";

import { Text } from "@/shared/components/Text";
import type { ThemeColor } from "@/shared/config/theme";
import { useTheme } from "@/shared/hooks/useTheme";

import { useStyles } from "./Checkbox.styles";

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Texto de la casilla. Puede llevar enlaces dentro. */
  children: ReactNode;
  /** Color del borde y del relleno marcado. */
  tone?: ThemeColor;
  /** Nombre para lectores de pantalla cuando el texto lleva enlaces. */
  accessibilityLabel?: string;
  testID?: string;
}

/** Casilla de la app de alumnos: cuadrado con ✓ y su texto al lado. */
export function Checkbox({
  checked,
  onChange,
  children,
  tone = "primary",
  accessibilityLabel,
  testID,
}: CheckboxProps) {
  const styles = useStyles();
  const theme = useTheme();
  const color = theme.colors[tone];

  return (
    <View style={styles.row}>
      <Pressable
        onPress={() => onChange(!checked)}
        accessibilityRole="checkbox"
        accessibilityState={{ checked }}
        accessibilityLabel={accessibilityLabel}
        hitSlop={theme.spacing.sm}
        style={[styles.box, { borderColor: color }, checked && { backgroundColor: color }]}
        testID={testID}
      >
        {checked ? <Text style={styles.check}>✓</Text> : null}
      </Pressable>
      <Text variant="label" style={styles.text}>
        {children}
      </Text>
    </View>
  );
}
