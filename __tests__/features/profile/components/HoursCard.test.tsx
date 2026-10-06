import { fireEvent, screen, within } from "@testing-library/react-native";
import { StyleSheet } from "react-native";

import { HoursCard } from "@/features/profile/components/HoursCard";
import { profileDetailsService } from "@/features/profile/services/profileDetailsService";
import { HttpError } from "@/shared/services/HttpError";
import { myClubsService } from "@/shared/services/myClubsService";

import { schoolCard } from "../../../helpers/networkFactories";
import { profileClub, profileDetails } from "../../../helpers/profileFactories";
import { renderWithProviders } from "../../../helpers/renderWithProviders";
import { signInTeacher } from "../../../helpers/scheduleMocks";

jest.mock("@/features/profile/services/profileDetailsService", () => ({
  ...jest.requireActual("@/features/profile/services/profileDetailsService"),
  profileDetailsService: { get: jest.fn() },
}));
jest.mock("@/shared/services/myClubsService", () => require("../../../helpers/scheduleMocks").myClubsServiceModule());

/** Una cifra de horas: `done` de `planned` minutos, una clase por hora. */
const tally = (done: number, planned: number) => ({
  planned_minutes: planned,
  done_minutes: done,
  planned_classes: planned / 60,
  done_classes: done / 60,
});

/**
 * Octubre (en curso): 9 de 12 horas en la 70, con 8 de 11 clases. Septiembre:
 * 4 horas en la 70 y 2 en la 71. Agosto: nada planificado.
 */
const withHistory = () => {
  const october = { planned_minutes: 720, done_minutes: 540, planned_classes: 11, done_classes: 8 };
  return profileDetails({
    hours: {
      clubs: [profileClub, { ...profileClub, club_id: 71, club_name: "Indoor Norte" }],
      months: [
        { month: "2026-10", total: october, clubs: [{ db_id: 7, club_id: 70, ...october }] },
        {
          month: "2026-09",
          total: tally(360, 360),
          clubs: [
            { db_id: 7, club_id: 70, ...tally(240, 240) },
            { db_id: 7, club_id: 71, ...tally(120, 120) },
          ],
        },
        { month: "2026-08", total: tally(0, 0), clubs: [] },
      ],
    },
  });
};

const forbidden = () => HttpError.fromResponse(403, { type: "about:blank", title: "Forbidden", status: 403 });

describe("HoursCard", () => {
  beforeEach(() => {
    signInTeacher();
    jest.mocked(myClubsService.getMyClubs).mockResolvedValue({
      clubs: [schoolCard(7, 70, { club_name: "Indoor Centro" })],
    });
  });

  it("el mes, las horas planificadas, las clases dadas de las planificadas y cada sede con su avance", async () => {
    jest.mocked(profileDetailsService.get).mockResolvedValue(profileDetails());
    renderWithProviders(<HoursCard />);

    expect(await screen.findByText("12:00 h")).toBeTruthy();
    expect(screen.getByRole("header", { name: "Horas este mes" })).toBeTruthy();
    expect(screen.getByText("Octubre")).toBeTruthy();
    expect(screen.getByText("8 de 11 clases en pista")).toBeTruthy();
    expect(await screen.findByText("Indoor Centro")).toBeTruthy();
    expect(screen.getByText("9:00 / 12:00 h")).toBeTruthy();
    // 9 de 12 horas: tres cuartos.
    expect(StyleSheet.flatten(screen.getByTestId("club-hours-7-70-bar", { includeHiddenElements: true }).props.style).width).toBe("75%");
  });

  it("el historial está cerrado; al abrirlo, solo los meses trabajados", async () => {
    jest.mocked(profileDetailsService.get).mockResolvedValue(withHistory());
    renderWithProviders(<HoursCard />);

    const toggle = await screen.findByRole("button", { name: "Historial de horas", expanded: false });
    expect(screen.queryByTestId("hours-history")).toBeNull();

    fireEvent.press(toggle);
    expect(screen.getByRole("button", { name: "Historial de horas", expanded: true })).toBeTruthy();
    expect(screen.getByTestId("hours-month-2026-10")).toBeTruthy();
    expect(screen.getByTestId("hours-month-2026-09")).toBeTruthy();
    // Agosto no tuvo nada planificado: no sale.
    expect(screen.queryByTestId("hours-month-2026-08")).toBeNull();
  });

  it("un mes de una sola sede, al abrirlo, solo sus clases: sus horas ya están en la fila", async () => {
    jest.mocked(profileDetailsService.get).mockResolvedValue(withHistory());
    renderWithProviders(<HoursCard />);
    fireEvent.press(await screen.findByRole("button", { name: "Historial de horas" }));

    fireEvent.press(screen.getByRole("button", { name: "Octubre, 9:00 / 12:00 h" }));

    const detail = within(screen.getByTestId("hours-month-2026-10-detail"));
    expect(detail.getByText("8 de 11 clases")).toBeTruthy();
    expect(detail.queryByText("9:00 / 12:00 h")).toBeNull();
  });

  it("un mes de dos sedes, al abrirlo, sus clases y lo de cada sede", async () => {
    jest.mocked(profileDetailsService.get).mockResolvedValue(withHistory());
    renderWithProviders(<HoursCard />);
    fireEvent.press(await screen.findByRole("button", { name: "Historial de horas" }));

    fireEvent.press(screen.getByRole("button", { name: "Septiembre, 6:00 / 6:00 h" }));

    const detail = within(screen.getByTestId("hours-month-2026-09-detail"));
    expect(detail.getByText("6 de 6 clases")).toBeTruthy();
    expect(detail.getByText("4:00 / 4:00 h")).toBeTruthy();
    expect(detail.getByText("2:00 / 2:00 h")).toBeTruthy();
  });

  it("un mes abierto a la vez: abrir otro cierra el anterior", async () => {
    jest.mocked(profileDetailsService.get).mockResolvedValue(withHistory());
    renderWithProviders(<HoursCard />);
    fireEvent.press(await screen.findByRole("button", { name: "Historial de horas" }));

    fireEvent.press(screen.getByTestId("hours-month-2026-10"));
    fireEvent.press(screen.getByTestId("hours-month-2026-09"));

    expect(screen.queryByTestId("hours-month-2026-10-detail")).toBeNull();
    expect(screen.getByTestId("hours-month-2026-09-detail")).toBeTruthy();
  });

  it("sin ningún mes trabajado, no hay historial", async () => {
    const empty = { planned_minutes: 0, done_minutes: 0, planned_classes: 0, done_classes: 0 };
    const { hours } = profileDetails();
    jest.mocked(profileDetailsService.get).mockResolvedValue(
      profileDetails({
        hours: {
          clubs: hours.clubs,
          months: hours.months.map((m) => ({ ...m, total: empty, clubs: m.clubs.map((c) => ({ ...c, ...empty })) })),
        },
      }),
    );
    renderWithProviders(<HoursCard />);

    expect(await screen.findByText("0:00 h")).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Historial de horas" })).toBeNull();
  });

  it("sin clubes, lo dice, como la tarjeta de clubes", async () => {
    const { hours, availability } = profileDetails();
    jest
      .mocked(profileDetailsService.get)
      .mockResolvedValue(
        profileDetails({ hours: { clubs: [], months: hours.months.map((m) => ({ ...m, clubs: [] })) }, availability }),
      );
    renderWithProviders(<HoursCard />);

    expect(await screen.findByText("Aún no trabajas en ningún club")).toBeTruthy();
  });

  it("si las horas no llegan, el error en la tarjeta con «Reintentar»", async () => {
    jest.mocked(profileDetailsService.get).mockRejectedValue(forbidden());
    renderWithProviders(<HoursCard />);

    expect(await screen.findByRole("button", { name: "Reintentar" })).toBeTruthy();
    expect(screen.getByRole("header", { name: "Horas este mes" })).toBeTruthy();
  });
});
