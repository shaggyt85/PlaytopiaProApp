import { View, type StyleProp, type TextStyle, type ViewStyle } from "react-native";

import { Text } from "@/shared/components/Text";
import type { IconComponent } from "@/shared/config/icons";
import type { ThemeColor } from "@/shared/config/theme";
import { useTheme } from "@/shared/hooks/useTheme";

import { ICON_TEXT_SIZES, useStyles, type IconTextSize } from "./IconText.styles";

interface IconTextProps {
  Icon: IconComponent;
  /** Ya traducido o dato de Core. */
  label: string;
  /** `meta` por defecto: ver `ICON_TEXT_SIZES`. */
  size?: IconTextSize;
  /** Del icono; por defecto, el del texto. */
  iconColor?: ThemeColor;
  /** Del icono, un color que no es del tema (el de un grupo): manda sobre `iconColor`. */
  iconTint?: string;
  /**
   * Del icono y del texto, un color que no es del tema (el de un grupo): manda
   * sobre los demás.
   */
  tint?: string;
  color?: ThemeColor;
  numberOfLines?: number;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

/**
 * Un icono y su texto en una fila («⌖ Calle Mayor 1», «◷ 60 min», el nivel): la
 * línea de datos de las tarjetas del prototipo. Único sitio que la dibuja: Red
 * de clubes, la agenda, el detalle de una clase, «Mis grupos» y el detalle de
 * un grupo. Si el texto no cabe, se encoge él, no el icono.
 */
export function IconText({
  Icon,
  label,
  size = "meta",
  iconColor,
  iconTint,
  tint,
  color = "textSecondary",
  numberOfLines,
  style,
  textStyle,
}: IconTextProps) {
  const styles = useStyles();
  const theme = useTheme();
  const { icon, variant } = ICON_TEXT_SIZES[size];

  return (
    <View style={[styles.line, styles[size], style]}>
      <Icon size={icon} color={tint ?? iconTint ?? theme.colors[iconColor ?? color]} />
      <Text
        variant={variant}
        color={color}
        numberOfLines={numberOfLines}
        style={[styles.text, tint ? { color: tint } : null, textStyle]}
      >
        {label}
      </Text>
    </View>
  );
}
