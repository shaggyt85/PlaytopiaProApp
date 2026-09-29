import { fireEvent, render, screen } from "@testing-library/react-native";

import { DayButton } from "@/features/schedule/components/DayButton";
import type { DayMark } from "@/features/schedule/utils/dayMark";

const mockGradient = jest.fn();
jest.mock("expo-linear-gradient", () => ({
  LinearGradient: (props: Record<string, unknown>) => {
    mockGradient(props);
    return null;
  },
}));

function setup(mark: DayMark, extra: { letter?: string; todayMark?: boolean } = {}) {
  const onPick = jest.fn();
  render(
    <DayButton
      date="2026-11-18"
      mark={mark}
      shape={{ borderRadius: 32 }}
      radius={32}
      numberVariant="rowTitle"
      dots={["#111111"]}
      onPick={onPick}
      accessibilityLabel="miércoles 18, 1 clase"
      testID="day"
      {...extra}
    />,
  );
  return onPick;
}

describe("DayButton", () => {
  it("el número del día, su letra si la lleva y lo que dice al lector de pantalla", () => {
    setup("other", { letter: "X" });

    expect(screen.getByText("18")).toBeTruthy();
    expect(screen.getByText("X")).toBeTruthy();
    expect(screen.getByRole("button", { name: "miércoles 18, 1 clase" }).props.accessibilityState).toEqual({
      selected: false,
    });
  });

  it("elegido: con el degradado de marca", () => {
    setup("selected");

    expect(mockGradient).toHaveBeenCalled();
    expect(screen.getByRole("button").props.accessibilityState).toEqual({ selected: true });
  });

  it("los demás, sin degradado", () => {
    setup("today");

    expect(mockGradient).not.toHaveBeenCalled();
  });

  it("el punto coral solo si se pide y el día es hoy sin elegir", () => {
    setup("today", { todayMark: true });
    expect(screen.getByTestId("day-today-mark")).toBeTruthy();
  });

  it("elegido, aunque se pida, sin punto coral", () => {
    setup("selected", { todayMark: true });
    expect(screen.queryByTestId("day-today-mark")).toBeNull();
  });

  it("tocarlo avisa con su fecha", () => {
    const onPick = setup("other");

    fireEvent.press(screen.getByTestId("day"));

    expect(onPick).toHaveBeenCalledWith("2026-11-18");
  });
});
