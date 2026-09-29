import { QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react-native";
import type { ReactNode } from "react";

import { useMyClubs } from "@/shared/hooks/useMyClubs";
import { createQueryClient } from "@/shared/config/queryClient";
import { HttpError } from "@/shared/services/HttpError";
import { useSessionStore } from "@/shared/store/sessionStore";

import { schoolCard } from "../../helpers/networkFactories";
import { settle } from "../../helpers/settle";

const card = schoolCard(4, 7, { name: "DN Padel Academy", club_name: "Sede Centro" });

function setup(getMyClubs: jest.Mock) {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={createQueryClient()}>{children}</QueryClientProvider>
  );
  return renderHook(() => useMyClubs({ getMyClubs }), { wrapper });
}

describe("useMyClubs", () => {
  beforeEach(() => useSessionStore.getState().setAuthenticated({ userId: 42, dbId: 7 }));

  it("trae las sedes donde trabaja el profesor", async () => {
    const getMyClubs = jest.fn().mockResolvedValue({ clubs: [card] });
    const { result } = setup(getMyClubs);

    await waitFor(() => expect(result.current.data?.clubs).toEqual([card]));
    expect(getMyClubs).toHaveBeenCalledTimes(1);
  });

  it("sin sesión no pide nada", async () => {
    useSessionStore.getState().setAnonymous();
    const getMyClubs = jest.fn();
    setup(getMyClubs);

    await settle();

    expect(getMyClubs).not.toHaveBeenCalled();
  });

  it("un 4xx de Core queda en la query sin reintentar", async () => {
    const getMyClubs = jest
      .fn()
      .mockRejectedValue(HttpError.fromResponse(403, { type: "about:blank", title: "Forbidden", status: 403 }));
    const { result } = setup(getMyClubs);

    await waitFor(() => expect(result.current.error).toBeTruthy());
    expect(getMyClubs).toHaveBeenCalledTimes(1);
  });
});
