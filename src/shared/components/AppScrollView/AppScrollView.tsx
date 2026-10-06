import { ScrollView, type ScrollViewProps } from "react-native";

type AppScrollViewProps = ScrollViewProps & { ref?: React.Ref<ScrollView> };

/**
 * El `ScrollView` de la app: sin barra de desplazamiento, como en el móvil (la
 * del sistema es cosa de un ordenador). Único sitio que lo decide: lo usan las
 * pestañas (`TabScrollView`), los detalles (clase, grupo, alumno), el acceso y
 * los términos. Así una pantalla nueva no vuelve a sacarla por olvido. Lo demás
 * pasa tal cual al `ScrollView`.
 */
export function AppScrollView(props: AppScrollViewProps) {
  return <ScrollView {...props} showsVerticalScrollIndicator={false} />;
}
