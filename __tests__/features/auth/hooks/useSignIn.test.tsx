import { QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react-native";
import type { ReactNode } from "react";

import { useSignIn } from "@/features/auth/hooks/useSignIn";
import { completeSignIn } from "@/features/auth/services/completeSignIn";
import type { ISignInService } from "@/features/auth/services/signInService";
import { createQueryClient } from "@/shared/config/queryClient";

import { signInTokens } from "../../../helpers/authFactories";

jest.mock("@/features/auth/services/completeSignIn", () => ({ completeSignIn: jest.fn() }));

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={createQueryClient()}>{children}</QueryClientProvider>
);
const credentials = { username: "a@b.com", password: "x" };

describe("useSignIn", () => {
  it("con los tokens del login hace lo mismo que la biometría: completeSignIn", async () => {
    jest.mocked(completeSignIn).mockResolvedValue({ tokens: signInTokens, termsPending: true });
    const service: ISignInService = { signIn: jest.fn().mockResolvedValue(signInTokens) };
    const { result } = renderHook(() => useSignIn(service), { wrapper });

    await act(() => result.current.mutateAsync(credentials));

    expect(service.signIn).toHaveBeenCalledWith(credentials);
    expect(completeSignIn).toHaveBeenCalledWith(signInTokens);
    await waitFor(() => expect(result.current.data?.termsPending).toBe(true));
  });

  it("si Core rechaza el login no sigue", async () => {
    const service: ISignInService = { signIn: jest.fn().mockRejectedValue(new Error("401")) };
    const { result } = renderHook(() => useSignIn(service), { wrapper });

    await act(() => result.current.mutateAsync(credentials).catch(() => undefined));
    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(completeSignIn).not.toHaveBeenCalled();
  });
});
