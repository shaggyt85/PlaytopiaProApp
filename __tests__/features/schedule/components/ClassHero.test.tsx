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

const colors = darkTheme.clubColors[3];
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

const renderHero = (props: Partial<Parameters<typeof ClassHero>[0]> = {}) =>
  render(<ClassHero item={item} clubLabel="Wave Padel Club" colors={colors} onBack={jest.fn()} {...props} />);

describe("ClassHero", () => {
  it("como el prototipo: título, club, el día y la hora, y la pista, el nivel y los alumnos", () => {
    renderHero();

    expect(screen.getByRole("header", { name: "Mini Padel · Grupo A" })).toBeTruthy();
    expect(screen.getByText("Wave Padel Club")).toBeTruthy();
    expect(screen.getByText("Lunes, 16 de noviembre · 08:30–09:30")).toBeTruthy();
    expect(screen.getByText("Pista 2")).toBeTruthy();
    expect(screen.getByText("2.5 - 3")).toBeTruthy();
    expect(screen.getByText("2/4 alumnos")).toBeTruthy();
  });

  it("con el degradado de la clase", () => {
    renderHero();

    expect(mockGradient).toHaveBeenCalledWith(expect.objectContaining({ colors: colors.gradient }));
  });

  it("el título en el tamaño de los títulos de tarjeta, no en el de pantalla", () => {
    renderHero();

    expect(screen.getByRole("header", { name: "Mini Padel · Grupo A" })).toHaveStyle({
      fontSize: darkTheme.typography.subtitle.fontSize,
    });
  });

  it("sin el club (la sede ya no está en «Mis clubes»), ni su línea", () => {
    renderHero({ clubLabel: "" });

    expect(screen.queryByTestId("club-dot")).toBeNull();
  });

  it("sin pista, no sale; ← vuelve", () => {
    const onBack = jest.fn();
    renderHero({ item: scheduleClass({ track_name: "" }), onBack });

    expect(screen.queryByText(/Pista/)).toBeNull();
    fireEvent.press(screen.getByRole("button", { name: "Volver" }));
    expect(onBack).toHaveBeenCalledTimes(1);
  });
});
