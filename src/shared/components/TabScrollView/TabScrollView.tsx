import type { ReactNode, Ref, RefObject } from "react";
import type { ScrollView, View } from "react-native";

import { AppScrollView } from "@/shared/components/AppScrollView";
import { BrandWordmark } from "@/shared/components/BrandWordmark";
import { useTabContentStyle } from "@/shared/hooks/useTabContentStyle";

interface TabScrollViewProps {
  children: ReactNode;
  /** Para desplazarla desde la pantalla (p. ej. llevar la lista del Mes a un día). */
  scrollRef?: Ref<ScrollView>;
  /** Su contenido: desde él se mide dónde está un elemento para llevarlo a la vista. */
  innerViewRef?: RefObject<View | null>;
}

/**
 * Contenido con scroll de una pestaña (el `main` del `AppShell` de Lovable):
 * el logo arriba, que se desplaza con el contenido, y abajo el hueco de la
 * barra flotante; sin barra de desplazamiento (`AppScrollView`). Para listas
 * largas, `TabFlatList`.
 */
export function TabScrollView({ children, scrollRef, innerViewRef }: TabScrollViewProps) {
  const contentStyle = useTabContentStyle();

  return (
    <AppScrollView ref={scrollRef} innerViewRef={innerViewRef as RefObject<View>} contentContainerStyle={contentStyle}>
      <BrandWordmark />
      {children}
    </AppScrollView>
  );
}
