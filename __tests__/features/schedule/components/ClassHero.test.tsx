import { fireEvent, render, screen } from "@testing-library/react-native";

import { ClassHero } from "@/features/schedule/components/ClassHero";
import { darkTheme } from "@/shared/config/theme";

import { scheduleClass } from "../../../helpers/scheduleFactories";

const mockGradient = jest.fn();
jest.mock("expo-linear-gradient", () => ({
  LinearGradient: (props: Record<string, unknown>) => {
    mockGradient(props);
    return null;
  },
}));

const club = { label: "Wave Padel Club", colors: darkTheme.clubColors[2] };
const item = scheduleClass({
  title: "Mini Padel · Grupo A",
  class_date: "2026-11-16",
  class_time: "08:30:00",
  duration_minutes: 60,
  track_name: "Pista 2",
  level_range: "2.5 - 3",
  current_participants: 2,
  max_participants: 4,
});

describe("ClassHero", () => {
  it("lo de la captura: nivel, título, club, día y hora, pista y las cifras", () => {
    render(<ClassHero item={item} club={club} onBack={jest.fn()} />);

    expect(screen.getByRole("header", { name: "Mini Padel · Grupo A" })).toBeTruthy();
    expect(screen.getByText("Wave Padel Club")).toBeTruthy();
    expect(screen.getByText("Lunes, 16 de noviembre · 08:30–09:30")).toBeTruthy();
    expect(screen.getByText("Pista 2")).toBeTruthy();
    expect(screen.getByLabelText("Alumnos: 2/4")).toBeTruthy();
    expect(screen.getByLabelText("Nivel: 2.5 - 3")).toBeTruthy();
    // El nivel también arriba, en su pastilla.
    expect(screen.getAllByText("2.5 - 3", { includeHiddenElements: true })).toHaveLength(2);
  });

  it("con el degradado de su club", () => {
    render(<ClassHero item={item} club={club} onBack={jest.fn()} />);

    expect(mockGradient).toHaveBeenCalledWith(expect.objectContaining({ colors: club.colors.gradient }));
  });

  it("solo las cifras con datos: sin «Objetivos» hasta que existan los planes", () => {
    render(<ClassHero item={item} club={club} onBack={jest.fn()} />);

    expect(screen.queryByText("Objetivos")).toBeNull();
  });

  it("sin pista, no sale; ← vuelve", () => {
    const onBack = jest.fn();
    render(<ClassHero item={scheduleClass({ track_name: "" })} club={club} onBack={onBack} />);

    expect(screen.queryByText(/Pista/)).toBeNull();
    fireEvent.press(screen.getByRole("button", { name: "Volver" }));
    expect(onBack).toHaveBeenCalledTimes(1);
  });
});
