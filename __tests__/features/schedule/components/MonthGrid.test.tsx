import { fireEvent, render, screen } from "@testing-library/react-native";
import { StyleSheet } from "react-native";

import { MonthGrid } from "@/features/schedule/components/MonthGrid";

import { scheduleClass } from "../../../helpers/scheduleFactories";

const byDate = new Map([["2026-11-19", [scheduleClass({ id: 1 }), scheduleClass({ id: 2 })]]]);
const dots = new Map([["2026-11-19", ["#111111"]]]);

function setup(date = "2026-11-20") {
  const onPick = jest.fn();
  render(<MonthGrid date={date} today="2026-11-18" dots={dots} byDate={byDate} onPick={onPick} />);
  return onPick;
}

describe("MonthGrid", () => {
  it("las letras arriba y un botón por día del mes, sin los de otros meses", () => {
    setup();

    expect(screen.getByText("X")).toBeTruthy();
    // Noviembre de 2026: 30 días.
    expect(screen.getAllByRole("button")).toHaveLength(30);
    expect(screen.getByTestId("month-day-2026-11-01")).toBeTruthy();
    expect(screen.queryByTestId("month-day-2026-10-31")).toBeNull();
  });

  it("el elegido, marcado; cada día dice cuántas clases tiene", () => {
    setup();

    expect(screen.getByRole("button", { name: "viernes 20, 0 clases" }).props.accessibilityState).toEqual({
      selected: true,
    });
    expect(screen.getByRole("button", { name: "jueves 19, 2 clases" }).props.accessibilityState).toEqual({
      selected: false,
    });
  });

  it("con otro día elegido, hoy sigue marcado como hoy", () => {
    setup("2026-11-20");

    const todayCell = screen.getByRole("button", { name: "miércoles 18, 0 clases" });
    expect(todayCell.props.accessibilityState).toEqual({ selected: false });
    expect(StyleSheet.flatten(todayCell.props.style).borderWidth).toBe(1);
    expect(StyleSheet.flatten(screen.getByTestId("month-day-2026-11-19").props.style).borderWidth).toBeUndefined();
  });

  it("tocar un día avisa con su fecha", () => {
    const onPick = setup();

    fireEvent.press(screen.getByTestId("month-day-2026-11-19"));

    expect(onPick).toHaveBeenCalledWith("2026-11-19");
  });
});
