import { View } from "react-native";

import { BrandLogo } from "@/shared/components/BrandLogo";
import { Text } from "@/shared/components/Text";

import { LOGO_SIZE, useStyles } from "./BrandWordmark.styles";

// Nombre de marca: no se traduce.
const WORDMARK = "PLAYTOPIA";

/**
 * Logo y marca arriba de cada pestaña (el `PlaytopiaWordmark` de Lovable). De
 * momento con el logo blanco: el isotipo con degradado está pendiente de la
 * librería de iconos.
 */
export function BrandWordmark() {
  const styles = useStyles();
  return (
    <View style={styles.container} accessible accessibilityRole="header" accessibilityLabel="Playtopia">
      <BrandLogo size={LOGO_SIZE} />
      <Text variant="wordmark">{WORDMARK}</Text>
    </View>
  );
}
