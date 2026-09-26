import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { useTranslation } from "@/shared/hooks/useTranslation";
import { tokenStorage, type ITokenStorage } from "@/shared/services/tokenStorage";

import { biometricService, type EnableResult, type IBiometricService } from "../services/biometricService";
import { isOfferValid, useBiometricOfferStore, type BiometricOffer } from "../store/biometricOfferStore";
import { sameEmail } from "../utils/email";

/** Lo que pasó al pulsar "Activar biometría". `expired`: la oferta ya no vale. */
export type OfferResult = EnableResult | "expired";

interface Deps {
  service: IBiometricService;
  tokens: Pick<ITokenStorage, "getRefreshToken">;
}

const defaultDeps: Deps = { service: biometricService, tokens: tokenStorage };

/**
 * La oferta de activar la biometría tras entrar con contraseña: se muestra una
 * vez, si sigue vigente, el móvil puede usarla y esa cuenta no la tiene ya. Si
 * la tiene otra cuenta, activarla la sustituye. El panel solo pinta.
 */
export function useBiometricOffer({ service, tokens }: Deps = defaultDeps) {
  const { t } = useTranslation();
  const offer = useBiometricOfferStore((s) => s.offer);
  const clear = useBiometricOfferStore((s) => s.clear);
  // La oferta que ya pasó las comprobaciones: solo esa se muestra.
  const [approved, setApproved] = useState<BiometricOffer | null>(null);

  useEffect(() => {
    if (!offer) return;
    if (!isOfferValid(offer)) {
      clear();
      return;
    }
    let mounted = true;
    Promise.all([service.isAvailable(), service.savedEmail()])
      .then(([available, savedEmail]) => {
        if (!mounted) return;
        if (available && !sameEmail(savedEmail, offer.email)) setApproved(offer);
        else clear();
      })
      .catch(() => mounted && clear());
    return () => {
      mounted = false;
    };
  }, [offer, service, clear]);

  const enable = useMutation({
    mutationFn: async (): Promise<OfferResult> => {
      const current = useBiometricOfferStore.getState().offer;
      // El refresh token se lee ahora: es el vigente, aunque se haya renovado.
      const refreshToken = isOfferValid(current) ? await tokens.getRefreshToken() : null;
      if (!isOfferValid(current) || !refreshToken) return "expired";
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
    visible: offer !== null && approved === offer,
    /** Nunca lanza: un fallo inesperado cuenta como `failed`. */
    enable: (): Promise<OfferResult> => enable.mutateAsync().catch(() => "failed" as const),
    isEnabling: enable.isPending,
    /** "Ahora no", la X o tocar fuera: no se vuelve a ofrecer. */
    dismiss: clear,
  };
}
