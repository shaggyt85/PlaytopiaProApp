import {
  Text as RNText,
  type TextProps as RNTextProps,
  type TextStyle,
} from "react-native";

import type { TextVariant, ThemeColor } from "@/shared/config/theme";
import { useTheme } from "@/shared/hooks/useTheme";

import { useStyles } from "./Text.styles";

export interface TextProps extends RNTextProps {
  variant?: TextVariant;
  color?: ThemeColor;
  align?: TextStyle["textAlign"];
}

/** Texto con la tipografía y los colores del tema. */
export function Text({
  variant = "body",
  color = "text",
  align,
  style,
  ...rest
}: TextProps) {
  const styles = useStyles();
  const theme = useTheme();
  return (
    <RNText style={[styles[variant], { color: theme.colors[color], textAlign: align }, style]} {...rest} />
  );
}
