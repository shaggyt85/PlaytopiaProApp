import { QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react-native";
import type { ReactNode } from "react";

import { useSignIn } from "@/features/auth/hooks/useSignIn";
import type { ISignInService } from "@/features/auth/services/signInService";
import type { ITermsService } from "@/features/auth/services/termsService";
import { createQueryClient } from "@/shared/config/queryClient";
import { HttpError } from "@/shared/services/HttpError";
import { session } from "@/shared/services/session";

import { signInTokens, teacherTerms } from "../../../helpers/authFactories";

jest.mock("@/shared/services/session", () => ({
  session: {
    start: jest.fn().mockResolvedValue(true),
    saveTokens: jest.fn().mockResolvedValue(undefined),
    end: jest.fn().mockResolvedValue(undefined),
  },
}));

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={createQueryClient()}>{children}</QueryClientProvider>
);

const tokens = signInTokens;
const signInOk: ISignInService = { signIn: jest.fn().mockResolvedValue(tokens) };
const termsWith = (getTerms: ITermsService["getTerms"]): ITermsService => ({
  getTerms,
  acceptTerms: jest.fn(),
});
const credentials = { username: "a@b.com", password: "x" };

describe("useSignIn", () => {
  it("con los términos vigentes aceptados, abre la sesión con los tokens de Core", async () => {
    const terms = termsWith(
      jest.fn().mockResolvedValue(teacherTerms()),
    );
    const { result } = renderHook(() => useSignIn(signInOk, terms), { wrapper });

    await act(() => result.current.mutateAsync(credentials));

    expect(terms.getTerms).toHaveBeenCalledWith(42);
    expect(session.start).toHaveBeenCalledWith("acceso", "refresco");
    await waitFor(() => expect(result.current.data?.termsPending).toBe(false));
  });

  it.each([null, "2020-01-01"])(
    "con los términos en %s guarda los tokens pero no abre la sesión",
    async (version) => {
      const terms = termsWith(
        jest.fn().mockResolvedValue(teacherTerms(version)),
      );
      const { result } = renderHook(() => useSignIn(signInOk, terms), { wrapper });

      await act(() => result.current.mutateAsync(credentials));

      expect(session.saveTokens).toHaveBeenCalledWith("acceso", "refresco");
      expect(session.start).not.toHaveBeenCalled();
      await waitFor(() => expect(result.current.data).toEqual({ tokens, termsPending: true }));
    },
  );

  it("si no se pueden comprobar los términos, no entra y borra los tokens", async () => {
    const terms = termsWith(jest.fn().mockRejectedValue(HttpError.network()));
    const { result } = renderHook(() => useSignIn(signInOk, terms), { wrapper });

    await act(() => result.current.mutateAsync(credentials).catch(() => undefined));
    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(session.end).toHaveBeenCalled();
    expect(session.start).not.toHaveBeenCalled();
  });

  it("si Core rechaza el login, no guarda nada", async () => {
    const service: ISignInService = { signIn: jest.fn().mockRejectedValue(new Error("401")) };
    const { result } = renderHook(() => useSignIn(service, termsWith(jest.fn())), { wrapper });

    await act(() => result.current.mutateAsync(credentials).catch(() => undefined));
    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(session.saveTokens).not.toHaveBeenCalled();
    expect(session.start).not.toHaveBeenCalled();
  });
});
