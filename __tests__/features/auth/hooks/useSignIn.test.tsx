import { QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react-native";
import type { ReactNode } from "react";

import { useSignIn } from "@/features/auth/hooks/useSignIn";
import type { ISignInService } from "@/features/auth/services/signInService";
import { createQueryClient } from "@/shared/config/queryClient";
import { session } from "@/shared/services/session";

jest.mock("@/shared/services/session", () => ({
  session: { start: jest.fn().mockResolvedValue(true) },
}));

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={createQueryClient()}>{children}</QueryClientProvider>
);

describe("useSignIn", () => {
  it("si el login va bien, abre la sesión con los tokens de Core", async () => {
    const service: ISignInService = {
      signIn: jest.fn().mockResolvedValue({
        access_token: "acceso",
        refresh_token: "refresco",
        id: 42,
        role_id: 4,
        db_id: 7,
      }),
    };
    const { result } = renderHook(() => useSignIn(service), { wrapper });

    await act(() => result.current.mutateAsync({ username: "a@b.com", password: "x" }));
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(session.start).toHaveBeenCalledWith("acceso", "refresco");
  });

  it("si Core lo rechaza, no abre la sesión", async () => {
    const service: ISignInService = {
      signIn: jest.fn().mockRejectedValue(new Error("401")),
    };
    const { result } = renderHook(() => useSignIn(service), { wrapper });

    await act(() =>
      result.current.mutateAsync({ username: "a@b.com", password: "x" }).catch(() => undefined),
    );
    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(session.start).not.toHaveBeenCalled();
  });
});
