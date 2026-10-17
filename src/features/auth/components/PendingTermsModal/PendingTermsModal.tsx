import { session } from "@/shared/services/session";
import type { SessionTokens } from "@/shared/services/tokenRefresh";
import { errorMessageOrNull } from "@/shared/utils/getErrorMessage";
import { ignoreRejection } from "@/shared/utils/ignoreRejection";

import { useAcceptTerms } from "../../hooks/useAcceptTerms";
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
 * se borran los tokens de ese login.
 */
export function PendingTermsModal({ tokens, onDismiss }: PendingTermsModalProps) {
  const accept = useAcceptTerms();

  return (
    <LegalModal
      document={tokens ? "terms" : null}
      onAccept={async () => {
        if (tokens) await ignoreRejection(accept.mutateAsync(tokens));
      }}
      error={errorMessageOrNull(accept.error)}
      onClose={() => {
        accept.reset();
        session.end();
        onDismiss();
      }}
    />
  );
}
