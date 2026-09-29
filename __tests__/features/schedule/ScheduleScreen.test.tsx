import { act, fireEvent, screen, waitFor } from "@testing-library/react-native";

import { ScheduleScreen } from "@/features/schedule/ScheduleScreen";
import { scheduleService } from "@/features/schedule/services/scheduleService";
import { myClubsService } from "@/shared/services/myClubsService";
import { session } from "@/shared/services/session";
import { teacherProfileService } from "@/shared/services/teacherProfileService";
import { useSessionStore } from "@/shared/store/sessionStore";
import { serverNow } from "@/shared/utils/serverClock";

import { teacherProfile } from "../../helpers/authFactories";
import { schoolCard } from "../../helpers/networkFactories";
import { renderWithProviders } from "../../helpers/renderWithProviders";
import { nextClass, scheduleClass, scheduleResponse } from "../../helpers/scheduleFactories";

jest.mock("@/shared/services/session", () => ({
  session: { end: jest.fn().mockResolvedValue(undefined) },
}));
jest.mock("@/shared/services/teacherProfileService", () => ({
  ...jest.requireActual("@/shared/services/teacherProfileService"),
  teacherProfileService: { get: jest.fn(), update: jest.fn() },
}));
jest.mock("@/shared/utils/serverClock", () => ({ serverNow: jest.fn() }));
jest.mock("@/features/schedule/services/scheduleService", () => ({
  ...jest.requireActual("@/features/schedule/services/scheduleService"),
  scheduleService: { getClasses: jest.fn() },
}));
jest.mock("@/shared/services/myClubsService", () => ({
  ...jest.requireActual("@/shared/services/myClubsService"),
  myClubsService: { getMyClubs: jest.fn() },
}));

// Viernes 20 de noviembre de 2026, a las 9:30 de la hora del móvil.
const MORNING = new Date(2026, 10, 20, 9, 30).getTime();

describe("ScheduleScreen", () => {
  beforeEach(() => {
    useSessionStore.getState().setAuthenticated({ userId: 42, dbId: 7 });
    jest.mocked(serverNow).mockReturnValue(MORNING);
    jest.mocked(teacherProfileService.get).mockResolvedValue(teacherProfile());
    jest.mocked(myClubsService.getMyClubs).mockResolvedValue({ clubs: [schoolCard(4, 7)] });
    jest.mocked(scheduleService.getClasses).mockResolvedValue(
      scheduleResponse({
        classes: [scheduleClass({ id: 31, class_date: "2026-11-20", class_time: "16:00:00" })],
        next_class: nextClass({ id: 31, class_date: "2026-11-20", class_time: "16:00:00", starts_at: "2026-11-20T15:00:00Z" }),
      }),
    );
  });

  it("encima de la agenda, la tarjeta de la próxima clase, que es la marcada en la tira", async () => {
    renderWithProviders(<ScheduleScreen />);

    expect(await screen.findByTestId("next-class")).toBeTruthy();
    expect(screen.getByText("Próxima clase")).toBeTruthy();
    expect(screen.getByTestId("class-31-next")).toBeTruthy();
  });

  it("sin próxima clase, no hay tarjeta", async () => {
    jest.mocked(scheduleService.getClasses).mockResolvedValue(scheduleResponse({ classes: [], next_class: null }));
    renderWithProviders(<ScheduleScreen />);

    expect(await screen.findByText("Día libre · sin compromisos")).toBeTruthy();
    expect(screen.queryByTestId("next-class")).toBeNull();
  });

  it("debajo de la cabecera, la vista Día de hoy con sus clases", async () => {
    renderWithProviders(<ScheduleScreen />);

    expect(await screen.findByTestId("class-31")).toBeTruthy();
    expect(screen.getByText("Hoy · viernes 20")).toBeTruthy();
    expect(screen.getByText("viernes 20 · 09:30")).toBeTruthy();
    // El mes entero de la cuadrícula, en una sola petición.
    expect(scheduleService.getClasses).toHaveBeenCalledWith("2026-10-26", "2026-12-06");
  });

  it("las flechas cambian de día", async () => {
    renderWithProviders(<ScheduleScreen />);
    await screen.findByTestId("class-31");

    fireEvent.press(screen.getByRole("button", { name: "Día siguiente" }));

    expect(screen.getByText("sábado 21")).toBeTruthy();
    expect(screen.getByText("Día libre · sin compromisos")).toBeTruthy();
  });

  it("saluda según la hora con el nombre del profesor y la fecha", async () => {
    renderWithProviders(<ScheduleScreen />);

    expect(await screen.findByRole("header", { name: "David" })).toBeTruthy();
    expect(screen.getByText("Buenos días, entrenador")).toBeTruthy();
    expect(screen.getByText("Viernes · 20 de noviembre")).toBeTruthy();
  });

  it("por la tarde cambia el saludo", async () => {
    jest.mocked(serverNow).mockReturnValue(new Date(2026, 10, 20, 17, 0).getTime());
    renderWithProviders(<ScheduleScreen />);

    expect(await screen.findByText("Buenas tardes, entrenador")).toBeTruthy();
  });

  it("si el perfil no llega, la cabecera sale igual sin el nombre", async () => {
    jest.mocked(teacherProfileService.get).mockRejectedValue(new Error("400"));
    renderWithProviders(<ScheduleScreen />);

    expect(await screen.findByText("Buenos días, entrenador")).toBeTruthy();
    expect(screen.queryByRole("header", { name: "David" })).toBeNull();
    // Sin el nombre no queda hueco: la fecha sube.
    await waitFor(() => expect(screen.queryByTestId("screen-header-title-placeholder")).toBeNull());
  });

  it("mientras llega el nombre reserva su hueco", () => {
    jest.mocked(teacherProfileService.get).mockReturnValue(new Promise(() => undefined));
    renderWithProviders(<ScheduleScreen />);

    expect(screen.getByTestId("screen-header-title-placeholder")).toBeTruthy();
  });

  it("muestra la campana de notificaciones, desactivada hasta que existan", async () => {
    renderWithProviders(<ScheduleScreen />);

    expect(await screen.findByRole("button", { name: "Notificaciones" })).toBeDisabled();
  });

  it("Cerrar sesión (provisional) cierra la sesión", async () => {
    renderWithProviders(<ScheduleScreen />);

    await act(async () => {
      fireEvent.press(await screen.findByRole("button", { name: "Cerrar sesión" }));
    });

    expect(session.end).toHaveBeenCalledTimes(1);
  });
});
