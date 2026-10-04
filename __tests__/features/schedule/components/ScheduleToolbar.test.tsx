import { fireEvent, render, screen } from "@testing-library/react-native";
import { AccessibilityInfo } from "react-native";

import { ScheduleToolbar } from "@/features/schedule/components/ScheduleToolbar";
import type { ScheduleView } from "@/features/schedule/utils/scheduleViews";

const handlers = () => ({ onPrevious: jest.fn(), onNext: jest.fn(), onToday: jest.fn(), onViewChange: jest.fn() });

function setup(view: ScheduleView = "day", isToday = false) {
  const fns = handlers();
  const utils = render(<ScheduleToolbar view={view} date="2026-10-06" isToday={isToday} {...fns} />);
  return { ...utils, ...fns };
}

describe("ScheduleToolbar", () => {
  it("en Día, hoy: «Hoy» en el centro", () => {
    setup("day", true);

    expect(screen.getByText("Hoy")).toBeTruthy();
  });

  it("en Día, otro día: el día en corto, sin la hora", () => {
    setup();

    expect(screen.getByText(/^Mar\.? 6 oct\.?$/)).toBeTruthy();
  });

  it("‹ pide el anterior y › el siguiente", () => {
    const { onPrevious, onNext } = setup();

    fireEvent.press(screen.getByRole("button", { name: "Día anterior" }));
    expect(onPrevious).toHaveBeenCalledTimes(1);

    fireEvent.press(screen.getByRole("button", { name: "Día siguiente" }));
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it("tocar el texto del centro vuelve a hoy", () => {
    const { onToday } = setup();

    fireEvent.press(screen.getByTestId("schedule-today"));

    expect(onToday).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId("schedule-today").props.accessibilityHint).toBe("Volver a hoy");
  });

  it("en Semana y en Mes, su texto y sus flechas", () => {
    const { rerender } = setup("week");
    expect(screen.getByText("5 oct – 11 oct")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Semana siguiente" })).toBeTruthy();

    rerender(<ScheduleToolbar view="month" date="2026-10-06" isToday={false} {...handlers()} />);
    expect(screen.getByText("Octubre de 2026")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Mes anterior" })).toBeTruthy();
  });

  it("las pestañas de vistas avisan de la elegida", () => {
    const { onViewChange } = setup();

    expect(screen.getByRole("tab", { name: "Día" }).props.accessibilityState).toEqual({ selected: true });
    fireEvent.press(screen.getByRole("tab", { name: "Mes" }));

    expect(onViewChange).toHaveBeenCalledWith("month");
  });

  it("anuncia a dónde se llega al cambiar; al abrir, no", () => {
    const announce = jest.spyOn(AccessibilityInfo, "announceForAccessibility").mockImplementation(() => undefined);
    const { rerender } = setup();
    expect(announce).not.toHaveBeenCalled();

    rerender(<ScheduleToolbar view="week" date="2026-10-06" isToday={false} {...handlers()} />);

    expect(announce).toHaveBeenCalledWith("5 oct – 11 oct");
    announce.mockRestore();
  });
});
