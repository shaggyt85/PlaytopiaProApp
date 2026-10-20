import { QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react-native";
import type { ReactNode } from "react";

import { TERMS_VERSION } from "@/features/auth/config/terms";
import { useAcceptPendingTerms } from "@/features/auth/hooks/useAcceptPendingTerms";
import { createQueryClient } from "@/shared/config/queryClient";

import { signInTokens, teacherProfile } from "../../../helpers/authFactories";

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={createQueryClient()}>{children}</QueryClientProvider>
);

const tokens = { access_token: signInTokens.access_token, refresh_token: signInTokens.refresh_token };

const pendingSignIn = { tokens, userId: 42, termsPending: true };

const setup = (update: jest.Mock, pending: typeof pendingSignIn | null = pendingSignIn) => {
  const sessionService = { start: jest.fn().mockResolvedValue(true), end: jest.fn().mockResolvedValue(undefined) };
  const view = renderHook(() => useAcceptPendingTerms(pending, { service: { update }, sessionService }), {
    wrapper,
  });
  return { ...view, sessionService };
};

describe("useAcceptPendingTerms", () => {
  it("acepta los términos del profesor de esa entrada y abre la sesión con esos tokens", async () => {
    const update = jest.fn().mockResolvedValue(teacherProfile());
    const { result, sessionService } = setup(update);

    await act(() => result.current.acceptAndEnter());

    expect(update).toHaveBeenCalledWith(42, { terms_version: TERMS_VERSION });
    expect(sessionService.start).toHaveBeenCalledWith(tokens.access_token, tokens.refresh_token);
  });

  it("si Core no los acepta, no se entra y queda el error para el modal", async () => {
    const { result, sessionService } = setup(jest.fn().mockRejectedValue(new Error("sin red")));

    await act(() => result.current.acceptAndEnter());

    expect(sessionService.start).not.toHaveBeenCalled();
    await waitFor(() => expect(result.current.error).toBeTruthy());
  });

  it("sin una entrada pendiente no acepta nada", async () => {
    const update = jest.fn();
    const { result } = setup(update, null);

    await act(() => result.current.acceptAndEnter());

    expect(update).not.toHaveBeenCalled();
  });

  it("al rechazarlos, no se entra y se borran los tokens", () => {
    const { result, sessionService } = setup(jest.fn());

    act(() => result.current.reject());

    expect(sessionService.end).toHaveBeenCalledTimes(1);
    expect(sessionService.start).not.toHaveBeenCalled();
  });
});
