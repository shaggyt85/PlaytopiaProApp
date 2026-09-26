import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";

import { useTranslation } from "@/shared/hooks/useTranslation";
import { tokenStorage, type ITokenStorage } from "@/shared/services/tokenStorage";
import { useSessionStore } from "@/shared/store/sessionStore";

import { biometricService, type EnableResult, type IBiometricService } from "../services/biometricService";
import { isOfferValid, useBiometricOfferStore, type BiometricOffer } from "../store/biometricOfferStore";
import { sameEmail } from "../utils/email";

import { useBiometricStatus } from "./useBiometricStatus";

/** Lo que pasó al pulsar "Activar biometría". `expired`: la oferta ya no vale. */
export type OfferResult = EnableResult | "expired";

interface Deps {
  service: IBiometricService;
  tokens: Pick<ITokenStorage, "getRefreshToken">;
}

const defaultDeps: Deps = { service: biometricService, tokens: tokenStorage };

/**
 * ¿La oferta sigue vigente y es del profesor con la sesión abierta? Si un
 * profesor cierra sesión sin responderla y entra otro, no vale: se guardaría el
 * email de uno con la sesión del otro.
 */
const isOfferFor = (offer: BiometricOffer | null, userId: number | undefined): offer is BiometricOffer =>
  isOfferValid(offer) && offer.userId === userId;

/**
 * La oferta de activar la biometría tras entrar con contraseña: se muestra una
 * vez, si sigue vigente, es del profesor con la sesión abierta, el móvil puede
 * usarla y esa cuenta no la tiene ya. Si la tiene otra cuenta, activarla la
 * sustituye. El panel solo pinta.
 */
export function useBiometricOffer({ service, tokens }: Deps = defaultDeps) {
  const { t } = useTranslation();
  const offer = useBiometricOfferStore((s) => s.offer);
  const clear = useBiometricOfferStore((s) => s.clear);
  const sessionUserId = useSessionStore((s) => s.user?.userId);
  const { loaded, available, savedEmail } = useBiometricStatus(service);

  // Sin mirar el reloj: la caducidad se comprueba en el efecto y al activarla.
  const offerable =
    offer !== null && offer.userId === sessionUserId && available && !sameEmail(savedEmail, offer.email);

  // Se descarta para no ofrecerla más: caducada o de otro profesor, nada más
  // montar (antes de saber si hay biometría, que llega después); y, ya sabido,
  // si el móvil no puede usarla o esa cuenta ya la tiene.
  useEffect(() => {
    if (!offer) return;
    if (!isOfferFor(offer, sessionUserId) || (loaded && !offerable)) clear();
  }, [offer, sessionUserId, loaded, offerable, clear]);

  const enable = useMutation({
    mutationFn: async (): Promise<OfferResult> => {
      const current = useBiometricOfferStore.getState().offer;
      const valid = isOfferFor(current, useSessionStore.getState().user?.userId);
      // El refresh token se lee ahora: es el vigente, aunque se haya renovado.
      const refreshToken = valid ? await tokens.getRefreshToken() : null;
      if (!valid || !refreshToken) return "expired";
      return service.enable(
        { email: current.email, userId: current.userId, refreshToken },
        { message: t("auth.biometric.offer.prompt"), cancel: t("common.cancel") },
      );
    },
    onSuccess: (result) => {
      if (result === "enabled" || result === "expired") clear();
    },
  });

  return {
    visible: loaded && offerable,
    /** Nunca lanza: un fallo inesperado cuenta como `failed`. */
    enable: (): Promise<OfferResult> => enable.mutateAsync().catch(() => "failed" as const),
    isEnabling: enable.isPending,
    /** "Ahora no", la X o tocar fuera: no se vuelve a ofrecer. */
    dismiss: clear,
  };
}
