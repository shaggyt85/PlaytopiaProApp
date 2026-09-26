import { useEffect, useState } from "react";

import { restoreSavedLanguage } from "@/shared/config/i18n";

/**
 * `true` cuando ya se aplicó el idioma guardado. El layout raíz no pinta nada
 * hasta entonces (sigue el splash nativo), para no mostrar un instante la app
 * en el idioma del móvil y luego saltar al elegido.
 */
export function useLanguageReady(): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    restoreSavedLanguage().finally(() => setReady(true));
  }, []);

  return ready;
}
