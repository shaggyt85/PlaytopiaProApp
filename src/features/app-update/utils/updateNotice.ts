import type { UpdateType, VersionCheck } from "../schemas/versionCheck.schema";

/**
 * Qué aviso se enseña. Sin respuesta de Core (no ha llegado, o falló) no se
 * enseña nada: a un profesor no se le bloquea la app por un problema de red.
 * Con una respuesta guardada, manda esa, aunque falle la siguiente.
 */
export function updateNotice(data: VersionCheck | undefined): UpdateType {
  return data?.update_type ?? "none";
}
