import { QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react-native";
import type { ReactNode } from "react";

import { TERMS_VERSION } from "@/features/auth/config/terms";
import { useAcceptTerms } from "@/features/auth/hooks/useAcceptTerms";
import { createQueryClient } from "@/shared/config/queryClient";
import { teacherKeys } from "@/shared/services/teacherProfileService";

import { teacherProfile } from "../../../helpers/authFactories";

const setup = (update: jest.Mock) => {
  const client = createQueryClient();
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  const sessionService = { end: jest.fn().mockResolvedValue(undefined) };
  const view = renderHook(() => useAcceptTerms({ service: { update }, sessionService }), { wrapper });
  return { ...view, client, sessionService };
};

describe("useAcceptTerms", () => {
  it("acepta la versión vigente y deja el perfil al día en la caché", async () => {
    const update = jest.fn().mockResolvedValue(teacherProfile());
    const { result, client } = setup(update);

    let accepted: boolean | undefined;
    await act(async () => {
      accepted = await result.current.accept(42);
    });

    expect(accepted).toBe(true);
    expect(update).toHaveBeenCalledWith(42, { terms_version: TERMS_VERSION });
    expect(client.getQueryData(teacherKeys.profile(42, "es"))).toEqual(teacherProfile());
  });

  it("si Core no los acepta, da false y deja el error", async () => {
    const { result } = setup(jest.fn().mockRejectedValue(new Error("sin red")));

    let accepted: boolean | undefined;
    await act(async () => {
      accepted = await result.current.accept(42);
    });

    expect(accepted).toBe(false);
    await waitFor(() => expect(result.current.error).toBeTruthy());
  });

  it("rechazarlos olvida el error y termina la sesión", async () => {
    const { result, sessionService } = setup(jest.fn().mockRejectedValue(new Error("sin red")));
    await act(async () => {
      await result.current.accept(42);
    });

    act(() => result.current.reject());

    expect(sessionService.end).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(result.current.error).toBeNull());
  });
});
