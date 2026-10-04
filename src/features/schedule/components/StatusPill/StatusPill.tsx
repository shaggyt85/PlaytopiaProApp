import { View } from "react-native";

import { BrandGradient } from "@/shared/components/BrandGradient";
import { Text } from "@/shared/components/Text";
import { useTheme } from "@/shared/hooks/useTheme";
import { useTranslation } from "@/shared/hooks/useTranslation";

import { PILL_ICON_SIZE, STATUS_PILL, useStyles, type StatusPillVariant } from "./StatusPill.styles";

interface StatusPillProps {
  variant: StatusPillVariant;
  testID?: string;
}

/**
 * La marca del estado de una clase sobre su tarjeta, como el prototipo: «EN
 * VIVO» (coral), «PRÓXIMA» (el degradado de marca) o «✓ COMPLETADA» (la que ya
 * terminó). Único sitio que las dibuja; cada una, en el mapa de sus estilos y
 * su contenido.
 */
export function StatusPill({ variant, testID }: StatusPillProps) {
  const styles = useStyles();
  const theme = useTheme();
  const { t } = useTranslation();
  const { label, variant: textVariant, color, brand, Icon } = STATUS_PILL[variant];

  return (
    <View style={[styles.pill, styles[variant]]} testID={testID}>
      {brand ? <BrandGradient style={styles.fill} /> : null}
      {Icon ? <Icon size={PILL_ICON_SIZE} color={theme.colors[color]} /> : null}
      <Text variant={textVariant} color={color}>
        {t(label)}
      </Text>
    </View>
  );
}
