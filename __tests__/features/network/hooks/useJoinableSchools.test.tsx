import { QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react-native";
import type { ReactNode } from "react";

import { mergePages, useJoinableSchools } from "@/features/network/hooks/useJoinableSchools";
import type { SchoolCard } from "@/features/network/schemas/network.schema";
import { createQueryClient } from "@/shared/config/queryClient";
import { useSessionStore } from "@/shared/store/sessionStore";

import { settle } from "../../../helpers/settle";

const sede = (db_id: number, club_id: number): SchoolCard => ({
  db_id,
  club_id,
  name: `Escuela ${db_id}`,
  club_name: null,
  city: "Sevilla",
  address: "Calle Mayor 3",
  background_url: "https://core-dev.playtopiax.com/api/img/x.jpg",
});

const page = (number: number, totalPages: number, schools: SchoolCard[], totalCount = 25) => ({
  schools,
  pagination: { page: number, size: 10, total_count: totalCount, total_pages: totalPages },
});

function setup(getJoinableSchools: jest.Mock, enabled = true) {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={createQueryClient()}>{children}</QueryClientProvider>
  );
  return renderHook(({ on }) => useJoinableSchools({ enabled: on, service: { getJoinableSchools } }), {
    wrapper,
    initialProps: { on: enabled },
  });
}

describe("useJoinableSchools", () => {
  beforeEach(() => useSessionStore.getState().setAuthenticated({ userId: 42, dbId: 7 }));

  it("sin la pestaña a la vista no pide nada; al verla, la primera página", async () => {
    const getJoinableSchools = jest.fn().mockResolvedValue(page(1, 1, [sede(1, 1)], 1));
    const { result, rerender } = setup(getJoinableSchools, false);

    await settle();
    expect(getJoinableSchools).not.toHaveBeenCalled();

    rerender({ on: true });

    await waitFor(() => expect(result.current.data?.schools).toEqual([sede(1, 1)]));
    expect(getJoinableSchools).toHaveBeenCalledWith(1);
  });

  it("la siguiente página se junta a la lista, y en la última ya no hay más", async () => {
    const getJoinableSchools = jest
      .fn()
      .mockResolvedValueOnce(page(1, 2, [sede(1, 1)], 2))
      .mockResolvedValueOnce(page(2, 2, [sede(2, 1)], 2));
    const { result } = setup(getJoinableSchools);
    await waitFor(() => expect(result.current.hasNextPage).toBe(true));

    await act(async () => {
      await result.current.fetchNextPage();
    });

    expect(getJoinableSchools).toHaveBeenLastCalledWith(2);
    expect(result.current.data).toEqual({ schools: [sede(1, 1), sede(2, 1)], totalCount: 2 });
    expect(result.current.hasNextPage).toBe(false);
  });

  it("refrescar vuelve a la primera página y solo pide esa", async () => {
    const getJoinableSchools = jest
      .fn()
      .mockResolvedValueOnce(page(1, 3, [sede(1, 1)]))
      .mockResolvedValueOnce(page(2, 3, [sede(2, 1)]))
      .mockResolvedValue(page(1, 3, [sede(9, 1)]));
    const { result } = setup(getJoinableSchools);
    await waitFor(() => expect(result.current.hasNextPage).toBe(true));
    await act(async () => {
      await result.current.fetchNextPage();
    });
    expect(getJoinableSchools).toHaveBeenCalledTimes(2);

    await act(async () => {
      await result.current.refresh();
    });

    await waitFor(() => expect(result.current.data?.schools).toEqual([sede(9, 1)]));
    // Una sola petición más, de la página 1: no las dos que había cargadas.
    expect(getJoinableSchools).toHaveBeenCalledTimes(3);
    expect(getJoinableSchools).toHaveBeenLastCalledWith(1);
  });

  it("sin sesión no pide nada", async () => {
    useSessionStore.getState().setAnonymous();
    const getJoinableSchools = jest.fn();
    setup(getJoinableSchools);

    await settle();

    expect(getJoinableSchools).not.toHaveBeenCalled();
  });
});

describe("mergePages", () => {
  it("una sede que saltó de página sale una sola vez, la primera", () => {
    const merged = mergePages({
      pages: [page(1, 2, [sede(1, 1), sede(1, 2)], 3), page(2, 2, [sede(1, 2), sede(3, 1)], 3)],
      pageParams: [1, 2],
    });

    expect(merged.schools).toEqual([sede(1, 1), sede(1, 2), sede(3, 1)]);
    expect(merged.totalCount).toBe(3);
  });

  it("la misma sucursal en otra escuela es otra sede", () => {
    const merged = mergePages({ pages: [page(1, 1, [sede(1, 1), sede(2, 1)], 2)], pageParams: [1] });
    expect(merged.schools).toHaveLength(2);
  });
});
