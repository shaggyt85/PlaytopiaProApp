import type { ReactNode } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { useStyles } from "./TabScreen.styles";

interface TabScreenProps {
  children: ReactNode;
  testID?: string;
}

/**
 * Marco de cada pestaña del menú: la zona segura de arriba, transparente (el
 * fondo de marca lo pone `AppTabs` por detrás). El desplazamiento lo elige cada
 * pantalla: `TabScrollView` para contenido libre o una `FlatList` para listas
 * largas, con `BrandWordmark` arriba y `useTabBarInset()` abajo.
 */
export function TabScreen({ children, testID }: TabScreenProps) {
  const styles = useStyles();
  return (
    <SafeAreaView edges={["top"]} style={styles.container} testID={testID}>
      {children}
    </SafeAreaView>
  );
}
