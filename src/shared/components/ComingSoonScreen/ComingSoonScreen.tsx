import { usePathname } from "expo-router";

import { EmptyState } from "@/shared/components/EmptyState";
import { TabScreen } from "@/shared/components/TabScreen";
import { TABS } from "@/shared/config/tabs";
import { useTranslation } from "@/shared/hooks/useTranslation";

/**
 * Pestaña que aún no tiene contenido: su nombre (de la lista de pestañas,
 * según la ruta) y «Próximamente». La ruta solo la reexporta.
 */
export function ComingSoonScreen() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const tab = TABS.find(({ href }) => href === pathname);

  return (
    <TabScreen testID="coming-soon-screen">
      <EmptyState title={tab ? t(tab.label) : t("common.comingSoon")} message={t("common.comingSoon")} />
    </TabScreen>
  );
}
