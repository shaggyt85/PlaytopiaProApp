import type { ITokenStorage } from "./tokenStorage";

/**
 * Resultado de intentar renovar la sesión. Solo `rechazado` significa que la
 * sesión está muerta:
 * - `rechazado`: no había refresh token, o Core lo rechazó (4xx). Toca volver
 *   al login.
 * - `sin_respuesta`: red, timeout, Keychain o 5xx. No se sabe si la sesión
 *   vale, así que NO se cierra.
 */
export type RefreshResult =
  | { ok: true; accessToken: string }
  | { ok: false; reason: "rechazado" | "sin_respuesta" };

export interface RefreshedTokens {
  access_token: string;
  refresh_token: string;
}

/**
 * Crea la función que renueva la sesión con el refresh token.
 *
 * Es de un solo vuelo: si varias peticiones reciben 401 a la vez, todas
 * esperan al mismo refresh. Importa porque Core rota el refresh token en cada
 * uso: dos refresh simultáneos con el mismo token harían que el segundo fuera
 * rechazado y cerrara una sesión válida.
 */
export function createSessionRefresher(deps: {
  tokens: ITokenStorage;
  requestRefresh: (refreshToken: string) => Promise<RefreshedTokens>;
}): () => Promise<RefreshResult> {
  let inFlight: Promise<RefreshResult> | null = null;

  const run = async (): Promise<RefreshResult> => {
    try {
      const refreshToken = await deps.tokens.getRefreshToken();
      if (!refreshToken) return { ok: false, reason: "rechazado" };

      const refreshed = await deps.requestRefresh(refreshToken);
      await deps.tokens.setTokens(
        refreshed.access_token,
        refreshed.refresh_token,
      );
      return { ok: true, accessToken: refreshed.access_token };
    } catch (error) {
      const status = (error as { response?: { status?: number } })?.response
        ?.status;
      const rechazado =
        typeof status === "number" && status >= 400 && status < 500;
      return { ok: false, reason: rechazado ? "rechazado" : "sin_respuesta" };
    }
  };

  return () => {
    if (!inFlight) {
      inFlight = run().finally(() => {
        inFlight = null;
      });
    }
    return inFlight;
  };
}
