import { TextInput, View, type TextInputProps } from "react-native";

import { Text } from "@/shared/components/Text";
import { useTheme } from "@/shared/hooks/useTheme";

import { useStyles } from "./Input.styles";

export interface InputProps extends TextInputProps {
  label: string;
  /** Mensaje de error ya traducido (validación o servidor). */
  error?: string;
}

/** Campo de texto del tema con etiqueta y mensaje de error. */
export function Input({ label, error, style, ...rest }: InputProps) {
  const styles = useStyles();
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Text variant="caption" color="textSecondary">
        {label}
      </Text>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={theme.colors.textSecondary}
        style={[styles.input, error ? styles.inputError : null, style]}
        {...rest}
      />
      {error ? (
        <Text variant="caption" color="danger" accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : null}
    </View>
  );
}
