import { useMutation } from "@tanstack/react-query";
import { useCallback, useState } from "react";

import { useTranslation } from "@/shared/hooks/useTranslation";
import type { TranslationKey } from "@/shared/locales";
import {
  isRefreshRejected,
  requestTokenRefresh,
  type SessionTokens,
} from "@/shared/services/tokenRefresh";
import { errorMessageOrNull } from "@/shared/utils/getErrorMessage";
import { ignoreRejection } from "@/shared/utils/ignoreRejection";

import { completeSignIn, type SignInOutcome } from "../services/completeSignIn";
import { biometricService, type IBiometricService } from "../services/biometricService";
import { sameEmail } from "../utils/email";
import { firstError } from "../utils/signInMode";

import { useBiometricStatus } from "./useBiometricStatus";

/** Tras tantos fallos seguidos se deja de ofrecer: se entra con contraseña. */
export const MAX_BIOMETRIC_FAILURES = 3;

type Attempt =
  | { status: "signed-in"; outcome: SignInOutcome }
  | { status: "cancelled" }
  /** La verificación no se superó. */
  | { status: "failed" }
  /** Core rechazó el token guardado: la biometría se desactiva. */
  | { status: "expired" }
  /** Sin red: la biometría se conserva. */
  | { status: "offline" };

/** El texto de cada resultado que se enseña; los demás (entró, canceló) no dicen nada. */
const RESULT_MESSAGE: Partial<Record<Attempt["status"], TranslationKey>> = {
  failed: "auth.biometric.failed",
  expired: "auth.biometric.expired",
  offline: "errors.network",
};

interface Deps {
  service: IBiometricService;
  refresh: (refreshToken: string) => Promise<SessionTokens>;
  /** Lo que sigue a tener tokens (términos y sesión), el mismo que con contraseña. */
  complete: (tokens: SessionTokens) => Promise<SignInOutcome>;
}

const defaultDeps: Deps = { service: biometricService, refresh: requestTokenRefresh, complete: completeSignIn };

/**
 * Entrar con biometría (código del móvil, huella o Face ID): verifica, renueva
 * la sesión con el refresh token guardado y termina como el login con
 * contraseña (`completeSignIn`). La pantalla solo pinta lo que devuelve.
 */
export function useBiometricSignIn({ service, refresh, complete }: Deps = defaultDeps) {
  const { t } = useTranslation();
  const { loaded, available, savedEmail, forgetSavedEmail } = useBiometricStatus(service);
  const [failures, setFailures] = useState(0);

  const attempt = useMutation({
    mutationFn: async (): Promise<Attempt> => {
      const unlocked = await service.unlock({
        message: t("auth.biometric.prompt"),
        cancel: t("common.cancel"),
      });
      if (unlocked.status === "not-enabled") return { status: "expired" };
      if (unlocked.status !== "ok") return { status: unlocked.status };

      let tokens: SessionTokens;
      try {
        tokens = await refresh(unlocked.credentials.refreshToken);
      } catch (error) {
        if (!isRefreshRejected(error)) return { status: "offline" };
        await service.disable();
        return { status: "expired" };
      }
      return { status: "signed-in", outcome: await complete(tokens) };
    },
    onSuccess: (result) => {
      if (result.status === "failed") setFailures((count) => count + 1);
      if (result.status === "expired") forgetSavedEmail();
      if (result.status === "signed-in") setFailures(0);
    },
  });

  const tooManyFailures = failures >= MAX_BIOMETRIC_FAILURES;

  /** ¿Se ofrece la biometría para este email? */
  const canUseFor = useCallback(
    (email: string) => available && !tooManyFailures && sameEmail(email, savedEmail),
    [available, tooManyFailures, savedEmail],
  );

  const result = attempt.data;
  const resultText = result ? RESULT_MESSAGE[result.status] : undefined;
  // El primero que haya: el error, el «demasiados intentos» y el del resultado.
  const message = firstError(
    errorMessageOrNull(attempt.error),
    tooManyFailures && t("auth.biometric.tooManyAttempts"),
    resultText && t(resultText),
  );

  return {
    /** Ya se sabe si hay biometría y qué email tiene guardado. */
    loaded,
    available,
    savedEmail,
    canUseFor,
    signIn: () => ignoreRejection(attempt.mutateAsync()),
    isPending: attempt.isPending,
    message,
    /** Una entrada a la que le faltan los términos vigentes (sus tokens y quién es). */
    pendingSignIn: result?.status === "signed-in" && result.outcome.termsPending ? result.outcome : null,
    /** Olvida el último intento (al cerrar el modal de términos o cambiar el email). */
    reset: attempt.reset,
  };
}
