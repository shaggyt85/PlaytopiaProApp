import type { SessionTokens } from "@/shared/services/tokenRefresh";
import { errorMessageOrNull } from "@/shared/utils/getErrorMessage";

import { useAcceptPendingTerms } from "../../hooks/useAcceptPendingTerms";
import { LegalModal } from "../LegalModal";

interface PendingTermsModalProps {
  /** Tokens de un login al que le faltan los términos vigentes; null = cerrado. */
  tokens: SessionTokens | null;
  /** Al cerrarlo sin aceptar (la pantalla olvida ese login). */
  onDismiss: () => void;
}

/**
 * Modal de los términos tras entrar sin tenerlos aceptados, con contraseña o
 * con biometría. Al aceptarlos se abre la sesión; al cerrarlo, no se entra y
 * se borran los tokens de ese login (`useAcceptPendingTerms`). Solo pinta.
 */
export function PendingTermsModal({ tokens, onDismiss }: PendingTermsModalProps) {
  const { acceptAndEnter, reject, error } = useAcceptPendingTerms(tokens);

  return (
    <LegalModal
      document={tokens ? "terms" : null}
      onAccept={acceptAndEnter}
      error={errorMessageOrNull(error)}
      onClose={() => {
        reject();
        onDismiss();
      }}
    />
  );
}
