import { useMutation } from "@tanstack/react-query";

import { session } from "@/shared/services/session";

import type { SignInRequest } from "../schemas/auth.schema";
import { signInService, type ISignInService } from "../services/signInService";

/**
 * Login del profesor. Si va bien, abre la sesión con `session.start()` y los
 * guards del layout llevan solos al inicio: aquí no se navega.
 */
export function useSignIn(service: ISignInService = signInService) {
  return useMutation({
    mutationFn: async (request: SignInRequest) => {
      const tokens = await service.signIn(request);
      await session.start(tokens.access_token, tokens.refresh_token);
      return tokens;
    },
  });
}
