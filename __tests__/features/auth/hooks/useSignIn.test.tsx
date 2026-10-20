import { QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react-native";
import type { ReactNode } from "react";

import { useSignIn } from "@/features/auth/hooks/useSignIn";
import type { ISignInService } from "@/features/auth/services/signInService";
import { useBiometricOfferStore } from "@/features/auth/store/biometricOfferStore";
import { createQueryClient } from "@/shared/config/queryClient";

import { signInTokens } from "../../../helpers/authFactories";
import { settle } from "../../../helpers/settle";

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={createQueryClient()}>{children}</QueryClientProvider>
);
const credentials = { username: "a@b.com", password: "x" };

/** El login de Core y lo que sigue (términos y sesión), los dos falsos. */
function build(signIn: jest.Mock, termsPending = false) {
  const service: ISignInService = { signIn };
  const complete = jest.fn().mockResolvedValue({ tokens: signInTokens, userId: 42, termsPending });
  const hook = renderHook(() => useSignIn({ service, complete }), { wrapper });
  return { ...hook, service, complete };
}

describe("useSignIn", () => {
  beforeEach(() => useBiometricOfferStore.getState().clear());

  it("con los tokens del login hace lo mismo que la biometría: completeSignIn", async () => {
    const { result, service, complete } = build(jest.fn().mockResolvedValue(signInTokens), true);

    await act(() => result.current.mutateAsync(credentials));

    expect(service.signIn).toHaveBeenCalledWith(credentials);
    expect(complete).toHaveBeenCalledWith(signInTokens);
    await waitFor(() => expect(result.current.data?.termsPending).toBe(true));
  });

  it("deja la oferta de activar la biometría para ese email y profesor", async () => {
    const { result } = build(jest.fn().mockResolvedValue(signInTokens));

    await act(() => result.current.mutateAsync({ username: " A@B.com ", password: "x" }));
    await settle();

    expect(useBiometricOfferStore.getState().offer).toMatchObject({ email: "a@b.com", userId: 42 });
  });

  it("si Core rechaza el login no sigue", async () => {
    const { result, complete } = build(jest.fn().mockRejectedValue(new Error("401")));

    await act(() => result.current.mutateAsync(credentials).catch(() => undefined));
    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(complete).not.toHaveBeenCalled();
    expect(useBiometricOfferStore.getState().offer).toBeNull();
  });
});
