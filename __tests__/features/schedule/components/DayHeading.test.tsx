import { render, screen } from "@testing-library/react-native";
import { StyleSheet } from "react-native";

import { DayHeading } from "@/features/schedule/components/DayHeading";
import { darkTheme } from "@/shared/config/theme";
import { wallAsUtcMs } from "@/shared/utils/clubClock";

const styleOf = () => StyleSheet.flatten(screen.getByTestId("heading").props.style);

describe("DayHeading", () => {
  it("el día y cuántas clases tiene", () => {
    render(<DayHeading title="Miércoles 18" count={3} size="card" testID="heading" />);

    expect(screen.getByText("Miércoles 18")).toBeTruthy();
    expect(screen.getByText("3 clases")).toBeTruthy();
    expect(screen.queryByText(/^Hoy/)).toBeNull();
  });

  it("hoy, con «Hoy · hora»", () => {
    render(
      <DayHeading title="Miércoles 18" count={1} nowWall={wallAsUtcMs("2026-11-18", "23:10:00")} size="card" testID="heading" />,
    );

    expect(screen.getByText("Hoy · 23:10")).toBeTruthy();
    expect(screen.getByText("1 clase")).toBeTruthy();
  });

  it("como franja del Mes; la del día activo, resaltada en magenta", () => {
    const { rerender } = render(<DayHeading title="Miércoles, 18 de noviembre" count={2} size="strip" testID="heading" />);
    expect(styleOf().backgroundColor).toBe(darkTheme.colors.surface);

    rerender(<DayHeading title="Miércoles, 18 de noviembre" count={2} size="strip" active testID="heading" />);
    expect(styleOf().backgroundColor).not.toBe(darkTheme.colors.surface);
  });
});
