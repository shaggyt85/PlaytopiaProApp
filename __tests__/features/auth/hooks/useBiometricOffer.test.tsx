import { QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react-native";
import type { ReactNode } from "react";

import { useBiometricOffer } from "@/features/auth/hooks/useBiometricOffer";
import type { EnableResult, IBiometricService } from "@/features/auth/services/biometricService";
import {
  BIOMETRIC_OFFER_TTL_MS,
  useBiometricOfferStore,
} from "@/features/auth/store/biometricOfferStore";
import { createQueryClient } from "@/shared/config/queryClient";

import { settle } from "../../../helpers/settle";

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={createQueryClient()}>{children}</QueryClientProvider>
);

interface Options {
  available?: boolean;
  savedEmail?: string | null;
  enable?: EnableResult;
  refreshToken?: string | null;
}

function build({ available = true, savedEmail = null, enable = "enabled", refreshToken = "refresco-vigente" }: Options = {}) {
  const service: jest.Mocked<IBiometricService> = {
    isAvailable: jest.fn().mockResolvedValue(available),
    savedEmail: jest.fn().mockResolvedValue(savedEmail),
    enable: jest.fn().mockResolvedValue(enable),
    unlock: jest.fn(),
    disable: jest.fn(),
  };
  const tokens = { getRefreshToken: jest.fn().mockResolvedValue(refreshToken) };
  const hook = renderHook(() => useBiometricOffer({ service, tokens }), { wrapper });
  return { service, tokens, ...hook };
}

const offer = () => useBiometricOfferStore.getState().offer;

/** Pulsa "Activar" y deja que TanStack avise del final de la mutación. */
async function enableNow(hook: ReturnType<typeof useBiometricOffer>) {
  let outcome;
  await act(async () => {
    outcome = await hook.enable();
  });
  await settle();
  return outcome;
}

describe("useBiometricOffer", () => {
  beforeEach(() => {
    useBiometricOfferStore.getState().clear();
    useBiometricOfferStore.getState().setOffer("ana@club.com", 42);
  });

  it("sin oferta no se muestra", async () => {
    useBiometricOfferStore.getState().clear();
    const { result, service } = build();
    await settle();

    expect(result.current.visible).toBe(false);
    expect(service.isAvailable).not.toHaveBeenCalled();
  });

  it("con oferta vigente, biometría disponible y sin activar en esa cuenta, se muestra", async () => {
    const { result } = build();

    await waitFor(() => expect(result.current.visible).toBe(true));
  });

  it("si otra cuenta la tiene activada también se ofrece (activarla la sustituye)", async () => {
    const { result } = build({ savedEmail: "otro@club.com" });

    await waitFor(() => expect(result.current.visible).toBe(true));
  });

  it.each([
    ["el móvil no puede usarla", { available: false }],
    ["esa cuenta ya la tiene", { savedEmail: "ANA@club.com" }],
  ])("no se ofrece si %s, y la oferta se borra", async (_, options: Options) => {
    const { result } = build(options);

    await waitFor(() => expect(offer()).toBeNull());
    expect(result.current.visible).toBe(false);
  });

  it("una oferta caducada no se muestra y se borra", async () => {
    jest.spyOn(Date, "now").mockReturnValue(Date.now() + BIOMETRIC_OFFER_TTL_MS);
    const { result, service } = build();

    await waitFor(() => expect(offer()).toBeNull());
    expect(result.current.visible).toBe(false);
    expect(service.isAvailable).not.toHaveBeenCalled();
    jest.restoreAllMocks();
  });

  it("al activarla usa el refresh token vigente y cierra la oferta", async () => {
    const { result, service } = build();
    await waitFor(() => expect(result.current.visible).toBe(true));

    const outcome = await enableNow(result.current);

    expect(outcome).toBe("enabled");
    expect(service.enable).toHaveBeenCalledWith(
      { email: "ana@club.com", userId: 42, refreshToken: "refresco-vigente" },
      { message: "Verifica tu identidad para activar la biometría", cancel: "Cancelar" },
    );
    expect(offer()).toBeNull();
    expect(result.current.visible).toBe(false);
  });

  it.each<EnableResult>(["cancelled", "failed", "unavailable"])(
    "si el resultado es %s el panel sigue abierto",
    async (enableResult) => {
      const { result } = build({ enable: enableResult });
      await waitFor(() => expect(result.current.visible).toBe(true));

      const outcome = await enableNow(result.current);

      expect(outcome).toBe(enableResult);
      expect(result.current.visible).toBe(true);
    },
  );

  it("si caducó mientras estaba abierto, no la activa y se cierra", async () => {
    const { result, service } = build();
    await waitFor(() => expect(result.current.visible).toBe(true));
    jest.spyOn(Date, "now").mockReturnValue(Date.now() + BIOMETRIC_OFFER_TTL_MS);

    const outcome = await enableNow(result.current);

    expect(outcome).toBe("expired");
    expect(service.enable).not.toHaveBeenCalled();
    expect(offer()).toBeNull();
    jest.restoreAllMocks();
  });

  it("sin refresh token guardado cuenta como caducada", async () => {
    const { result, service } = build({ refreshToken: null });
    await waitFor(() => expect(result.current.visible).toBe(true));

    const outcome = await enableNow(result.current);

    expect(outcome).toBe("expired");
    expect(service.enable).not.toHaveBeenCalled();
  });

  it("un fallo inesperado cuenta como failed", async () => {
    const { result, service } = build();
    service.enable.mockRejectedValue(new Error("SecureStore"));
    await waitFor(() => expect(result.current.visible).toBe(true));

    const outcome = await enableNow(result.current);

    expect(outcome).toBe("failed");
  });

  it("«Ahora no» la borra y no se vuelve a ofrecer", async () => {
    const { result } = build();
    await waitFor(() => expect(result.current.visible).toBe(true));

    act(() => result.current.dismiss());

    expect(offer()).toBeNull();
    expect(result.current.visible).toBe(false);
  });
});
