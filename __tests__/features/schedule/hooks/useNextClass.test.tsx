import { QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react-native";
import type { ReactNode } from "react";

import { useNextClass } from "@/features/schedule/hooks/useNextClass";
import { createQueryClient } from "@/shared/config/queryClient";
import { useSessionStore } from "@/shared/store/sessionStore";

import { nextClass, scheduleResponse } from "../../../helpers/scheduleFactories";
import { settle } from "../../../helpers/settle";

const STARTS_AT = "2026-10-05T14:00:00Z";
const BEFORE = Date.parse(STARTS_AT) - 60_000;
const AFTER = Date.parse(STARTS_AT) + 1;

function setup(getClasses: jest.Mock, now = BEFORE) {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={createQueryClient()}>{children}</QueryClientProvider>
  );
  return renderHook(({ at }: { at: number }) => useNextClass("2026-10-05", at, { getClasses }), {
    wrapper,
    initialProps: { at: now },
  });
}

describe("useNextClass", () => {
  beforeEach(() => useSessionStore.getState().setAuthenticated({ userId: 42, dbId: 7 }));

  it("es la próxima de Core, pedida con el mes de hoy", async () => {
    const getClasses = jest
      .fn()
      .mockResolvedValue(scheduleResponse({ next_class: nextClass({ id: 7, starts_at: STARTS_AT }) }));
    const { result } = setup(getClasses);

    await waitFor(() => expect(result.current?.id).toBe(7));
    expect(getClasses).toHaveBeenCalledWith("2026-09-28", "2026-11-08");
  });

  it("sin próxima clase, null", async () => {
    const getClasses = jest.fn().mockResolvedValue(scheduleResponse({ next_class: null }));
    const { result } = setup(getClasses);

    await settle();
    expect(result.current).toBeNull();
  });

  it("cuando empieza, vuelve a pedir la agenda y da la siguiente", async () => {
    const getClasses = jest
      .fn()
      .mockResolvedValueOnce(scheduleResponse({ next_class: nextClass({ id: 7, starts_at: STARTS_AT }) }))
      .mockResolvedValue(scheduleResponse({ next_class: nextClass({ id: 8, starts_at: "2026-10-05T16:00:00Z" }) }));
    const { result, rerender } = setup(getClasses);
    await waitFor(() => expect(result.current?.id).toBe(7));

    rerender({ at: AFTER });

    await waitFor(() => expect(result.current?.id).toBe(8));
    expect(getClasses).toHaveBeenCalledTimes(2);
  });

  it("antes de empezar no vuelve a pedir nada", async () => {
    const getClasses = jest
      .fn()
      .mockResolvedValue(scheduleResponse({ next_class: nextClass({ id: 7, starts_at: STARTS_AT }) }));
    const { result, rerender } = setup(getClasses);
    await waitFor(() => expect(result.current?.id).toBe(7));

    rerender({ at: BEFORE + 30_000 });

    await settle();
    expect(getClasses).toHaveBeenCalledTimes(1);
  });
});
