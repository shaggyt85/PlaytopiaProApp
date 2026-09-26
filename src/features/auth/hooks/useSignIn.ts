import { useMutation } from "@tanstack/react-query";

import { decodeSessionClaims } from "@/shared/utils/jwt";

import type { SignInRequest } from "../schemas/auth.schema";
import { completeSignIn, type SignInOutcome } from "../services/completeSignIn";
import { signInService, type ISignInService } from "../services/signInService";
import { useBiometricOfferStore } from "../store/biometricOfferStore";
import { normalizeEmail } from "../utils/email";

export type SignInResult = SignInOutcome;

/**
 * Login del profesor con contraseña. Lo que pasa después (términos, abrir la
 * sesión) es lo mismo que con biometría: `completeSignIn`. Solo este login
 * deja la oferta de activar la biometría.
 */
export function useSignIn(service: ISignInService = signInService) {
  return useMutation({
    mutationFn: async (request: SignInRequest): Promise<SignInResult> => {
      const outcome = await completeSignIn(await service.signIn(request));
      const userId = decodeSessionClaims(outcome.tokens.access_token)?.userId;
      if (userId !== undefined) {
        useBiometricOfferStore.getState().setOffer(normalizeEmail(request.username), userId);
      }
      return outcome;
    },
  });
}
