import { QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react-native";
import type { ReactNode } from "react";

import { useProfileDetails } from "@/features/profile/hooks/useProfileDetails";
import { createQueryClient } from "@/shared/config/queryClient";
import { HttpError } from "@/shared/services/HttpError";
import { useSessionStore } from "@/shared/store/sessionStore";

import { profileDetails } from "../../../helpers/profileFactories";
import { settle } from "../../../helpers/settle";

function setup(get = jest.fn().mockResolvedValue(profileDetails())) {
  const client = createQueryClient();
  const service = { get };
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  return { service, render: () => renderHook(() => useProfileDetails(service), { wrapper }) };
}

describe("useProfileDetails", () => {
  beforeEach(() => useSessionStore.getState().setAuthenticated({ userId: 42, dbId: 7 }));

  it("pide las horas y la disponibilidad del profesor con la sesión abierta", async () => {
    const { service, render } = setup();
    const { result } = render();

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(service.get).toHaveBeenCalledWith(42);
  });

  it("devuelve solo las horas y la disponibilidad: el resto del perfil sale de su propia caché", async () => {
    const { render } = setup();
    const { result } = render();

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    const { hours, availability } = profileDetails();
    expect(result.current.data).toEqual({ hours, availability });
  });

  it("si Core lo rechaza, deja el error para la pantalla", async () => {
    // Un 4xx no se reintenta (un fallo de red sí, con espera): así el test no espera.
    const forbidden = HttpError.fromResponse(403, { type: "about:blank", title: "Forbidden", status: 403 });
    const { render } = setup(jest.fn().mockRejectedValue(forbidden));
    const { result } = render();

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(HttpError);
  });

  it("sin sesión no pide nada", async () => {
    useSessionStore.getState().setAnonymous(null);
    const { service, render } = setup();
    render();
    await settle();

    expect(service.get).not.toHaveBeenCalled();
  });
});
