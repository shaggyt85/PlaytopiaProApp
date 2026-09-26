import { useEffect, useState } from "react";

import { restoreSavedLanguage } from "@/shared/config/i18n";
import { session } from "@/shared/services/session";

/**
 * Única puerta de arranque: `true` cuando ya se aplicó el idioma guardado y
 * se comprobó la sesión. Hasta entonces el layout raíz no pinta nada y sigue
 * el splash nativo, así no hay saltos de idioma ni de pantalla.
 */
export function useAppReady(): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    Promise.allSettled([restoreSavedLanguage(), session.restore()]).then(() =>
      setReady(true),
    );
  }, []);

  return ready;
}
