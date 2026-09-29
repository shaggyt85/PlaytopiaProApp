import { fireEvent, render, screen } from "@testing-library/react-native";

import { WeekFilter } from "@/features/schedule/components/WeekFilter";

describe("WeekFilter", () => {
  it("«Filtrado por martes 19», con el día aparte", () => {
    render(<WeekFilter date="2026-11-17" onShowAll={jest.fn()} />);

    expect(screen.getByText("Filtrado por martes 17")).toBeTruthy();
    expect(screen.getByText("martes 17")).toBeTruthy();
  });

  it("«Ver toda la semana» quita el filtro", () => {
    const onShowAll = jest.fn();
    render(<WeekFilter date="2026-11-17" onShowAll={onShowAll} />);

    fireEvent.press(screen.getByRole("button", { name: "Ver toda la semana" }));

    expect(onShowAll).toHaveBeenCalledTimes(1);
  });
});
