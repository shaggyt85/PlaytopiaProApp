import { renderHook } from "@testing-library/react-native";

import { useTodayHeader } from "@/features/schedule/hooks/useTodayHeader";
import { serverNow } from "@/shared/utils/serverClock";

jest.mock("@/shared/utils/serverClock", () => ({ serverNow: jest.fn() }));

describe("useTodayHeader", () => {
  it("da la clave del saludo y la fecha de la hora del móvil", () => {
    jest.mocked(serverNow).mockReturnValue(new Date(2026, 10, 20, 9, 30).getTime());

    const { result } = renderHook(() => useTodayHeader());

    expect(result.current).toEqual({ greeting: "schedule.greeting.morning", date: "Viernes · 20 de noviembre" });
  });

  it("de noche cambia el saludo", () => {
    jest.mocked(serverNow).mockReturnValue(new Date(2026, 10, 20, 22, 0).getTime());

    const { result } = renderHook(() => useTodayHeader());

    expect(result.current.greeting).toBe("schedule.greeting.evening");
  });
});
