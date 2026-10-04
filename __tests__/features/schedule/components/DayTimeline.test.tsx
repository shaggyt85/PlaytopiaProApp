import { render, screen } from "@testing-library/react-native";
import { StyleSheet } from "react-native";

import { DayTimeline } from "@/features/schedule/components/DayTimeline";
import { PAST_OPACITY } from "@/features/schedule/utils/timelineMetrics";
import { darkTheme } from "@/shared/config/theme";

import { scheduleClass } from "../../../helpers/scheduleFactories";

const hidden = { includeHiddenElements: true };
// 5 de octubre a las 16:30 del teléfono.
const now = new Date(2026, 9, 5, 16, 30).getTime();
const on5 = (id: number, class_time: string, duration_minutes = 60) =>
  scheduleClass({ id, class_date: "2026-10-05", class_time, duration_minutes });

const morning = on5(1, "09:00:00");
const live = on5(2, "16:00:00", 75);
const next = on5(3, "18:00:00");
const sameTime = on5(4, "18:00:00");
const clubOf = () => ({ label: "Sede Centro", colors: darkTheme.clubColors[0] });

const styleOf = (id: number) => StyleSheet.flatten(screen.getByTestId(`class-${id}`).props.style);

function setup(classes = [morning, live, next, sameTime], isToday = true) {
  render(<DayTimeline classes={classes} isToday={isToday} now={now} nextClassId={next.id} clubOf={clubOf} />);
}

describe("DayTimeline", () => {
  it("cada clase a su hora, a 80 por hora y con 86 de tarjeta como mínimo", () => {
    setup();

    // 60 minutos son 80 de alto, pero el hueco mide como mínimo 94: 86 de tarjeta y 8 de separación.
    expect(styleOf(1)).toMatchObject({ top: 80, height: 94 });
  });

  it("dos a la misma hora: una debajo de otra, a todo el ancho, y su tramo se estira", () => {
    setup();

    expect(styleOf(3)).toMatchObject({ top: 800, height: 94, left: 0, right: 0 });
    expect(styleOf(4)).toMatchObject({ top: 800 + 94, height: 94, left: 0, right: 0 });
    // La tira crece lo que se estira el tramo: las dos tarjetas en vez de una.
    expect(StyleSheet.flatten(screen.getByTestId("day-timeline").props.children.props.style).height).toBe(13 * 80 + 94);
  });

  it("cada clase con su color, por su orden en el día; en la línea, su punto del mismo color; el de la próxima brilla", () => {
    setup();

    for (const id of [1, 2, 3, 4]) expect(screen.getByTestId(`start-dot-${id}`, hidden)).toBeTruthy();
    const dot = (id: number) => StyleSheet.flatten(screen.getByTestId(`start-dot-${id}`, hidden).props.children.props.style);
    expect(dot(1).backgroundColor).toBe(darkTheme.clubColors[0].color);
    expect(dot(2).backgroundColor).toBe(darkTheme.clubColors[1].color);
    // 18:00 las dos: por su id, la 3 antes que la 4.
    expect(dot(3).backgroundColor).toBe(darkTheme.clubColors[2].color);
    expect(dot(4).backgroundColor).toBe(darkTheme.clubColors[3].color);
    expect(dot(3).boxShadow).toBeDefined();
    expect(dot(4).boxShadow).toBeUndefined();
  });

  it("sin panel: va directamente sobre el fondo de marca", () => {
    setup();

    expect(StyleSheet.flatten(screen.getByTestId("day-timeline").props.style).backgroundColor).toBeUndefined();
  });

  it("cada una con su estado: la que terminó apagada y la próxima marcada", () => {
    setup();

    expect(styleOf(1).opacity).toBe(PAST_OPACITY);
    expect(styleOf(2).opacity).toBeUndefined();
    expect(screen.getByLabelText(/en curso$/)).toBeTruthy();
    expect(screen.getByTestId("class-3-next")).toBeTruthy();
    expect(screen.queryByTestId("class-4-next")).toBeNull();
  });

  it("hoy, la línea de ahora a su hora", () => {
    setup();

    expect(StyleSheet.flatten(screen.getByTestId("now-line", hidden).props.style).top).toBe(8.5 * 80);
    expect(screen.getByText("16:30", hidden)).toBeTruthy();
  });

  it("otro día, sin línea de ahora", () => {
    setup(undefined, false);

    expect(screen.queryByTestId("now-line", hidden)).toBeNull();
  });

  it("la franja se amplía para una clase fuera de ella", () => {
    setup([on5(5, "06:30:00")]);

    expect(screen.getByTestId("hour-6", hidden)).toBeTruthy();
    expect(styleOf(5).top).toBe(40);
  });
});
