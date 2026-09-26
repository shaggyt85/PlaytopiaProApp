import Constants from "expo-constants";
import { View } from "react-native";

import { BrandLogo } from "@/shared/components/BrandLogo";
import { Text } from "@/shared/components/Text";

import { LOGO_SIZE, useStyles } from "./LogoSection.styles";

// Nombre de marca: no se traduce.
const BRAND_NAME = "Playtopia Pro";

/**
 * Cabecera de las pantallas de acceso: logo, marca, versión y, si se pasa,
 * un subtítulo pegado debajo (p. ej. el correo en la pantalla de contraseña).
 */
export function LogoSection({ subtitle }: { subtitle?: string }) {
  const styles = useStyles();
  const version = Constants.expoConfig?.version;

  return (
    <View style={styles.container}>
      <BrandLogo size={LOGO_SIZE} style={styles.logo} />
      <Text variant="brand" style={styles.title} accessibilityRole="header">
        {BRAND_NAME}
      </Text>
      {version ? (
        <Text variant="micro" color="textSecondary" style={styles.version}>
          v{version}
        </Text>
      ) : null}
      {subtitle ? (
        <Text variant="emphasis" color="primary" align="center" style={styles.subtitle}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}
