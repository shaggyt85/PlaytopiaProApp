import { useCallback, useEffect, useState } from "react";

import type { IBiometricService } from "../services/biometricService";

interface BiometricStatus {
  /** Ya se sabe si hay biometría y qué email tiene guardado. */
  loaded: boolean;
  /** El móvil puede usarla. */
  available: boolean;
  /** Email con la biometría activada, o null. */
  savedEmail: string | null;
}

const INITIAL: BiometricStatus = { loaded: false, available: false, savedEmail: null };

/**
 * ¿Puede el móvil usar la biometría y para qué email está activada? Se lee una
 * vez al montar. Si falla, cuenta como sin biometría.
 */
export function useBiometricStatus(service: IBiometricService) {
  const [status, setStatus] = useState<BiometricStatus>(INITIAL);

  useEffect(() => {
    let mounted = true;
    Promise.all([service.isAvailable(), service.savedEmail()])
      .then(([available, savedEmail]) => {
        if (mounted) setStatus({ loaded: true, available, savedEmail });
      })
      .catch(() => {
        if (mounted) setStatus({ ...INITIAL, loaded: true });
      });
    return () => {
      mounted = false;
    };
  }, [service]);

  /** La biometría se ha desactivado: ya no hay email guardado. */
  const forgetSavedEmail = useCallback(() => setStatus((s) => ({ ...s, savedEmail: null })), []);

  return { ...status, forgetSavedEmail };
}
