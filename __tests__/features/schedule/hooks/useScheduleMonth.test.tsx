import { QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react-native";
import type { ReactNode } from "react";

import { useScheduleMonth } from "@/features/schedule/hooks/useScheduleMonth";
import { createQueryClient } from "@/shared/config/queryClient";
import { useSessionStore } from "@/shared/store/sessionStore";

import { nextClass, scheduleClass, scheduleResponse } from "../../../helpers/scheduleFactories";
import { settle } from "../../../helpers/settle";

const monday = scheduleClass({ id: 1, class_date: "2026-10-05", class_time: "09:00:00" });
const mondayLater = scheduleClass({ id: 2, class_date: "2026-10-05", class_time: "18:00:00" });
const tuesday = scheduleClass({ id: 3, class_date: "2026-10-06", class_time: "10:00:00" });

function setup(getClasses: jest.Mock, date = "2026-10-05") {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={createQueryClient()}>{children}</QueryClientProvider>
  );
  return renderHook(({ day }) => useScheduleMonth(day, { getClasses }), {
    wrapper,
    initialProps: { day: date },
  });
}

describe("useScheduleMonth", () => {
  beforeEach(() => useSessionStore.getState().setAuthenticated({ userId: 42, dbId: 7 }));

  it("pide la cuadrícula del mes y da las clases de ese día y la próxima", async () => {
    const getClasses = jest
      .fn()
      .mockResolvedValue(scheduleResponse({ classes: [monday, mondayLater, tuesday], next_class: nextClass({ id: 2 }) }));
    const { result } = setup(getClasses);

    await waitFor(() => expect(result.current.dayClasses).toEqual([monday, mondayLater]));
    expect(getClasses).toHaveBeenCalledWith("2026-09-28", "2026-11-08");
    expect(result.current.nextClass?.id).toBe(2);
  });

  it("cambiar de día dentro del mes no vuelve a pedir nada", async () => {
    const getClasses = jest.fn().mockResolvedValue(scheduleResponse({ classes: [monday, tuesday] }));
    const { result, rerender } = setup(getClasses);
    await waitFor(() => expect(result.current.dayClasses).toEqual([monday]));

    rerender({ day: "2026-10-06" });

    expect(result.current.dayClasses).toEqual([tuesday]);
    await settle();
    expect(getClasses).toHaveBeenCalledTimes(1);
  });

  it("al pasar a otro mes pide su cuadrícula", async () => {
    const getClasses = jest.fn().mockResolvedValue(scheduleResponse({ classes: [] }));
    const { rerender } = setup(getClasses);
    await waitFor(() => expect(getClasses).toHaveBeenCalledTimes(1));

    rerender({ day: "2026-11-15" });

    await waitFor(() => expect(getClasses).toHaveBeenLastCalledWith("2026-10-26", "2026-12-06"));
  });

  it("un día sin clases da la lista vacía; sin próxima, null", async () => {
    const getClasses = jest.fn().mockResolvedValue(scheduleResponse({ classes: [tuesday], next_class: null }));
    const { result } = setup(getClasses);

    await waitFor(() => expect(result.current.isPending).toBe(false));
    expect(result.current.dayClasses).toEqual([]);
    expect(result.current.nextClass).toBeNull();
  });

  it("un día sin clases da siempre la misma lista vacía, para no repintar", async () => {
    const getClasses = jest.fn().mockResolvedValue(scheduleResponse({ classes: [tuesday] }));
    const { result, rerender } = setup(getClasses);
    await waitFor(() => expect(result.current.hasData).toBe(true));
    const empty = result.current.dayClasses;

    rerender({ day: "2026-10-07" });

    expect(result.current.dayClasses).toBe(empty);
  });

  it("sin datos todavía, hasData es false; si falla, llega el error", async () => {
    const getClasses = jest.fn().mockRejectedValue(new Error("sin red"));
    const { result } = setup(getClasses);
    expect(result.current.hasData).toBe(false);

    await waitFor(() => expect(result.current.error).toBeTruthy());
    expect(result.current.hasData).toBe(false);
  });

  it("sin sesión no pide nada", async () => {
    useSessionStore.getState().setAnonymous();
    const getClasses = jest.fn();
    setup(getClasses);

    await settle();

    expect(getClasses).not.toHaveBeenCalled();
  });
});
