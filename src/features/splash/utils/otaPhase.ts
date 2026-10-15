/** Lo que dice `useUpdates()` (expo-updates) de la actualización de este arranque. */
export interface OtaSnapshot {
  isStartupProcedureRunning: boolean;
  isChecking: boolean;
  isDownloading: boolean;
  isUpdatePending: boolean;
  isRestarting: boolean;
}

/**
 * En qué punto está la actualización por OTA del arranque:
 * - `checking`: preguntando al servidor si hay versión nueva;
 * - `downloading`: bajándola;
 * - `restarting`: ya está descargada, toca reiniciar para aplicarla;
 * - `idle`: nada que esperar (no había, o la descarga falló).
 */
export type OtaPhase = "idle" | "checking" | "downloading" | "restarting";

export function otaPhase(updates: OtaSnapshot): OtaPhase {
  if (updates.isUpdatePending || updates.isRestarting) return "restarting";
  if (updates.isDownloading) return "downloading";
  if (updates.isChecking || updates.isStartupProcedureRunning) return "checking";
  return "idle";
}
