import { errorMessageOrNull } from "@/shared/utils/getErrorMessage";

import { useAcceptPendingTerms } from "../../hooks/useAcceptPendingTerms";
import type { SignInOutcome } from "../../services/completeSignIn";
import { LegalModal } from "../LegalModal";

interface PendingTermsModalProps {
  /** Un login al que le faltan los términos vigentes (sus tokens y quién es); null = cerrado. */
  pending: SignInOutcome | null;
  /** Al cerrarlo sin aceptar (la pantalla olvida ese login). */
  onDismiss: () => void;
}

/**
 * Modal de los términos tras entrar sin tenerlos aceptados, con contraseña o
 * con biometría. Al aceptarlos se abre la sesión; al cerrarlo, no se entra y
 * se borran los tokens de ese login (`useAcceptPendingTerms`). Solo pinta.
 */
export function PendingTermsModal({ pending, onDismiss }: PendingTermsModalProps) {
  const { acceptAndEnter, reject, error } = useAcceptPendingTerms(pending);

  return (
    <LegalModal
      document={pending ? "terms" : null}
      onAccept={acceptAndEnter}
      error={errorMessageOrNull(error)}
      onClose={() => {
        reject();
        onDismiss();
      }}
    />
  );
}
