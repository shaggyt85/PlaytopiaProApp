import { QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react-native";
import type { ReactNode } from "react";

import { TERMS_VERSION } from "@/features/auth/config/terms";
import { useOpenSessionTerms } from "@/features/auth/hooks/useOpenSessionTerms";
import { createQueryClient } from "@/shared/config/queryClient";
import { teacherProfileService } from "@/shared/services/teacherProfileService";
import { useSessionStore } from "@/shared/store/sessionStore";

import { teacherProfile } from "../../../helpers/authFactories";

jest.mock("@/shared/services/teacherProfileService", () => ({
  ...jest.requireActual("@/shared/services/teacherProfileService"),
  teacherProfileService: { get: jest.fn() },
}));

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={createQueryClient()}>{children}</QueryClientProvider>
);

const setup = () => {
  const update = jest.fn().mockResolvedValue(teacherProfile());
  const sessionService = { end: jest.fn().mockResolvedValue(undefined) };
  const view = renderHook(() => useOpenSessionTerms({ service: { update }, sessionService }), { wrapper });
  return { ...view, update, sessionService };
};

describe("useOpenSessionTerms", () => {
  beforeEach(() => useSessionStore.getState().setAuthenticated({ userId: 42, dbId: 7 }));

  it("con los términos al día no están pendientes", async () => {
    jest.mocked(teacherProfileService.get).mockResolvedValue(teacherProfile());
    const { result } = setup();

    await waitFor(() => expect(teacherProfileService.get).toHaveBeenCalledWith(42));
    expect(result.current.pending).toBe(false);
  });

  it("si cambiaron, están pendientes; al aceptarlos quedan al día", async () => {
    jest.mocked(teacherProfileService.get).mockResolvedValue(teacherProfile("2020-01-01"));
    const { result, update, sessionService } = setup();
    await waitFor(() => expect(result.current.pending).toBe(true));

    await act(() => result.current.acceptCurrent());

    expect(update).toHaveBeenCalledWith(42, { terms_version: TERMS_VERSION });
    await waitFor(() => expect(result.current.pending).toBe(false));
    expect(sessionService.end).not.toHaveBeenCalled();
  });

  it("si nunca los aceptó, están pendientes", async () => {
    jest.mocked(teacherProfileService.get).mockResolvedValue(teacherProfile(null));
    const { result } = setup();

    await waitFor(() => expect(result.current.pending).toBe(true));
  });

  it("si no se puede leer el perfil, no están pendientes", async () => {
    jest.mocked(teacherProfileService.get).mockRejectedValue(new Error("sin red"));
    const { result } = setup();

    await waitFor(() => expect(teacherProfileService.get).toHaveBeenCalled());
    expect(result.current.pending).toBe(false);
  });
});
