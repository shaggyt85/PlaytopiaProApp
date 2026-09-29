import { act, renderHook } from "@testing-library/react-native";

import { useSelectedDay } from "@/features/schedule/hooks/useSelectedDay";

function setup(today = "2026-10-31") {
  return renderHook(({ day }) => useSelectedDay(day), { initialProps: { day: today } });
}

describe("useSelectedDay", () => {
  it("empieza en hoy", () => {
    const { result } = setup();

    expect(result.current).toMatchObject({ date: "2026-10-31", isToday: true });
  });

  it("› el día siguiente y ‹ el anterior, cambiando de mes", () => {
    const { result } = setup();

    act(() => result.current.goNext());
    expect(result.current).toMatchObject({ date: "2026-11-01", isToday: false });

    act(() => result.current.goPrevious());
    act(() => result.current.goPrevious());
    expect(result.current.date).toBe("2026-10-30");
  });

  it("si pasa la medianoche viendo hoy, pasa sola al día nuevo", () => {
    const { result, rerender } = setup("2026-10-05");

    rerender({ day: "2026-10-06" });

    expect(result.current).toMatchObject({ date: "2026-10-06", isToday: true });
  });

  it("viendo mañana, a medianoche sigue un día por delante de hoy", () => {
    const { result, rerender } = setup("2026-10-05");
    act(() => result.current.goNext());

    rerender({ day: "2026-10-06" });

    expect(result.current.date).toBe("2026-10-07");
  });
});
