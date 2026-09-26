import { View } from "react-native";

import { BrandLogo } from "@/shared/components/BrandLogo";
import { Text } from "@/shared/components/Text";

import { LOGO_SIZE, useStyles } from "./BrandWordmark.styles";

// Nombre de marca: no se traduce. Se pinta en mayúsculas y se lee tal cual.
const BRAND_NAME = "Playtopia";

/**
 * Logo y marca arriba de cada pestaña (el `PlaytopiaWordmark` de Lovable). De
 * momento con el logo blanco: el isotipo con degradado está pendiente de la
 * librería de iconos.
 */
export function BrandWordmark() {
  const styles = useStyles();
  return (
    <View style={styles.container} accessible accessibilityRole="image" accessibilityLabel={BRAND_NAME}>
      <BrandLogo size={LOGO_SIZE} />
      <Text variant="wordmark">{BRAND_NAME.toUpperCase()}</Text>
    </View>
  );
}
