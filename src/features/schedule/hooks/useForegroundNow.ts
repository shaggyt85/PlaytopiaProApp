import { useEffect, useState } from "react";
import { AppState } from "react-native";

import { serverNow } from "@/shared/utils/serverClock";

const MINUTE_MS = 60_000;

interface Options {
  /** Además, al cambiar de minuto (la línea de «ahora» de la agenda). */
  everyMinute?: boolean;
}

/**
 * "Ahora" (con la hora del servidor), que se renueva cada vez que la app
 * vuelve al primer plano. Para el saludo y la fecha basta con eso; la agenda
 * pide además `everyMinute`, que lo renueva al empezar cada minuto (alineado al
 * segundo 0, para que la hora de la línea no vaya un minuto por detrás).
 */
export function useForegroundNow({ everyMinute = false }: Options = {}): number {
  const [now, setNow] = useState(serverNow);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") setNow(serverNow());
    });
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (!everyMinute) return;
    let timer: ReturnType<typeof setTimeout>;
    const schedule = () => {
      const msToNextMinute = MINUTE_MS - (serverNow() % MINUTE_MS);
      timer = setTimeout(() => {
        setNow(serverNow());
        schedule();
      }, msToNextMinute);
    };
    schedule();
    return () => clearTimeout(timer);
  }, [everyMinute]);

  return now;
}
