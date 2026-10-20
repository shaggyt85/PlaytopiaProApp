import { session, type ISessionService } from "@/shared/services/session";

import type { SignInOutcome } from "../services/completeSignIn";

import { useAcceptTerms, type AcceptTermsOptions } from "./useAcceptTerms";

interface Options extends AcceptTermsOptions {
  sessionService?: Pick<ISessionService, "start" | "end">;
}

/**
 * Los términos pendientes tras entrar, el caso de uso entero: el profesor llega
 * en el resultado de ese acceso (`completeSignIn` lo sacó del token), se aceptan los
 * términos y, si Core los acepta, se abre la sesión con esos tokens. Al
 * rechazarlos, no se entra y se borran. El modal solo pinta y llama a esto.
 */
export function useAcceptPendingTerms(
  pending: SignInOutcome | null,
  { service, sessionService = session }: Options = {},
) {
  const { accept, reject, error } = useAcceptTerms({ service, sessionService });

  const acceptAndEnter = async () => {
    if (!pending) return;
    const { tokens, userId } = pending;
    if (await accept(userId)) await sessionService.start(tokens.access_token, tokens.refresh_token);
  };

  return { acceptAndEnter, reject, error };
}
