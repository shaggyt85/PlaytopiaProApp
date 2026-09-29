import { render, screen } from "@testing-library/react-native";

import { NextClassCard } from "@/features/schedule/components/NextClassCard";
import { darkTheme } from "@/shared/config/theme";

import { nextClass } from "../../../helpers/scheduleFactories";

const mockGradient = jest.fn();
jest.mock("expo-linear-gradient", () => ({
  LinearGradient: (props: Record<string, unknown>) => {
    mockGradient(props);
    return null;
  },
}));

const club = { label: "Club Padel Indoor Madrid", colors: darkTheme.clubColors[0] };
// Cantera Tarde, el 5 de octubre a las 16:00, 75 min, Pista 1, nivel 2.5 - 3, 3/4.
const cantera = nextClass();

describe("NextClassCard", () => {
  it("lo de la captura: marca, título, club y pista, hora · duración · nivel y alumnos", () => {
    render(<NextClassCard item={cantera} club={club} today="2026-10-05" />);

    expect(screen.getByText("Próxima clase")).toBeTruthy();
    expect(screen.getByText("Cantera Tarde")).toBeTruthy();
    expect(screen.getByText("Club Padel Indoor Madrid")).toBeTruthy();
    expect(screen.getByText("· Pista 1")).toBeTruthy();
    expect(screen.getByText("16:00 · 75 min · Nivel 2.5 - 3")).toBeTruthy();
    expect(screen.getByText("3/4 alumnos")).toBeTruthy();
  });

  it("el fondo es el `ink` del prototipo, a 160°", () => {
    render(<NextClassCard item={cantera} club={club} today="2026-10-05" />);

    expect(mockGradient).toHaveBeenCalledWith(expect.objectContaining({ colors: darkTheme.gradients.ink }));
  });

  it("si es mañana u otro día, lo dice delante de la hora", () => {
    const { rerender } = render(<NextClassCard item={cantera} club={club} today="2026-10-04" />);
    expect(screen.getByText("Mañana · 16:00 · 75 min · Nivel 2.5 - 3")).toBeTruthy();

    rerender(<NextClassCard item={cantera} club={club} today="2026-10-01" />);
    expect(screen.getByText("lunes 5 · 16:00 · 75 min · Nivel 2.5 - 3")).toBeTruthy();
  });

  it("sin pista, solo el club", () => {
    render(<NextClassCard item={nextClass({ track_name: "" })} club={club} today="2026-10-05" />);

    expect(screen.queryByText(/Pista/)).toBeNull();
  });

  it("el lector de pantalla la lee entera de una vez", () => {
    render(<NextClassCard item={cantera} club={club} today="2026-10-04" />);

    expect(
      screen.getByLabelText(
        "Mañana, Cantera Tarde, 16:00, 75 minutos, Pista 1, Club Padel Indoor Madrid, 3 de 4 plazas, próxima clase, Nivel 2.5 - 3",
      ),
    ).toBeTruthy();
  });
});
