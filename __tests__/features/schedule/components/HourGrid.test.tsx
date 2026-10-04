import { render, screen } from "@testing-library/react-native";
import { StyleSheet } from "react-native";

import { HourGrid } from "@/features/schedule/components/HourGrid";
import { timelineScale } from "@/features/schedule/utils/timelineGeometry";
import { darkTheme } from "@/shared/config/theme";

const hidden = { includeHiddenElements: true };
const topOf = (testID: string) => StyleSheet.flatten(screen.getByTestId(testID, hidden).props.style).top;
const styleOf = (testID: string) => StyleSheet.flatten(screen.getByTestId(testID, hidden).props.children.props.style);

const magenta = darkTheme.clubColors[0].color;
const sky = darkTheme.clubColors[2].color;
/** La escala de la tira a 80 por hora, sin tramos estirados. */
const yOf = (start: number, end: number) => timelineScale({ start, end }, 80).yOf;

describe("HourGrid", () => {
  it("una marca por hora de la franja, ambas incluidas, centrada en su hora", () => {
    render(<HourGrid span={{ start: 8, end: 10 }} yOf={yOf(8, 10)} starts={[]} />);

    expect(screen.getByText("08:00", hidden)).toBeTruthy();
    expect(screen.getByText("10:00", hidden)).toBeTruthy();
    expect(screen.queryByTestId("hour-11", hidden)).toBeNull();
    // Las 9 caen a 80 de las 8; la marca, de 16 de alto, se centra ahí.
    expect(topOf("hour-9") - topOf("hour-8")).toBe(80);
  });

  it("cada clase: un punto de su color en su minuto y su hora si no es en punto", () => {
    render(
      <HourGrid
        span={{ start: 7, end: 10 }}
        yOf={yOf(7, 10)}
        starts={[
          { id: 1, time: "07:30:00", minutes: 450, color: magenta, next: false },
          { id: 2, time: "09:00:00", minutes: 540, color: sky, next: true },
        ]}
      />,
    );

    // 07:30, a media hora de las 7: a mitad de camino de las 8.
    expect(topOf("start-dot-1") - topOf("hour-7")).toBe(40);
    expect(screen.getByText("07:30", hidden)).toBeTruthy();
    expect(styleOf("start-dot-1").backgroundColor).toBe(magenta);
    // Las 9 ya tienen su hora: no se repite.
    expect(screen.queryByTestId("start-label-540", hidden)).toBeNull();
    expect(screen.getAllByText("09:00", hidden)).toHaveLength(1);
    // La próxima brilla.
    expect(styleOf("start-dot-2").boxShadow).toBeDefined();
    expect(styleOf("start-dot-1").boxShadow).toBeUndefined();
  });

  it("dos clases a la misma hora: una sola etiqueta y un punto por clase", () => {
    render(
      <HourGrid
        span={{ start: 18, end: 20 }}
        yOf={yOf(18, 20)}
        starts={[
          { id: 1, time: "18:30:00", minutes: 1110, color: magenta, next: false },
          { id: 2, time: "18:30:00", minutes: 1110, color: sky, next: false },
        ]}
      />,
    );

    expect(screen.getAllByText("18:30", hidden)).toHaveLength(1);
    expect(screen.getByTestId("start-dot-1", hidden)).toBeTruthy();
    expect(screen.getByTestId("start-dot-2", hidden)).toBeTruthy();
  });

  it("el lector de pantalla no lo lee: las tarjetas ya dicen su hora", () => {
    render(<HourGrid span={{ start: 8, end: 10 }} yOf={yOf(8, 10)} starts={[]} />);

    expect(screen.queryByText("08:00")).toBeNull();
  });
});
