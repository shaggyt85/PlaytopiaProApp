import type { ReactNode } from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BrandBackground } from "@/shared/components/BrandBackground";
import { BrandWordmark } from "@/shared/components/BrandWordmark";
import { useTabBarInset } from "@/shared/hooks/useTabBarInset";

import { useStyles } from "./TabScreen.styles";

interface TabScreenProps {
  children: ReactNode;
  testID?: string;
}

/**
 * Marco de cada pestaña del menú (el `AppShell` de Lovable): fondo de marca,
 * zona segura de arriba, el logo centrado y el contenido con scroll, que deja
 * abajo el hueco de la barra flotante.
 */
export function TabScreen({ children, testID }: TabScreenProps) {
  const styles = useStyles();
  const bottomInset = useTabBarInset();

  return (
    <BrandBackground testID={testID}>
      <SafeAreaView edges={["top"]} style={styles.flex}>
        <ScrollView contentContainerStyle={[styles.content, { paddingBottom: bottomInset }]}>
          <BrandWordmark />
          {children}
        </ScrollView>
      </SafeAreaView>
    </BrandBackground>
  );
}
