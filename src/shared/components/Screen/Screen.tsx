import { SafeAreaView, type SafeAreaViewProps } from "react-native-safe-area-context";

import { useStyles } from "./Screen.styles";

/**
 * Base de toda pantalla: fondo del tema y zonas seguras (edge-to-edge es
 * obligatorio en Android 16, así que el contenido no puede ir bajo la barra
 * de estado ni la de gestos).
 */
export function Screen({ style, ...rest }: SafeAreaViewProps) {
  const styles = useStyles();
  return <SafeAreaView style={[styles.container, style]} {...rest} />;
}
