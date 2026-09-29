import { renderHook } from "@testing-library/react-native";

import { useTodayHeader } from "@/features/schedule/hooks/useTodayHeader";

describe("useTodayHeader", () => {
  it("da la clave del saludo y la fecha de la hora que recibe", () => {
    const { result } = renderHook(() => useTodayHeader(new Date(2026, 10, 20, 9, 30).getTime()));

    expect(result.current).toEqual({ greeting: "schedule.greeting.morning", date: "Viernes · 20 de noviembre" });
  });

  it("de noche cambia el saludo", () => {
    const { result } = renderHook(() => useTodayHeader(new Date(2026, 10, 20, 22, 0).getTime()));

    expect(result.current.greeting).toBe("schedule.greeting.evening");
  });
});
