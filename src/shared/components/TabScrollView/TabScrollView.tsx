import type { ReactNode } from "react";
import { ScrollView } from "react-native";

import { BrandWordmark } from "@/shared/components/BrandWordmark";
import { useTabBarInset } from "@/shared/hooks/useTabBarInset";

import { useStyles } from "./TabScrollView.styles";

/**
 * Contenido con scroll de una pestaña (el `main` del `AppShell` de Lovable):
 * el logo arriba, que se desplaza con el contenido, y abajo el hueco de la
 * barra flotante. Para listas largas, una `FlatList` con lo mismo.
 */
export function TabScrollView({ children }: { children: ReactNode }) {
  const styles = useStyles();
  const bottomInset = useTabBarInset();

  return (
    <ScrollView contentContainerStyle={[styles.content, { paddingBottom: bottomInset }]}>
      <BrandWordmark />
      {children}
    </ScrollView>
  );
}
