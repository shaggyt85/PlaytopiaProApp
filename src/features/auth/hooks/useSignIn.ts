import { useMutation } from "@tanstack/react-query";

import { session } from "@/shared/services/session";

import type { SignInRequest, SignInResponse } from "../schemas/auth.schema";
import { TERMS_VERSION } from "../schemas/signUp.schema";
import { signInService, type ISignInService } from "../services/signInService";
import { termsService, type ITermsService } from "../services/termsService";

export interface SignInResult {
  tokens: SignInResponse;
  /** No tiene aceptada la versión vigente de los términos: la sesión sigue cerrada. */
  termsPending: boolean;
}

/**
 * Login del profesor. Si tiene aceptados los términos vigentes, abre la sesión
 * con `session.start()` y los guards llevan solos al inicio. Si no (p. ej. alta
 * desde el CRM), deja los tokens guardados sin abrir la sesión: la pantalla
 * pide aceptarlos con `useAcceptTerms`.
 */
export function useSignIn(
  service: ISignInService = signInService,
  terms: ITermsService = termsService,
) {
  return useMutation({
    mutationFn: async (request: SignInRequest): Promise<SignInResult> => {
      const tokens = await service.signIn(request);
      await session.saveTokens(tokens.access_token, tokens.refresh_token);
      try {
        const { terms_version } = await terms.getTerms(tokens.id);
        if (terms_version !== TERMS_VERSION) return { tokens, termsPending: true };
      } catch (error) {
        // Sin saber si los aceptó no se entra: se borran los tokens guardados.
        await session.end();
        throw error;
      }
      await session.start(tokens.access_token, tokens.refresh_token);
      return { tokens, termsPending: false };
    },
  });
}
