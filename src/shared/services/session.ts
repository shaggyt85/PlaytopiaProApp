import type { QueryClient } from "@tanstack/react-query";

import { queryClient } from "@/shared/config/queryClient";
import { ROLES } from "@/shared/config/roles";
import { useSessionStore, type SessionUser } from "@/shared/store/sessionStore";
import { decodeSessionClaims } from "@/shared/utils/jwt";

import { tokenStorage, type ITokenStorage } from "./tokenStorage";

/**
 * Inicio, recuperación y cierre de la sesión, en un solo sitio.
 *
 * El token es la única fuente de quién es el usuario: de sus claims salen el
 * rol, el usuario y la escuela. No se guarda nada de eso aparte.
 */
export function createSessionService(deps: {
  tokens: ITokenStorage;
  queryClient: Pick<QueryClient, "clear">;
  store: {
    setAuthenticated: (user: SessionUser) => void;
    setAnonymous: () => void;
  };
}) {
  const end = async (): Promise<void> => {
    await deps.tokens.clearTokens();
    deps.queryClient.clear();
    deps.store.setAnonymous();
  };

  /** Deja la sesión abierta si el token es de un profesor; si no, la cierra. */
  const openFromToken = async (accessToken: string | null): Promise<boolean> => {
    const claims = accessToken ? decodeSessionClaims(accessToken) : undefined;
    if (claims?.roleId !== ROLES.TEACHER) {
      await end();
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
          await end();
          return;
        }
        await openFromToken(await deps.tokens.getAccessToken());
      } catch {
        // El Keychain no respondió: se enseña el login, pero sin borrar unos
        // tokens que pueden seguir siendo válidos.
        deps.store.setAnonymous();
      }
    },

    /** Tras login o registro: guarda los tokens y abre la sesión. */
    async start(accessToken: string, refreshToken: string): Promise<boolean> {
      await deps.tokens.setTokens(accessToken, refreshToken);
      return openFromToken(accessToken);
    },

    /** Cierre de sesión: manual o porque Core la dio por muerta. */
    end,
  };
}

export const session = createSessionService({
  tokens: tokenStorage,
  queryClient,
  store: useSessionStore.getState(),
});
