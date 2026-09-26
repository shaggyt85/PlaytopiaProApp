import { useMutation } from "@tanstack/react-query";

import { session } from "@/shared/services/session";

import type { SignInResponse } from "../schemas/auth.schema";
import { TERMS_VERSION } from "../schemas/signUp.schema";
import { termsService, type ITermsService } from "../services/termsService";

/**
 * Acepta la versión vigente de los términos tras el login (Core sella la fecha)
 * y abre la sesión con los tokens de ese login.
 */
export function useAcceptTerms(service: ITermsService = termsService) {
  return useMutation({
    mutationFn: async (tokens: SignInResponse) => {
      await service.acceptTerms(tokens.id, TERMS_VERSION);
      await session.start(tokens.access_token, tokens.refresh_token);
    },
  });
}
