import { QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react-native";
import type { ReactNode } from "react";

import { usePasswordRecovery } from "@/features/auth/hooks/usePasswordRecovery";
import type { IPasswordRecoveryService } from "@/features/auth/services/passwordRecoveryService";
import { createQueryClient } from "@/shared/config/queryClient";
import { HttpError } from "@/shared/services/HttpError";

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={createQueryClient()}>{children}</QueryClientProvider>
);

describe("usePasswordRecovery", () => {
  it("al enviarse queda en éxito", async () => {
    const service: IPasswordRecoveryService = {
      requestRecovery: jest.fn().mockResolvedValue({ status: "ok" }),
    };
    const { result } = renderHook(() => usePasswordRecovery(service), { wrapper });

    await act(() => result.current.mutateAsync("ana@club.com"));

    expect(service.requestRecovery).toHaveBeenCalledWith("ana@club.com");
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  it("si falla, el error queda en la mutación y no se reintenta", async () => {
    const service: IPasswordRecoveryService = {
      requestRecovery: jest.fn().mockRejectedValue(HttpError.network()),
    };
    const { result } = renderHook(() => usePasswordRecovery(service), { wrapper });

    await act(() => result.current.mutateAsync("ana@club.com").catch(() => undefined));
    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(service.requestRecovery).toHaveBeenCalledTimes(1);
  });
});
