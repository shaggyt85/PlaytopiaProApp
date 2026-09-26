import { QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react-native";
import type { ReactNode } from "react";

import { useTeacherProfile } from "@/features/home/hooks/useTeacherProfile";
import { createQueryClient } from "@/shared/config/queryClient";
import { teacherKeys } from "@/shared/services/teacherProfileService";
import { useSessionStore } from "@/shared/store/sessionStore";

import { teacherProfile } from "../../../helpers/authFactories";
import { settle } from "../../../helpers/settle";

function setup() {
  const client = createQueryClient();
  const service = { get: jest.fn().mockResolvedValue(teacherProfile()) };
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  return { client, service, render: () => renderHook(() => useTeacherProfile(service), { wrapper }) };
}

describe("useTeacherProfile", () => {
  beforeEach(() => useSessionStore.getState().setAuthenticated({ userId: 42, dbId: 7 }));

  it("pide el perfil del profesor con la sesión abierta", async () => {
    const { service, render } = setup();
    const { result } = render();

    await waitFor(() => expect(result.current.data?.name).toBe("David"));
    expect(service.get).toHaveBeenCalledWith(42);
  });

  it("si el acceso ya lo dejó en la caché, no lo vuelve a pedir", async () => {
    const { client, service, render } = setup();
    client.setQueryData(teacherKeys.profile(42), teacherProfile());
    const { result } = render();
    await settle();

    expect(result.current.data?.name).toBe("David");
    expect(service.get).not.toHaveBeenCalled();
  });

  it("sin sesión no pide nada", async () => {
    useSessionStore.getState().setAnonymous(null);
    const { service, render } = setup();
    render();
    await settle();

    expect(service.get).not.toHaveBeenCalled();
  });
});
