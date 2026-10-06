import { render, screen } from "@testing-library/react-native";
import { StyleSheet, Text } from "react-native";

import { HoursProgressRow } from "@/features/profile/components/HoursProgressRow";

const row = (overrides: Partial<Parameters<typeof HoursProgressRow>[0]> = {}) => (
  <HoursProgressRow label="Octubre" doneMinutes={300} plannedMinutes={1530} share={300 / 1530} testID="row" {...overrides} />
);

describe("HoursProgressRow", () => {
  it("el nombre y lo hecho de lo planificado en una sola línea, y la barra de su avance", () => {
    render(row());

    expect(screen.getByText("Octubre")).toBeTruthy();
    expect(screen.getByText("5:00 / 25:30 h").props.numberOfLines).toBe(1);
    expect(StyleSheet.flatten(screen.getByTestId("row-bar", { includeHiddenElements: true }).props.style).width).toBe(
      `${(300 / 1530) * 100}%`,
    );
  });

  it("con 200 horas planificadas, las horas siguen en una línea", () => {
    render(row({ doneMinutes: 6330, plannedMinutes: 12000, share: 6330 / 12000 }));

    expect(screen.getByText("105:30 / 200:00 h").props.numberOfLines).toBe(1);
  });

  it("lo de delante (el punto de un club) y lo de detrás (la › de un mes)", () => {
    render(row({ leading: <Text>●</Text>, trailing: <Text>›</Text> }));

    expect(screen.getByText("●")).toBeTruthy();
    expect(screen.getByText("›")).toBeTruthy();
  });
});
