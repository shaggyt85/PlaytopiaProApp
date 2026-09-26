import { useMutation } from "@tanstack/react-query";

import {
  passwordRecoveryService,
  type IPasswordRecoveryService,
} from "../services/passwordRecoveryService";

/**
 * Pide el correo de recuperación. `isSuccess` es lo que decide si la pantalla
 * enseña la confirmación: no hay otro estado de "enviado".
 */
export function usePasswordRecovery(service: IPasswordRecoveryService = passwordRecoveryService) {
  return useMutation({
    mutationFn: (email: string) => service.requestRecovery(email),
  });
}
