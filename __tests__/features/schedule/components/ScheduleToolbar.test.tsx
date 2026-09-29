import { fireEvent, render, screen } from "@testing-library/react-native";
import { AccessibilityInfo } from "react-native";

import { ScheduleToolbar } from "@/features/schedule/components/ScheduleToolbar";
import type { ScheduleView } from "@/features/schedule/utils/scheduleViews";
import { wallAsUtcMs } from "@/shared/utils/clubClock";

const NOW = wallAsUtcMs("2026-10-05", "15:21:00");

function setup(view: ScheduleView = "day") {
  const onPrevious = jest.fn();
  const onNext = jest.fn();
  const onViewChange = jest.fn();
  const utils = render(
    <ScheduleToolbar
      view={view}
      date="2026-10-06"
      isToday={false}
      nowWall={NOW}
      onPrevious={onPrevious}
      onNext={onNext}
      onViewChange={onViewChange}
    />,
  );
  return { ...utils, onPrevious, onNext, onViewChange };
}

describe("ScheduleToolbar", () => {
  it("en Día: el día que se ve y la hora de ahora", () => {
    setup();

    expect(screen.getByText("martes 6 · 15:21")).toBeTruthy();
  });

  it("‹ pide el anterior y › el siguiente", () => {
    const { onPrevious, onNext } = setup();

    fireEvent.press(screen.getByRole("button", { name: "Día anterior" }));
    expect(onPrevious).toHaveBeenCalledTimes(1);

    fireEvent.press(screen.getByRole("button", { name: "Día siguiente" }));
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it("en Semana y en Mes, su texto y sus flechas", () => {
    const { rerender } = setup("week");
    expect(screen.getByText("5 oct – 11 oct · 15:21")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Semana siguiente" })).toBeTruthy();

    rerender(
      <ScheduleToolbar
        view="month"
        date="2026-10-06"
        isToday={false}
        nowWall={NOW}
        onPrevious={jest.fn()}
        onNext={jest.fn()}
        onViewChange={jest.fn()}
      />,
    );
    expect(screen.getByText("octubre de 2026")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Mes anterior" })).toBeTruthy();
  });

  it("el selector de vistas avisa de la elegida", () => {
    const { onViewChange } = setup();

    expect(screen.getByRole("tab", { name: "Día" }).props.accessibilityState).toEqual({ selected: true });
    fireEvent.press(screen.getByRole("tab", { name: "Mes" }));

    expect(onViewChange).toHaveBeenCalledWith("month");
  });

  it("anuncia a dónde se llega al cambiar, sin la hora; al abrir, no", () => {
    const announce = jest.spyOn(AccessibilityInfo, "announceForAccessibility").mockImplementation(() => undefined);
    const { rerender } = setup();
    expect(announce).not.toHaveBeenCalled();

    rerender(
      <ScheduleToolbar
        view="week"
        date="2026-10-06"
        isToday={false}
        nowWall={NOW}
        onPrevious={jest.fn()}
        onNext={jest.fn()}
        onViewChange={jest.fn()}
      />,
    );

    expect(announce).toHaveBeenCalledWith("5 oct – 11 oct");
    announce.mockRestore();
  });
});
