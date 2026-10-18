import { session, type ISessionService } from "@/shared/services/session";
import type { SessionTokens } from "@/shared/services/tokenRefresh";
import { decodeSessionClaims } from "@/shared/utils/jwt";

import { useAcceptTerms, type AcceptTermsOptions } from "./useAcceptTerms";

interface Options extends AcceptTermsOptions {
  sessionService?: Pick<ISessionService, "start" | "end">;
}

/**
 * Los términos pendientes tras entrar, el caso de uso entero: el profesor sale
 * del token de ese acceso (`completeSignIn` ya lo comprobó), se aceptan los
 * términos y, si Core los acepta, se abre la sesión con esos tokens. Al
 * rechazarlos, no se entra y se borran. El modal solo pinta y llama a esto.
 */
export function useAcceptPendingTerms(
  tokens: SessionTokens | null,
  { service, sessionService = session }: Options = {},
) {
  const { accept, reject, error } = useAcceptTerms({ service, sessionService });

  const acceptAndEnter = async () => {
    if (!tokens) return;
    const teacherId = decodeSessionClaims(tokens.access_token)?.userId;
    if (teacherId === undefined) return;
    if (await accept(teacherId)) await sessionService.start(tokens.access_token, tokens.refresh_token);
  };

  return { acceptAndEnter, reject, error };
}
