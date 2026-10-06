import type { QueryClient } from "@tanstack/react-query";

import { queryClient } from "@/shared/config/queryClient";
import { ROLES } from "@/shared/config/roles";
import {
  useSessionStore,
  type SessionEndReason,
  type SessionUser,
} from "@/shared/store/sessionStore";
import { decodeSessionClaims } from "@/shared/utils/jwt";

import { biometricCredentialStore, type IBiometricCredentialStore } from "./biometricCredentialStore";
import { tokenStorage, type ITokenStorage } from "./tokenStorage";

/**
 * Inicio, recuperación y cierre de la sesión, en un solo sitio.
 *
 * El token es la única fuente de quién es el usuario: de sus claims salen el
 * rol, el usuario y la escuela. No se guarda nada de eso aparte.
 */
export function createSessionService(deps: {
  tokens: ITokenStorage;
  /** Tras una baja, la biometría guardada sería de una cuenta que ya no existe. */
  biometric: Pick<IBiometricCredentialStore, "clear">;
  queryClient: Pick<QueryClient, "clear">;
  store: {
    setAuthenticated: (user: SessionUser) => void;
    setAnonymous: (endReason?: SessionEndReason) => void;
  };
}) {
  const end = async (reason: SessionEndReason = "manual"): Promise<void> => {
    await deps.tokens.clearTokens();
    // Cerrar sesión la conserva; dar de baja la cuenta, no.
    if (reason === "deleted") await deps.biometric.clear();
    deps.queryClient.clear();
    deps.store.setAnonymous(reason);
  };

  /** Deja la sesión abierta si el token es de un profesor; si no, la cierra. */
  const openFromToken = async (accessToken: string | null): Promise<boolean> => {
    const claims = accessToken ? decodeSessionClaims(accessToken) : undefined;
    if (claims?.roleId !== ROLES.TEACHER) {
      await end("expired");
      return false;
    }
    deps.store.setAuthenticated({ userId: claims.userId, dbId: claims.dbId });
    return true;
  };

  return {
    /**
     * Al arrancar. El access token dura 60 min en móvil, así que lo normal es
     * que esté caducado: manda que haya refresh token (la primera petición
     * renueva el acceso sola). Los claims se leen igual aunque haya caducado.
     */
    async restore(): Promise<void> {
      try {
        const refreshToken = await deps.tokens.getRefreshToken();
        if (!refreshToken) {
          await end(null);
          return;
        }
        await openFromToken(await deps.tokens.getAccessToken());
      } catch {
        // El Keychain no respondió: se enseña el login, pero sin borrar unos
        // tokens que pueden seguir siendo válidos.
        deps.store.setAnonymous();
      }
    },

    /**
     * Guarda los tokens sin abrir la sesión: las peticiones ya van
     * autenticadas, pero los guards no llevan al inicio (p. ej. mientras el
     * profesor acepta los términos tras el login).
     */
    async saveTokens(accessToken: string, refreshToken: string): Promise<void> {
      await deps.tokens.setTokens(accessToken, refreshToken);
    },

    /** Tras login o registro: guarda los tokens y abre la sesión. */
    async start(accessToken: string, refreshToken: string): Promise<boolean> {
      await deps.tokens.setTokens(accessToken, refreshToken);
      return openFromToken(accessToken);
    },

    /**
     * Cierre de sesión. Por defecto `manual` (lo decidió el profesor);
     * `expired` cuando Core la da por muerta; `deleted` tras dar de baja la
     * cuenta, que además borra la biometría.
     */
    end,
  };
}

export const session = createSessionService({
  tokens: tokenStorage,
  biometric: biometricCredentialStore,
  queryClient,
  store: useSessionStore.getState(),
});
