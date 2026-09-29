import type { ReactNode } from "react";
import { ScrollView } from "react-native";

import { BrandWordmark } from "@/shared/components/BrandWordmark";
import { useTabContentStyle } from "@/shared/hooks/useTabContentStyle";

/**
 * Contenido con scroll de una pestaña (el `main` del `AppShell` de Lovable):
 * el logo arriba, que se desplaza con el contenido, y abajo el hueco de la
 * barra flotante. Para listas largas, `TabFlatList`.
 */
export function TabScrollView({ children }: { children: ReactNode }) {
  const contentStyle = useTabContentStyle();

  return (
    <ScrollView contentContainerStyle={contentStyle}>
      <BrandWordmark />
      {children}
    </ScrollView>
  );
}
