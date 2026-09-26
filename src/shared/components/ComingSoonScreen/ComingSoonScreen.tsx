import { usePathname } from "expo-router";

import { EmptyState } from "@/shared/components/EmptyState";
import { Screen } from "@/shared/components/Screen";
import { TABS } from "@/shared/config/tabs";
import { useTabBarInset } from "@/shared/hooks/useTabBarInset";
import { useTranslation } from "@/shared/hooks/useTranslation";

/**
 * Pestaña que aún no tiene contenido: su nombre (de la lista de pestañas,
 * según la ruta) y «Próximamente». La ruta solo la reexporta.
 */
export function ComingSoonScreen() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const bottomInset = useTabBarInset();
  const tab = TABS.find(({ href }) => href === pathname);

  return (
    <Screen style={{ paddingBottom: bottomInset }} testID="coming-soon-screen">
      <EmptyState title={tab ? t(tab.label) : t("common.comingSoon")} message={t("common.comingSoon")} />
    </Screen>
  );
}
