import { View } from "react-native";

import { Text } from "@/shared/components/Text";
import { useTranslation } from "@/shared/hooks/useTranslation";

import { STATUS_PILL_TEXT, useStyles, type StatusPillVariant } from "./StatusPill.styles";

interface StatusPillProps {
  variant: StatusPillVariant;
  testID?: string;
}

/**
 * La marca del estado de una clase sobre su tarjeta: «EN VIVO» (la Semana) o
 * «PRÓXIMA» (la vista Día). Único sitio que las dibuja; cada una, en el mapa de
 * sus estilos y textos.
 */
export function StatusPill({ variant, testID }: StatusPillProps) {
  const styles = useStyles();
  const { t } = useTranslation();
  const { label, variant: textVariant } = STATUS_PILL_TEXT[variant];

  return (
    <View style={[styles.pill, styles[variant]]} testID={testID}>
      <Text variant={textVariant} color="onPrimary">
        {t(label)}
      </Text>
    </View>
  );
}
