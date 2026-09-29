import { render, screen } from "@testing-library/react-native";
import { StyleSheet } from "react-native";

import { HourGrid } from "@/features/schedule/components/HourGrid";

const hidden = { includeHiddenElements: true };

describe("HourGrid", () => {
  it("una fila por hora de la franja, ambas incluidas, a su altura", () => {
    render(<HourGrid span={{ start: 8, end: 10 }} hourHeight={64} />);

    expect(screen.getByText("08:00", hidden)).toBeTruthy();
    expect(screen.getByText("10:00", hidden)).toBeTruthy();
    expect(screen.queryByTestId("hour-11", hidden)).toBeNull();
    expect(StyleSheet.flatten(screen.getByTestId("hour-9", hidden).props.style).top).toBe(64);
  });

  it("el lector de pantalla no la lee: las tarjetas ya dicen su hora", () => {
    render(<HourGrid span={{ start: 8, end: 10 }} hourHeight={64} />);

    expect(screen.queryByText("08:00")).toBeNull();
  });
});
