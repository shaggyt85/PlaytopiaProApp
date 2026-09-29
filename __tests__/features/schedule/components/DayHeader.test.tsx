import { render, screen } from "@testing-library/react-native";

import { DayHeader } from "@/features/schedule/components/DayHeader";

describe("DayHeader", () => {
  it("la pastilla del día y cuántas clases tiene", () => {
    render(<DayHeader label="Hoy · lunes 5" classCount={3} />);

    expect(screen.getByText("Hoy · lunes 5")).toBeTruthy();
    expect(screen.getByText("3 clases")).toBeTruthy();
  });

  it("una clase, en singular", () => {
    render(<DayHeader label="martes 6" classCount={1} />);

    expect(screen.getByText("1 clase")).toBeTruthy();
  });

  it("sin datos todavía, sin contador", () => {
    render(<DayHeader label="martes 6" />);

    expect(screen.getByText("martes 6")).toBeTruthy();
    expect(screen.queryByText(/clase/)).toBeNull();
  });
});
