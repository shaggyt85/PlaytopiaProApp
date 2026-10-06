import { QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react-native";
import type { ReactNode } from "react";

import { useStoreProfile } from "@/features/profile/hooks/useStoreProfile";
import { profileKeys } from "@/features/profile/services/profileDetailsService";
import { createQueryClient } from "@/shared/config/queryClient";
import { teacherKeys } from "@/shared/services/teacherProfileService";
import { useSessionStore } from "@/shared/store/sessionStore";

import { profileDetails, teacherProfile } from "../../../helpers/profileFactories";

function setup() {
  const client = createQueryClient();
  client.setQueryData(teacherKeys.profile(42, "es"), teacherProfile());
  client.setQueryData(profileKeys.details(42, "es"), profileDetails());
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  return { client, ...renderHook(() => useStoreProfile(), { wrapper }) };
}

describe("useStoreProfile", () => {
  beforeEach(() => useSessionStore.getState().setAuthenticated({ userId: 42, dbId: 7 }));

  it("deja el perfil como queda e invalida los detalles de Perfil", async () => {
    const { result, client } = setup();

    await act(() => result.current(teacherProfile({ name: "Lucía" })));

    expect(client.getQueryData(teacherKeys.profile(42, "es"))).toMatchObject({ name: "Lucía" });
    expect(client.getQueryState(profileKeys.details(42, "es"))?.isInvalidated).toBe(true);
  });

  it("con un cambio, lo aplica sobre el perfil de la caché", async () => {
    const { result, client } = setup();

    await act(() => result.current((profile) => ({ ...profile, avatar: "https://cdn/nueva.jpg" })));

    expect(client.getQueryData(teacherKeys.profile(42, "es"))).toMatchObject({
      name: teacherProfile().name,
      avatar: "https://cdn/nueva.jpg",
    });
  });
});
