import { fireEvent, render, screen } from "@testing-library/react-native";

import { DayToolbar } from "@/features/schedule/components/DayToolbar";
import { wallAsUtcMs } from "@/shared/utils/clubClock";

function setup() {
  const onPrevious = jest.fn();
  const onNext = jest.fn();
  render(
    <DayToolbar
      date="2026-10-06"
      nowWall={wallAsUtcMs("2026-10-05", "15:21:00")}
      onPrevious={onPrevious}
      onNext={onNext}
    />,
  );
  return { onPrevious, onNext };
}

describe("DayToolbar", () => {
  it("el día que se ve y la hora de ahora", () => {
    setup();

    expect(screen.getByText("martes 6 · 15:21")).toBeTruthy();
  });

  it("‹ pide el día anterior y › el siguiente", () => {
    const { onPrevious, onNext } = setup();

    fireEvent.press(screen.getByRole("button", { name: "Día anterior" }));
    expect(onPrevious).toHaveBeenCalledTimes(1);

    fireEvent.press(screen.getByRole("button", { name: "Día siguiente" }));
    expect(onNext).toHaveBeenCalledTimes(1);
  });
});
