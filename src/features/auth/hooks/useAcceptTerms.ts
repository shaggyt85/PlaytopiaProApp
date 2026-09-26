import { useMutation } from "@tanstack/react-query";

import { session } from "@/shared/services/session";
import type { SessionTokens } from "@/shared/services/tokenRefresh";
import { decodeSessionClaims } from "@/shared/utils/jwt";

import { TERMS_VERSION } from "../schemas/signUp.schema";
import { termsService, type ITermsService } from "../services/termsService";

/**
 * Acepta la versión vigente de los términos (Core sella la fecha) y abre la
 * sesión con los tokens con los que se entró. El profesor sale del token.
 */
export function useAcceptTerms(service: ITermsService = termsService) {
  return useMutation({
    mutationFn: async (tokens: SessionTokens) => {
      const teacherId = decodeSessionClaims(tokens.access_token)?.userId;
      if (teacherId === undefined) throw new Error("El access token no dice qué profesor es.");
      await service.acceptTerms(teacherId, TERMS_VERSION);
      await session.start(tokens.access_token, tokens.refresh_token);
    },
  });
}
