import { useMutation } from "@tanstack/react-query";

import type { SignInRequest } from "../schemas/auth.schema";
import { completeSignIn, type SignInOutcome } from "../services/completeSignIn";
import { signInService, type ISignInService } from "../services/signInService";

export type SignInResult = SignInOutcome;

/**
 * Login del profesor con contraseña. Lo que pasa después (términos, abrir la
 * sesión) es lo mismo que con biometría: `completeSignIn`.
 */
export function useSignIn(service: ISignInService = signInService) {
  return useMutation({
    mutationFn: async (request: SignInRequest): Promise<SignInResult> =>
      completeSignIn(await service.signIn(request)),
  });
}
