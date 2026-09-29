import { useEffect, useState } from "react";
import { AppState } from "react-native";

import { serverNow } from "@/shared/utils/serverClock";

/**
 * "Ahora" (con la hora del servidor), que se renueva cada vez que la app
 * vuelve al primer plano. Sin temporizadores: para el saludo y la fecha basta
 * con que estén al día cuando el profesor vuelve a mirar.
 */
export function useForegroundNow(): number {
  const [now, setNow] = useState(serverNow);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") setNow(serverNow());
    });
    return () => subscription.remove();
  }, []);

  return now;
}
