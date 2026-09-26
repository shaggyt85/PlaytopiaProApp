import Constants from "expo-constants";
import { Image, View } from "react-native";

import { Text } from "@/shared/components/Text";
import { BRAND_ASSETS } from "@/shared/config/assets";

import { useStyles } from "./LogoSection.styles";

// Nombre de marca: no se traduce.
const BRAND_NAME = "Playtopia Pro";

/** Cabecera de las pantallas de acceso: logo, marca y versión de la app. */
export function LogoSection() {
  const styles = useStyles();
  const version = Constants.expoConfig?.version;

  return (
    <View style={styles.container}>
      <Image
        source={BRAND_ASSETS.logoWhite}
        style={styles.logo}
        resizeMode="contain"
        accessibilityIgnoresInvertColors
      />
      <Text variant="brand" style={styles.title} accessibilityRole="header">
        {BRAND_NAME}
      </Text>
      {version ? (
        <Text variant="micro" color="textSecondary" style={styles.version}>
          v{version}
        </Text>
      ) : null}
    </View>
  );
}
