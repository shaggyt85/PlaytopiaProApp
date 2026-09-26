import { useMutation } from "@tanstack/react-query";

import { toSignUpRequest, type SignUpForm } from "../schemas/signUp.schema";
import { signUpService, type ISignUpService } from "../services/signUpService";

/**
 * Alta del profesor. No abre sesión: igual que en la app de alumnos, tras el
 * alta el profesor entra con su email y contraseña. La pantalla decide adónde
 * ir al terminar.
 */
export function useSignUp(service: ISignUpService = signUpService) {
  return useMutation({
    mutationFn: (form: SignUpForm) => service.signUp(toSignUpRequest(form)),
  });
}
