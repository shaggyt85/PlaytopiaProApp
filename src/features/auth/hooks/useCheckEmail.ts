import { useMutation } from "@tanstack/react-query";

import { checkEmailService, type ICheckEmailService } from "../services/checkEmailService";

/**
 * Comprueba si el email tiene cuenta. Es una lectura, pero la dispara el
 * usuario al pulsar Continuar: por eso es una mutación y no una query.
 */
export function useCheckEmail(service: ICheckEmailService = checkEmailService) {
  return useMutation({
    mutationFn: (email: string) => service.checkEmail(email),
  });
}
