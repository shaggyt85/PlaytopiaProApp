import { fireEvent, render, screen } from "@testing-library/react-native";

import { WeekStrip } from "@/features/schedule/components/WeekStrip";
import { weekDays } from "@/features/schedule/utils/scheduleDates";

import { scheduleClass } from "../../../helpers/scheduleFactories";

const days = weekDays("2026-11-18");
const byDate = new Map([["2026-11-19", [scheduleClass({ id: 1 }), scheduleClass({ id: 2 }), scheduleClass({ id: 3 })]]]);
const dots = new Map([["2026-11-19", ["#111111", "#222222"]]]);

function setup(active: string | null = "2026-11-18") {
  const onPick = jest.fn();
  render(<WeekStrip days={days} today="2026-11-18" active={active} dots={dots} byDate={byDate} onPick={onPick} />);
  return onPick;
}

describe("WeekStrip", () => {
  it("una pastilla por día con su letra y su número", () => {
    setup();

    expect(screen.getAllByRole("button")).toHaveLength(7);
    expect(screen.getByText("X")).toBeTruthy();
    expect(screen.getByText("16")).toBeTruthy();
    expect(screen.getByText("22")).toBeTruthy();
  });

  it("el marcado, elegido; cada día dice cuántas clases tiene", () => {
    setup();

    expect(screen.getByRole("button", { name: "miércoles 18, 0 clases" }).props.accessibilityState).toEqual({
      selected: true,
    });
    expect(screen.getByRole("button", { name: "jueves 19, 3 clases" }).props.accessibilityState).toEqual({
      selected: false,
    });
  });

  it("hoy, si no es el marcado, lleva el punto coral", () => {
    setup("2026-11-19");

    expect(screen.getByTestId("day-today-mark")).toBeTruthy();
  });

  it("hoy marcado no lleva el punto", () => {
    setup();

    expect(screen.queryByTestId("day-today-mark")).toBeNull();
  });

  it("tocar un día avisa con su fecha", () => {
    const onPick = setup();

    fireEvent.press(screen.getByTestId("week-strip-2026-11-20"));

    expect(onPick).toHaveBeenCalledWith("2026-11-20");
  });
});
