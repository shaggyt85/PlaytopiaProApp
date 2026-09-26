import { BlurTargetView } from "expo-blur";
import { createContext, useContext, useRef, type ReactNode, type RefObject } from "react";
import { StyleSheet, type View } from "react-native";

const BlurTargetContext = createContext<RefObject<View | null> | null>(null);

/**
 * Comparte qué contenido se desenfoca detrás de los paneles (`BottomSheet`).
 * En Android expo-blur solo desenfoca lo que está dentro de un `BlurTarget`, y
 * el panel tiene que quedar fuera de él:
 *
 * ```tsx
 * <BlurTargetProvider>
 *   <BlurTarget>{contenido}</BlurTarget>
 *   <BottomSheet … />
 * </BlurTargetProvider>
 * ```
 */
export function BlurTargetProvider({ children }: { children: ReactNode }) {
  const target = useRef<View>(null);
  return <BlurTargetContext.Provider value={target}>{children}</BlurTargetContext.Provider>;
}

/** El contenido que queda desenfocado cuando hay un panel abierto. */
export function BlurTarget({ children }: { children: ReactNode }) {
  const target = useContext(BlurTargetContext);
  return (
    <BlurTargetView ref={target ?? undefined} style={styles.fill}>
      {children}
    </BlurTargetView>
  );
}

/** Ref del contenido a desenfocar; null fuera de un `BlurTargetProvider`. */
export const useBlurTarget = () => useContext(BlurTargetContext);

const styles = StyleSheet.create({ fill: { flex: 1 } });
