import type { ReactNode } from "react";
import { TextInput, View, type TextInputProps } from "react-native";

import { Text } from "@/shared/components/Text";
import { useTheme } from "@/shared/hooks/useTheme";

import { useStyles } from "./Input.styles";

export interface InputProps extends TextInputProps {
  label: string;
  /** Mensaje de error ya traducido (validación o servidor). */
  error?: string;
  /** Algo a la derecha dentro del campo (p. ej. mostrar u ocultar contraseña). */
  rightAccessory?: ReactNode;
}

/** Campo de texto del tema con etiqueta, mensaje de error y accesorio opcional. */
export function Input({ label, error, rightAccessory, style, ...rest }: InputProps) {
  const styles = useStyles();
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Text>{label}</Text>
      <View style={[styles.field, error ? styles.fieldError : null]} testID="input-field">
        <TextInput
          accessibilityLabel={label}
          placeholderTextColor={theme.colors.textSecondary}
          style={[styles.input, style]}
          {...rest}
        />
        {rightAccessory ? <View style={styles.accessory}>{rightAccessory}</View> : null}
      </View>
      {error ? (
        <Text variant="caption" accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : null}
    </View>
  );
}
