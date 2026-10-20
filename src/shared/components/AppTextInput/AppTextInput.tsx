import type { Ref } from "react";
import { TextInput, type TextInputProps } from "react-native";

import { useTheme } from "@/shared/hooks/useTheme";

import { useStyles } from "./AppTextInput.styles";

type AppTextInputProps = TextInputProps & { ref?: Ref<TextInput> };

/**
 * El `TextInput` de la app, gemelo de `AppFlatList`: lo que comparten todos
 * los campos (el color del texto, del ejemplo y de la selección, y la letra
 * de los campos). Cada campo pone encima su forma (la píldora, el cristal…) y,
 * si su diseño lo pide, su propia letra.
 */
export function AppTextInput({ style, ...props }: AppTextInputProps) {
  const styles = useStyles();
  const theme = useTheme();
  return (
    <TextInput
      placeholderTextColor={theme.colors.textSecondary}
      selectionColor={theme.colors.primary}
      {...props}
      style={[styles.input, style]}
    />
  );
}
