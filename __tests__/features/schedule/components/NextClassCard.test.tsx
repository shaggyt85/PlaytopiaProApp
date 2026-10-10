import { act, fireEvent, render, screen } from "@testing-library/react-native";

import { NextClassCard } from "@/features/schedule/components/NextClassCard";
import { darkTheme } from "@/shared/config/theme";
import { useReduceMotion } from "@/shared/hooks/useReduceMotion";

import { classStudent, nextClass, scheduleClass } from "../../../helpers/scheduleFactories";

const mockPush = jest.fn();
jest.mock("expo-router", () => ({ useRouter: () => ({ push: mockPush }) }));
jest.mock("@/shared/hooks/useReduceMotion", () => ({ useReduceMotion: jest.fn(() => false) }));

const mockGradient = jest.fn();
jest.mock("expo-linear-gradient", () => ({
  LinearGradient: (props: Record<string, unknown>) => {
    mockGradient(props);
    return null;
  },
}));

const club = { label: "Club Padel Indoor Madrid", colors: darkTheme.clubColors[0] };
// Cantera Tarde, el lunes 5 de octubre a las 16:00 (14:00 UTC), 75 min, Pista 1, nivel 2.5 - 3, 3/4.
const cantera = { item: nextClass(), live: false } as const;
const START = Date.parse("2026-10-05T14:00:00Z");
const MINUTE = 60_000;

describe("NextClassCard", () => {
  beforeEach(() => jest.mocked(useReduceMotion).mockReturnValue(false));

  it("lo del prototipo: etiqueta, título, club y pista, alumnos, franja y nivel tal como lo manda Core", () => {
    render(<NextClassCard hero={cantera} club={club} today="2026-10-05" now={START - 3 * 60 * MINUTE} />);

    expect(screen.getByText("Próxima clase · hoy 16:00")).toBeTruthy();
    expect(screen.getByText("Cantera Tarde")).toBeTruthy();
    expect(screen.getByText("Club Padel Indoor Madrid · Pista 1")).toBeTruthy();
    expect(screen.getByText("3/4 alumnos")).toBeTruthy();
    expect(screen.getByText("16:00–17:15")).toBeTruthy();
    expect(screen.getByText("2.5 - 3")).toBeTruthy();
  });

  it("sin nivel, no pinta el nivel", () => {
    const withoutLevel = { item: { ...nextClass(), level_range: null }, live: false } as const;
    render(<NextClassCard hero={withoutLevel} club={club} today="2026-10-05" now={START - 3 * 60 * MINUTE} />);

    expect(screen.queryByText("2.5 - 3")).toBeNull();
    expect(screen.getByText("16:00–17:15")).toBeTruthy();
  });

  it("dice cuándo empieza: en minutos si falta una hora o menos, mañana u otro día", () => {
    const { rerender } = render(<NextClassCard hero={cantera} club={club} today="2026-10-05" now={START - 45 * MINUTE} />);
    expect(screen.getByText("Próxima clase · en 45 min")).toBeTruthy();

    rerender(<NextClassCard hero={cantera} club={club} today="2026-10-04" now={START - 24 * 60 * MINUTE} />);
    expect(screen.getByText("Próxima clase · mañana 16:00")).toBeTruthy();

    rerender(<NextClassCard hero={cantera} club={club} today="2026-10-01" now={START - 4 * 24 * 60 * MINUTE} />);
    expect(screen.getByText(/^Próxima clase · lun\.? 5 · 16:00$/)).toBeTruthy();
  });

  it("la clase en curso: «En curso» y su punto late", () => {
    jest.useFakeTimers();
    try {
      render(
        <NextClassCard hero={{ item: scheduleClass(), live: true }} club={club} today="2026-10-05" now={START + 10 * MINUTE} />,
      );
      expect(screen.getByText("En curso")).toBeTruthy();

      act(() => jest.advanceTimersByTime(1000));
      expect(screen.getByTestId("next-class-dot")).toHaveAnimatedStyle({ opacity: 0.5 });
    } finally {
      jest.useRealTimers();
    }
  });

  it("con «reducir movimiento», el punto no late", () => {
    jest.useFakeTimers();
    jest.mocked(useReduceMotion).mockReturnValue(true);
    try {
      render(
        <NextClassCard hero={{ item: scheduleClass(), live: true }} club={club} today="2026-10-05" now={START + 10 * MINUTE} />,
      );

      act(() => jest.advanceTimersByTime(1000));
      expect(screen.getByTestId("next-class-dot")).toHaveAnimatedStyle({ opacity: 1 });
    } finally {
      jest.useRealTimers();
    }
  });

  it("quien viene a recuperar lleva su «R», y debajo de las plazas, cuántos recuperan", () => {
    const item = nextClass({
      students: [
        classStudent({ student_id: 54, name: "Diego", last_name: "Pérez" }),
        classStudent({ is_recovery: true }),
      ],
    });
    render(<NextClassCard hero={{ item, live: false }} club={club} today="2026-10-05" now={START - 3 * 60 * MINUTE} />);

    expect(screen.getByText("+1 recuperación")).toBeTruthy();
    expect(screen.getAllByTestId("student-avatar-recovery", { includeHiddenElements: true })).toHaveLength(1);
  });

  it("sin nadie que recupere, ni la línea ni la «R»", () => {
    render(<NextClassCard hero={cantera} club={club} today="2026-10-05" now={START - 3 * 60 * MINUTE} />);

    expect(screen.queryByText(/recuperación/)).toBeNull();
    expect(screen.queryByTestId("student-avatar-recovery", { includeHiddenElements: true })).toBeNull();
  });

  it("sin pista, solo el club", () => {
    render(
      <NextClassCard
        hero={{ item: nextClass({ track_name: "" }), live: false }}
        club={club}
        today="2026-10-05"
        now={START - 3 * 60 * MINUTE}
      />,
    );

    expect(screen.getByText("Club Padel Indoor Madrid")).toBeTruthy();
  });

  it("el fondo, el degradado del prototipo con su toque magenta y violeta", () => {
    render(<NextClassCard hero={cantera} club={club} today="2026-10-05" now={START - 3 * 60 * MINUTE} />);

    expect(mockGradient).toHaveBeenCalledWith(
      expect.objectContaining({ colors: darkTheme.gradients.nextClass, locations: [0, 0.6, 1] }),
    );
  });

  it("el lector de pantalla la lee entera de una vez", () => {
    render(<NextClassCard hero={cantera} club={club} today="2026-10-04" now={START - 24 * 60 * MINUTE} />);

    expect(
      screen.getByLabelText(
        "Próxima clase · mañana 16:00, Cantera Tarde, 16:00, 75 minutos, Pista 1, Club Padel Indoor Madrid, 3 de 4 plazas, Nivel 2.5 - 3",
      ),
    ).toBeTruthy();
  });

  it("al tocarla abre su detalle", () => {
    render(<NextClassCard hero={cantera} club={club} today="2026-10-05" now={START - 3 * 60 * MINUTE} />);

    fireEvent.press(screen.getByTestId("next-class"));

    expect(mockPush).toHaveBeenCalledWith({
      pathname: "/class/[dbId]/[classId]",
      params: { dbId: "4", classId: "31", date: "2026-10-05" },
    });
  });
});
