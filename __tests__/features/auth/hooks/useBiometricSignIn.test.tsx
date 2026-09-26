import { QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react-native";
import type { ReactNode } from "react";

import { MAX_BIOMETRIC_FAILURES, useBiometricSignIn } from "@/features/auth/hooks/useBiometricSignIn";
import type { IBiometricService, UnlockResult } from "@/features/auth/services/biometricService";
import { completeSignIn } from "@/features/auth/services/completeSignIn";
import { createQueryClient } from "@/shared/config/queryClient";

import { signInTokens } from "../../../helpers/authFactories";

jest.mock("@/features/auth/services/completeSignIn", () => ({ completeSignIn: jest.fn() }));

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={createQueryClient()}>{children}</QueryClientProvider>
);

const saved = { email: "ana@club.com", userId: 42, refreshToken: "refresco-guardado" };
const newTokens = { access_token: signInTokens.access_token, refresh_token: "refresco-nuevo" };

function build(unlock: UnlockResult = { status: "ok", credentials: saved }) {
  const service: jest.Mocked<IBiometricService> = {
    isAvailable: jest.fn().mockResolvedValue(true),
    savedEmail: jest.fn().mockResolvedValue(saved.email),
    enable: jest.fn(),
    unlock: jest.fn().mockResolvedValue(unlock),
    disable: jest.fn().mockResolvedValue(undefined),
  };
  const refresh = jest.fn().mockResolvedValue(newTokens);
  const hook = renderHook(() => useBiometricSignIn({ service, refresh }), { wrapper });
  return { service, refresh, ...hook };
}

describe("useBiometricSignIn", () => {
  beforeEach(() => {
    jest.mocked(completeSignIn).mockResolvedValue({ tokens: newTokens, termsPending: false });
  });

  it("carga si hay biometría y su email, y la ofrece solo para ese email", async () => {
    const { result } = build();

    await waitFor(() => expect(result.current.loaded).toBe(true));

    expect(result.current.savedEmail).toBe("ana@club.com");
    expect(result.current.canUseFor(" ANA@club.com ")).toBe(true);
    expect(result.current.canUseFor("otro@club.com")).toBe(false);
  });

  it("verifica, renueva con el token guardado y termina como el login con contraseña", async () => {
    const { result, service, refresh } = build();
    await waitFor(() => expect(result.current.loaded).toBe(true));

    await act(() => result.current.signIn());

    expect(service.unlock).toHaveBeenCalledWith({
      message: "Verifica tu identidad para entrar en Playtopia Pro",
      cancel: "Cancelar",
    });
    expect(refresh).toHaveBeenCalledWith("refresco-guardado");
    expect(completeSignIn).toHaveBeenCalledWith(newTokens);
    expect(result.current.message).toBeNull();
  });

  it("si le faltan los términos, devuelve los tokens para el modal", async () => {
    jest.mocked(completeSignIn).mockResolvedValue({ tokens: newTokens, termsPending: true });
    const { result } = build();
    await waitFor(() => expect(result.current.loaded).toBe(true));

    await act(() => result.current.signIn());

    await waitFor(() => expect(result.current.pendingTokens).toEqual(newTokens));
  });

  it("si cancela no pasa nada: ni aviso ni fallo", async () => {
    const { result, refresh } = build({ status: "cancelled" });
    await waitFor(() => expect(result.current.loaded).toBe(true));

    await act(() => result.current.signIn());

    expect(refresh).not.toHaveBeenCalled();
    expect(result.current.message).toBeNull();
  });

  it(`si la verificación falla avisa, y tras ${MAX_BIOMETRIC_FAILURES} fallos pide la contraseña`, async () => {
    const { result } = build({ status: "failed" });
    await waitFor(() => expect(result.current.loaded).toBe(true));

    await act(() => result.current.signIn());
    await waitFor(() =>
      expect(result.current.message).toBe("No se ha podido verificar tu identidad. Inténtalo de nuevo."),
    );

    for (let i = 1; i < MAX_BIOMETRIC_FAILURES; i++) await act(() => result.current.signIn());

    await waitFor(() => expect(result.current.message).toBe("Demasiados intentos. Entra con tu contraseña."));
    expect(result.current.canUseFor("ana@club.com")).toBe(false);
  });

  it("si Core rechaza el token guardado, desactiva la biometría y pide la contraseña", async () => {
    const { result, service, refresh } = build();
    refresh.mockRejectedValue({ response: { status: 401 } });
    await waitFor(() => expect(result.current.loaded).toBe(true));

    await act(() => result.current.signIn());

    expect(service.disable).toHaveBeenCalled();
    await waitFor(() =>
      expect(result.current.message).toBe(
        "Tu acceso con biometría ha caducado. Entra con tu contraseña para volver a activarlo.",
      ),
    );
    expect(result.current.canUseFor("ana@club.com")).toBe(false);
  });

  it("sin red avisa y conserva la biometría", async () => {
    const { result, service, refresh } = build();
    refresh.mockRejectedValue(new Error("Network Error"));
    await waitFor(() => expect(result.current.loaded).toBe(true));

    await act(() => result.current.signIn());

    expect(service.disable).not.toHaveBeenCalled();
    await waitFor(() =>
      expect(result.current.message).toBe("Sin conexión. Revisa tu red e inténtalo de nuevo."),
    );
    expect(result.current.canUseFor("ana@club.com")).toBe(true);
  });
});
