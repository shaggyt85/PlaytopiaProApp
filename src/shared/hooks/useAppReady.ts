import { useEffect, useState } from "react";

import { preloadBrandAssets } from "@/shared/config/assets";
import { restoreSavedLanguage } from "@/shared/config/i18n";
import { session } from "@/shared/services/session";

/**
 * Única puerta de arranque: `true` cuando ya se aplicó el idioma guardado,
 * se comprobó la sesión y están en caché las imágenes de marca. Hasta
 * entonces el layout raíz no pinta nada y sigue el splash nativo, así no hay
 * saltos de idioma, de pantalla ni imágenes que tardan en salir.
 */
export function useAppReady(): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    Promise.allSettled([
      restoreSavedLanguage(),
      session.restore(),
      preloadBrandAssets(),
    ]).then(() => setReady(true));
  }, []);

  return ready;
}
