import type { ReactNode } from "react";

import { BlurTarget, BlurTargetProvider } from "@/shared/components/BlurTarget";

import { useAppUpdate } from "../../hooks/useAppUpdate";
import { useAppUpdateStore } from "../../store/appUpdateStore";
import { ForceUpdateScreen } from "../ForceUpdateScreen";
import { SoftUpdateSheet } from "../SoftUpdateSheet";

/**
 * La app, o el aviso de actualizar que toque. Con `force`, la pantalla de
 * actualizar **en lugar** de la app; con `soft`, la app y encima el panel, que
 * se puede cerrar. Va en el layout raíz: el version-check es público y vale
 * igual con sesión que sin ella.
 */
export function AppUpdateGate({ children }: { children: ReactNode }) {
  const { notice, storeUrl } = useAppUpdate();
  const softDismissed = useAppUpdateStore((state) => state.softDismissed);
  const dismissSoft = useAppUpdateStore((state) => state.dismissSoft);

  if (notice === "force") return <ForceUpdateScreen storeUrl={storeUrl} />;

  return (
    <BlurTargetProvider>
      <BlurTarget>{children}</BlurTarget>
      {/* Sin URL no hay nada que ofrecer: el aviso que se puede cerrar no sale. */}
      {storeUrl ? (
        <SoftUpdateSheet
          visible={notice === "soft" && !softDismissed}
          storeUrl={storeUrl}
          onDismiss={dismissSoft}
        />
      ) : null}
    </BlurTargetProvider>
  );
}
