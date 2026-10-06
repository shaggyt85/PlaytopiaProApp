import { QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react-native";
import type { ReactNode } from "react";

import { useUpdateProfile } from "@/features/profile/hooks/useUpdateProfile";
import { profileKeys } from "@/features/profile/services/profileDetailsService";
import { createQueryClient } from "@/shared/config/queryClient";
import { teacherKeys } from "@/shared/services/teacherProfileService";
import { useSessionStore } from "@/shared/store/sessionStore";

import { profileDetails, teacherProfile } from "../../../helpers/profileFactories";

function setup(update = jest.fn().mockResolvedValue(teacherProfile({ name: "Lucía" }))) {
  const client = createQueryClient();
  client.setQueryData(teacherKeys.profile(42, "es"), teacherProfile());
  client.setQueryData(profileKeys.details(42, "es"), profileDetails());
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  return { client, update, ...renderHook(() => useUpdateProfile({ update }), { wrapper }) };
}

describe("useUpdateProfile", () => {
  beforeEach(() => useSessionStore.getState().setAuthenticated({ userId: 42, dbId: 7 }));

  it("guarda los cambios del profesor con la sesión abierta", async () => {
    const { result, update } = setup();

    await act(() => result.current.mutateAsync({ name: "Lucía" }));

    expect(update).toHaveBeenCalledWith(42, { name: "Lucía" });
  });

  it("deja en la caché el perfil que devuelve Core e invalida los detalles de Perfil", async () => {
    const { result, client } = setup();

    await act(() => result.current.mutateAsync({ name: "Lucía" }));

    expect(client.getQueryData(teacherKeys.profile(42, "es"))).toMatchObject({ name: "Lucía" });
    expect(client.getQueryState(profileKeys.details(42, "es"))?.isInvalidated).toBe(true);
  });

  it("si Core lo rechaza, la caché no cambia", async () => {
    const { result, client } = setup(jest.fn().mockRejectedValue(new Error("no")));

    await act(async () => {
      await result.current.mutateAsync({ name: "Lucía" }).catch(() => undefined);
    });

    expect(client.getQueryData(teacherKeys.profile(42, "es"))).toMatchObject({ name: "David" });
  });
});
