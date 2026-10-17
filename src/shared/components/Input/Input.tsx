import type { ReactNode } from "react";
import { TextInput, View, type TextInputProps } from "react-native";

import { FormField } from "@/shared/components/FormField";
import { Text } from "@/shared/components/Text";
import { useTheme } from "@/shared/hooks/useTheme";

import { useStyles } from "./Input.styles";

export interface InputProps extends TextInputProps {
  label: string;
  /** Mensaje de error ya traducido (validación o servidor). */
  error?: string;
  /** Algo a la derecha dentro del campo (p. ej. mostrar u ocultar contraseña). */
  rightAccessory?: ReactNode;
  /** `glass` es el campo del acceso; `solid`, el del formulario de registro. */
  variant?: "glass" | "solid";
}

/** Las líneas que se ven de un campo de varias líneas antes de desplazarse dentro. */
const MULTILINE_ROWS = 4;

/**
 * Campo de texto del tema con etiqueta, mensaje de error y accesorio opcional.
 * Con `multiline` deja de ser una píldora: crece hasta `MULTILINE_ROWS` líneas,
 * con el texto arriba (la presentación de Perfil, el motivo de una baja); si
 * tiene `maxLength`, debajo cuenta lo escrito («120/500»).
 */
export function Input({
  label,
  error,
  rightAccessory,
  variant = "glass",
  style,
  ...rest
}: InputProps) {
  const styles = useStyles();
  const theme = useTheme();

  return (
    <FormField label={label} error={error}>
      <View
        style={[
          styles.field,
          variant === "solid" && styles.solid,
          rest.multiline && styles.multilineField,
          error ? styles.fieldError : null,
        ]}
        testID="input-field"
      >
        <TextInput
          accessibilityLabel={label}
          placeholderTextColor={theme.colors.textSecondary}
          style={[styles.input, variant === "solid" && styles.solidInput, rest.multiline && styles.multilineInput, style]}
          numberOfLines={rest.multiline ? MULTILINE_ROWS : undefined}
          textAlignVertical={rest.multiline ? "top" : undefined}
          {...rest}
        />
        {rightAccessory ? <View style={styles.accessory}>{rightAccessory}</View> : null}
      </View>
      {rest.multiline && rest.maxLength !== undefined ? (
        <Text variant="caption" color="textSecondary" style={styles.counter} testID="input-counter">
          {`${rest.value?.length ?? 0}/${rest.maxLength}`}
        </Text>
      ) : null}
    </FormField>
  );
}
