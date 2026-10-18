import { errorMessageOrNull } from "@/shared/utils/getErrorMessage";

import { useOpenSessionTerms } from "../../hooks/useOpenSessionTerms";
import { LegalModal } from "../LegalModal";

/**
 * El modal de los términos con la sesión abierta (`useOpenSessionTerms`): sale
 * encima si no son los vigentes; cerrarlo cierra la sesión. Solo pinta.
 *
 * Va en el layout de las rutas con sesión, el último: encima de todo.
 */
export function OpenSessionTermsGate() {
  const { pending, acceptCurrent, reject, error } = useOpenSessionTerms();
  return (
    <LegalModal
      document={pending ? "terms" : null}
      onAccept={acceptCurrent}
      error={errorMessageOrNull(error)}
      onClose={reject}
    />
  );
}
