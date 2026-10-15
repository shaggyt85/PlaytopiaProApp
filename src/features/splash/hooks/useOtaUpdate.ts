import * as Updates from "expo-updates";
import { useEffect, useRef, useState } from "react";

import { OTA_CHECK_TIMEOUT_MS, OTA_RELOAD_OPTIONS } from "../config/otaUpdate";
import { otaPhase } from "../utils/otaPhase";

export interface OtaUpdate {
  /** El splash no se va mientras sea true: hay una actualización en camino. */
  holdSplash: boolean;
  /** Progreso de la descarga (0 a 1) mientras se descarga o se reinicia; si no, null. */
  progress: number | null;
}

/**
 * La actualización por OTA del arranque. La busca y la descarga expo-updates
 * solo al abrir la app (`checkAutomatically`); aquí solo se lee su estado
 * (`useUpdates()`, con el progreso real) y, cuando termina, se reinicia para
 * entrar ya con la versión nueva.
 *
 * Si la pregunta inicial pasa de `OTA_CHECK_TIMEOUT_MS`, o la descarga falla,
 * se deja de esperar y ya no se reinicia en este arranque: la actualización,
 * si llega a bajar, se aplica sola en la próxima apertura.
 */
export function useOtaUpdate(): OtaUpdate {
  const updates = Updates.useUpdates();
  const phase = Updates.isEnabled ? otaPhase(updates) : "idle";
  const [gaveUp, setGaveUp] = useState(false);
  const wasActive = useRef(false);
  const reloadRequested = useRef(false);

  // Tope a la pregunta inicial.
  useEffect(() => {
    if (phase !== "checking") return;
    const timer = setTimeout(() => setGaveUp(true), OTA_CHECK_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [phase]);

  // Si vuelve a `idle` sin pasar por el reinicio (no había nada o falló), no
  // se vuelve a esperar en este arranque.
  useEffect(() => {
    if (phase !== "idle") wasActive.current = true;
    else if (wasActive.current) setGaveUp(true);
  }, [phase]);

  const active = !gaveUp && phase !== "idle";
  const restarting = active && phase === "restarting";

  useEffect(() => {
    if (!restarting || reloadRequested.current) return;
    reloadRequested.current = true;
    // Si no se puede reiniciar, se entra con la versión que hay.
    Updates.reloadAsync(OTA_RELOAD_OPTIONS).catch(() => setGaveUp(true));
  }, [restarting]);

  return {
    holdSplash: active,
    progress: !active || phase === "checking" ? null : restarting ? 1 : (updates.downloadProgress ?? 0),
  };
}
