import { useMutation } from "@tanstack/react-query";

import type { SessionTokens } from "@/shared/services/tokenRefresh";

import type { SignInRequest } from "../schemas/auth.schema";
import { completeSignIn, type SignInOutcome } from "../services/completeSignIn";
import { signInService, type ISignInService } from "../services/signInService";
import { useBiometricOfferStore } from "../store/biometricOfferStore";
import { normalizeEmail } from "../utils/email";

export type SignInResult = SignInOutcome;

interface Deps {
  service: ISignInService;
  /** Lo que sigue a tener tokens (términos y sesión): inyectable, como el servicio. */
  complete: (tokens: SessionTokens) => Promise<SignInOutcome>;
}

const defaultDeps: Deps = { service: signInService, complete: completeSignIn };

/**
 * Login del profesor con contraseña. Lo que pasa después (términos, abrir la
 * sesión) es lo mismo que con biometría: `completeSignIn`. Solo este login
 * deja la oferta de activar la biometría.
 */
export function useSignIn({ service, complete }: Deps = defaultDeps) {
  return useMutation({
    mutationFn: async (request: SignInRequest): Promise<SignInResult> => {
      const outcome = await complete(await service.signIn(request));
      useBiometricOfferStore.getState().setOffer(normalizeEmail(request.username), outcome.userId);
      return outcome;
    },
  });
}
