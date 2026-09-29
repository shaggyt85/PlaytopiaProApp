import type { ReactElement } from "react";
import { FlatList, type FlatListProps } from "react-native";

import { BrandWordmark } from "@/shared/components/BrandWordmark";
import { useTabContentStyle } from "@/shared/hooks/useTabContentStyle";

export interface TabFlatListProps<T> extends Omit<FlatListProps<T>, "ListHeaderComponent"> {
  /** Lo que va entre el logo y la lista (cabecera, pestañas…); se desplaza con ella. */
  header?: ReactElement | null;
}

/**
 * Lista larga de una pestaña del menú: lo mismo que `TabScrollView` (el logo
 * arriba y el hueco de la barra flotante abajo), pero virtualizada.
 */
export function TabFlatList<T>({ header, contentContainerStyle, ...rest }: TabFlatListProps<T>) {
  const contentStyle = useTabContentStyle();

  return (
    <FlatList
      {...rest}
      ListHeaderComponent={
        <>
          <BrandWordmark />
          {header}
        </>
      }
      contentContainerStyle={[contentStyle, contentContainerStyle]}
    />
  );
}
