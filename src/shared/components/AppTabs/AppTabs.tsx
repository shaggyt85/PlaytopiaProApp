import { TabList, TabSlot, TabTrigger, Tabs } from "expo-router/ui";

import { BrandBackground } from "@/shared/components/BrandBackground";
import { TabBar } from "@/shared/components/TabBar";
import { TabButton } from "@/shared/components/TabButton";
import { TABS } from "@/shared/config/tabs";

import { useStyles } from "./AppTabs.styles";

/**
 * Navegación por pestañas del menú inferior. La barra se monta una sola vez y
 * queda fija mientras cambia la pantalla de encima. Los `TabTrigger` tienen
 * que ir aquí, dentro de `TabList`: es donde `Tabs` los busca para saber qué
 * pestañas hay.
 *
 * El fondo de marca se dibuja una sola vez, detrás de todas las pestañas (como
 * el `body` de Lovable): no se redibuja al cambiar de pestaña, que son
 * transparentes.
 */
export function AppTabs() {
  const styles = useStyles();

  return (
    <BrandBackground>
      <Tabs style={styles.container}>
        <TabSlot />
        <TabList asChild>
          <TabBar>
            {TABS.map((tab) => (
              <TabTrigger key={tab.name} name={tab.name} href={tab.href} asChild>
                <TabButton tab={tab} />
              </TabTrigger>
            ))}
          </TabBar>
        </TabList>
      </Tabs>
    </BrandBackground>
  );
}
