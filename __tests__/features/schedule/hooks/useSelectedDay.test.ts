import { act, renderHook } from "@testing-library/react-native";

import { useSelectedDay } from "@/features/schedule/hooks/useSelectedDay";

function setup(today = "2026-10-31") {
  return renderHook(({ day }: { day: string }) => useSelectedDay(day), { initialProps: { day: today } });
}

describe("useSelectedDay", () => {
  it("empieza en hoy", () => {
    const { result } = setup();

    expect(result.current).toMatchObject({ date: "2026-10-31", isToday: true });
  });

  it("en Día, › el día siguiente y ‹ el anterior, cambiando de mes", () => {
    const { result } = setup();

    act(() => result.current.goNext("day"));
    expect(result.current).toMatchObject({ date: "2026-11-01", isToday: false });

    act(() => result.current.goPrevious("day"));
    act(() => result.current.goPrevious("day"));
    expect(result.current.date).toBe("2026-10-30");
  });

  it("en Semana, siete días", () => {
    const { result } = setup();

    act(() => result.current.goNext("week"));
    expect(result.current.date).toBe("2026-11-07");
  });

  it("en Mes, el mismo día del mes siguiente o el último si no lo tiene", () => {
    const { result } = setup();

    act(() => result.current.goNext("month"));
    expect(result.current.date).toBe("2026-11-30");

    act(() => result.current.goNext("month"));
    expect(result.current.date).toBe("2026-12-30");
  });

  it("tocar un día lo elige; tocar hoy vuelve a hoy", () => {
    const { result } = setup();

    act(() => result.current.select("2026-11-12"));
    expect(result.current).toMatchObject({ date: "2026-11-12", isToday: false });

    act(() => result.current.select("2026-10-31"));
    expect(result.current.isToday).toBe(true);
  });

  it("si pasa la medianoche viendo hoy, pasa sola al día nuevo", () => {
    const { result, rerender } = setup("2026-10-05");

    rerender({ day: "2026-10-06" });

    expect(result.current).toMatchObject({ date: "2026-10-06", isToday: true });
  });

  it("viendo mañana, a medianoche sigue un día por delante de hoy", () => {
    const { result, rerender } = setup("2026-10-05");
    act(() => result.current.goNext("day"));

    rerender({ day: "2026-10-06" });

    expect(result.current.date).toBe("2026-10-07");
  });
});
