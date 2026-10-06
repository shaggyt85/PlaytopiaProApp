import { fireEvent, render, screen } from "@testing-library/react-native";
import { StyleSheet } from "react-native";

import { WeekClassRow } from "@/features/schedule/components/WeekClassRow";
import type { ClassStatus } from "@/features/schedule/utils/classTiming";
import { PAST_OPACITY } from "@/features/schedule/utils/timelineMetrics";
import { darkTheme } from "@/shared/config/theme";

import { scheduleClass } from "../../../helpers/scheduleFactories";

const mockPush = jest.fn();
jest.mock("expo-router", () => ({ useRouter: () => ({ push: mockPush }) }));

const club = { label: "Wave Padel Club", colors: darkTheme.clubColors[2] };
// Su color en el día, distinto del de su club.
const colors = darkTheme.clubColors[4];
// Mini Padel, 08:30, 60 min, Pista 2, 2/4… con los datos de la fábrica: 3/4.
const item = scheduleClass({
  id: 7,
  title: "Mini Padel · Grupo A",
  class_time: "08:30:00",
  duration_minutes: 60,
  track_name: "Pista 2",
});

const setup = (status: ClassStatus = "upcoming") =>
  render(<WeekClassRow item={item} colors={colors} club={club} status={status} />);
const rowStyle = () =>
  StyleSheet.flatten(screen.getByTestId("week-class-7").props.style);

describe("WeekClassRow", () => {
  it("la hora, el título, «60 min · pista» y las plazas; sin el club, como en Día", () => {
    setup();

    expect(screen.getByText("08:30")).toBeTruthy();
    expect(screen.getByText("Mini Padel · Grupo A")).toBeTruthy();
    expect(screen.getByText("Mini Padel · Grupo A").props.numberOfLines).toBe(2);
    expect(screen.queryByTestId("club-badge")).toBeNull();
    expect(screen.getByText("60 min · Pista 2")).toBeTruthy();
    expect(screen.getByText("3/4 alumnos")).toBeTruthy();
  });

  it("el cuadrado de la hora y la barra, con su color en el día y no el de su club", () => {
    setup();

    const gradients = screen.UNSAFE_root.findAll((n) => Array.isArray(n.props.colors)).map((n) => n.props.colors);
    expect(gradients).toContainEqual(colors.gradient);
    expect(gradients).not.toContainEqual(club.colors.gradient);
  });

  it("la barra, llena según sus plazas", () => {
    setup();

    expect(
      StyleSheet.flatten(screen.getByTestId("week-class-7-bar", { includeHiddenElements: true }).props.style)
        .width,
    ).toBe("75%");
  });

  it("en curso: «En vivo» y resaltada", () => {
    setup("live");

    expect(screen.getByTestId("week-class-7-live")).toBeTruthy();
    expect(screen.getByText("En vivo")).toBeTruthy();
    expect(rowStyle().borderColor).not.toBe(darkTheme.colors.hairline);
  });

  it("la próxima: «Próxima» y resaltada, como la que está en curso", () => {
    setup("next");

    expect(screen.getByTestId("week-class-7-next")).toBeTruthy();
    expect(rowStyle().borderColor).not.toBe(darkTheme.colors.hairline);
  });

  it("si ya terminó, apagada como en Día y «Completada»", () => {
    setup("past");

    expect(rowStyle().opacity).toBe(PAST_OPACITY);
    expect(screen.getByTestId("week-class-7-done")).toBeTruthy();
    expect(screen.queryByTestId("week-class-7-live")).toBeNull();
  });

  it("por venir: sin marca y sin resaltar", () => {
    setup();

    expect(screen.queryByTestId(/^week-class-7-(live|next|done)$/)).toBeNull();
    expect(rowStyle().borderColor).toBe(darkTheme.colors.hairline);
  });

  it("el lector de pantalla la lee entera, como las de Día", () => {
    setup("live");

    expect(
      screen.getByLabelText(
        /^Mini Padel · Grupo A, 08:30, 60 minutos, Pista 2, Wave Padel Club, 3 de 4 plazas, en curso$/,
      ),
    ).toBeTruthy();
  });
  it("al tocarla abre su detalle", () => {
    setup();

    fireEvent.press(screen.getByTestId("week-class-7"));

    expect(mockPush).toHaveBeenCalledWith({
      pathname: "/class/[dbId]/[classId]",
      params: { dbId: "4", classId: "7", date: "2026-10-05" },
    });
  });
});
