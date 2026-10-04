import { fireEvent, render, screen } from "@testing-library/react-native";
import { StyleSheet } from "react-native";

import { MonthClassRow } from "@/features/schedule/components/MonthClassRow";
import { PAST_OPACITY } from "@/features/schedule/utils/timelineMetrics";
import { darkTheme } from "@/shared/config/theme";

import { scheduleClass } from "../../../helpers/scheduleFactories";

const mockPush = jest.fn();
jest.mock("expo-router", () => ({ useRouter: () => ({ push: mockPush }) }));

const club = { label: "Wave Padel Club", colors: darkTheme.clubColors[2] };
// Su color en el día, distinto del de su club.
const colors = darkTheme.clubColors[0];
const item = scheduleClass({
  id: 7,
  title: "Mini Padel · Grupo A",
  class_time: "08:30:00",
  track_name: "Pista 2",
});

describe("MonthClassRow", () => {
  it("como el prototipo: la hora, el título en dos líneas y «duración · pista · alumnos», sin el club", () => {
    render(<MonthClassRow item={item} colors={colors} club={club} status="upcoming" />);

    expect(screen.getByText("08:30")).toBeTruthy();
    expect(screen.getByText("Mini Padel · Grupo A").props.numberOfLines).toBe(2);
    expect(screen.getByText("75 min · Pista 2 · 3/4 alumnos")).toBeTruthy();
    expect(screen.queryByText(/Wave Padel Club/)).toBeNull();
  });

  it("el cuadrado de la hora, con su color en el día y no el de su club", () => {
    render(<MonthClassRow item={item} colors={colors} club={club} status="upcoming" />);

    const gradients = screen.UNSAFE_root.findAll((n) => Array.isArray(n.props.colors)).map((n) => n.props.colors);
    expect(gradients).toContainEqual(colors.gradient);
    expect(gradients).not.toContainEqual(club.colors.gradient);
  });

  it("si ya terminó, apagada como en Día y Semana", () => {
    render(<MonthClassRow item={item} colors={colors} club={club} status="past" />);

    expect(
      StyleSheet.flatten(screen.getByTestId("month-class-7").props.style)
        .opacity,
    ).toBe(PAST_OPACITY);
  });

  it("el lector de pantalla la lee entera", () => {
    render(<MonthClassRow item={item} colors={colors} club={club} status="upcoming" />);

    expect(
      screen.getByLabelText(
        /^Mini Padel · Grupo A, 08:30, 75 minutos, Pista 2, Wave Padel Club, 3 de 4 plazas$/,
      ),
    ).toBeTruthy();
  });
  it("al tocarla abre su detalle", () => {
    render(<MonthClassRow item={item} colors={colors} club={club} status="upcoming" />);

    fireEvent.press(screen.getByTestId("month-class-7"));

    expect(mockPush).toHaveBeenCalledWith({
      pathname: "/class/[dbId]/[classId]",
      params: { dbId: "4", classId: "7", date: "2026-10-05" },
    });
  });
});
