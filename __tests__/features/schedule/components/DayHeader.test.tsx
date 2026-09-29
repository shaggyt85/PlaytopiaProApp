import { render, screen } from "@testing-library/react-native";

import { DayHeader } from "@/features/schedule/components/DayHeader";

describe("DayHeader", () => {
  it("hoy lo dice delante del día, con cuántas clases tiene", () => {
    render(<DayHeader date="2026-10-05" isToday classCount={3} />);

    expect(screen.getByText("Hoy · lunes 5")).toBeTruthy();
    expect(screen.getByText("3 clases")).toBeTruthy();
  });

  it("otro día, solo el día; y una clase en singular", () => {
    render(<DayHeader date="2026-10-06" isToday={false} classCount={1} />);

    expect(screen.getByText("martes 6")).toBeTruthy();
    expect(screen.getByText("1 clase")).toBeTruthy();
  });
});
