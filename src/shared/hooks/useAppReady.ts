import { useEffect, useState } from "react";

import { preloadBrandAssets } from "@/shared/config/assets";
import { loadFonts } from "@/shared/config/fonts";
import { restoreSavedLanguage } from "@/shared/config/i18n";
import { session } from "@/shared/services/session";

/**
 * Única puerta de arranque: `true` cuando ya se aplicó el idioma guardado,
 * se comprobó la sesión, están en caché las imágenes de marca y cargadas las
 * fuentes. Hasta entonces el layout raíz no pinta nada y sigue el splash
 * nativo, así no hay saltos de idioma, de pantalla, de letra ni imágenes que
 * tardan en salir. Si algo falla, arranca igual (las fuentes caen en las del
 * sistema).
 */
export function useAppReady(): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    Promise.allSettled([
      restoreSavedLanguage(),
      session.restore(),
      preloadBrandAssets(),
      loadFonts(),
    ]).then(() => setReady(true));
  }, []);

  return ready;
}
