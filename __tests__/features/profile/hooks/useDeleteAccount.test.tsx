import { QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react-native";
import type { ReactNode } from "react";
import { Alert } from "react-native";

import { useDeleteAccount } from "@/features/profile/hooks/useDeleteAccount";
import { useProfileEditorStore } from "@/features/profile/store/profileEditorStore";
import { createQueryClient } from "@/shared/config/queryClient";
import { session } from "@/shared/services/session";

jest.mock("@/shared/services/session", () => ({ session: { end: jest.fn().mockResolvedValue(undefined) } }));

const deletion = { summary: { schools_count: 1, clubs_count: 2, unassigned_sessions: 0 }, anonymize_after_days: 30 };

function setup(request = jest.fn().mockResolvedValue(deletion)) {
  const client = createQueryClient();
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  return { request, ...renderHook(() => useDeleteAccount({ request }), { wrapper }) };
}

describe("useDeleteAccount", () => {
  beforeEach(() => {
    jest.spyOn(Alert, "alert").mockImplementation(() => undefined);
    useProfileEditorStore.getState().open("deleteAccount");
  });

  it("da de baja con el motivo, cierra el panel, termina la sesión como baja y avisa con los días de Core", async () => {
    const { result, request } = setup();

    await act(() => result.current.mutateAsync("Dejo de dar clases"));

    expect(request).toHaveBeenCalledWith("Dejo de dar clases");
    expect(useProfileEditorStore.getState().section).toBeNull();
    expect(session.end).toHaveBeenCalledWith("deleted");
    expect(Alert.alert).toHaveBeenCalledWith(
      "Cuenta dada de baja",
      "Tus datos personales se borrarán en 30 días; hasta entonces puedes recuperar la cuenta escribiendo a soporte.",
    );
  });

  it("si Core no la da de baja, la sesión sigue", async () => {
    const { result } = setup(jest.fn().mockRejectedValue(new Error("500")));

    await act(() => result.current.mutateAsync("Dejo de dar clases").catch(() => undefined));

    expect(session.end).not.toHaveBeenCalled();
    expect(useProfileEditorStore.getState().section).toBe("deleteAccount");
  });
});
