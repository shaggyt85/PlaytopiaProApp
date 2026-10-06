import { fireEvent, screen, waitFor } from "@testing-library/react-native";
import { useRouter } from "expo-router";

import { ScheduleScreen } from "@/features/schedule/ScheduleScreen";
import { myClubsService } from "@/shared/services/myClubsService";
import { scheduleService } from "@/shared/services/scheduleService";
import { teacherProfileService } from "@/shared/services/teacherProfileService";
import { serverNow } from "@/shared/utils/serverClock";

import { teacherProfile } from "../../helpers/authFactories";
import { schoolCard } from "../../helpers/networkFactories";
import { renderWithProviders } from "../../helpers/renderWithProviders";
import { signInTeacher } from "../../helpers/scheduleMocks";
import { nextClass, scheduleClass, scheduleResponse } from "../../helpers/scheduleFactories";

jest.mock("expo-router", () => ({ ...jest.requireActual("expo-router"), useRouter: jest.fn() }));
jest.mock("@/shared/services/teacherProfileService", () => ({
  ...jest.requireActual("@/shared/services/teacherProfileService"),
  teacherProfileService: { get: jest.fn(), update: jest.fn() },
}));
jest.mock("@/shared/utils/serverClock", () => ({ serverNow: jest.fn() }));
const mockImage = jest.fn();
jest.mock("expo-image", () => ({
  Image: (props: Record<string, unknown>) => {
    mockImage(props);
    return null;
  },
}));
jest.mock("@/shared/services/scheduleService", () =>
  require("../../helpers/scheduleMocks").scheduleServiceModule(),
);
jest.mock("@/shared/services/myClubsService", () => require("../../helpers/scheduleMocks").myClubsServiceModule());

// Viernes 20 de noviembre de 2026, a las 9:30 de la hora del móvil.
const MORNING = new Date(2026, 10, 20, 9, 30).getTime();

describe("ScheduleScreen", () => {
  const navigate = jest.fn();

  beforeEach(() => {
    jest.mocked(useRouter).mockReturnValue({ navigate, push: jest.fn(), back: jest.fn() } as never);
    signInTeacher();
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

  it("en orden: la cabecera, la próxima clase, «MI AGENDA», la barra con las pestañas y la vista Día", async () => {
    renderWithProviders(<ScheduleScreen />);

    expect(await screen.findByTestId("class-31")).toBeTruthy();
    expect(screen.getByRole("header", { name: "David" })).toBeTruthy();
    expect(screen.getByTestId("next-class")).toBeTruthy();
    expect(screen.getByRole("header", { name: "Mi agenda" })).toBeTruthy();
    expect(screen.getByTestId("schedule-views")).toBeTruthy();
    expect(screen.queryByTestId("club-legend")).toBeNull();
  });

  it("el selector lleva a Semana y a Mes", async () => {
    renderWithProviders(<ScheduleScreen />);
    await screen.findByTestId("class-31");

    fireEvent.press(screen.getByRole("tab", { name: "Semana" }));
    expect(screen.getByTestId("week-class-31")).toBeTruthy();

    fireEvent.press(screen.getByRole("tab", { name: "Mes" }));
    expect(screen.getByTestId("month-class-31")).toBeTruthy();
  });

  it("encima de la agenda, la tarjeta de la próxima clase, que es la marcada en la tira", async () => {
    renderWithProviders(<ScheduleScreen />);

    expect(await screen.findByTestId("next-class")).toBeTruthy();
    expect(screen.getByText("Próxima clase · hoy 16:00")).toBeTruthy();
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
    expect(screen.getByTestId("schedule-today").props.accessibilityLabel).toBe("Hoy");
    // El mes entero de la cuadrícula, en una sola petición.
    expect(scheduleService.getClasses).toHaveBeenCalledWith("2026-10-26", "2026-12-06");
  });

  it("las flechas cambian de día", async () => {
    renderWithProviders(<ScheduleScreen />);
    await screen.findByTestId("class-31");

    fireEvent.press(screen.getByRole("button", { name: "Día siguiente" }));

    expect(screen.getByTestId("schedule-today").props.accessibilityLabel).toMatch(/^Sáb\.? 21 nov\.?$/);
    expect(screen.getByText("Día libre · sin compromisos")).toBeTruthy();
  });

  it("saluda según la hora con el nombre del profesor y la fecha", async () => {
    renderWithProviders(<ScheduleScreen />);

    expect(await screen.findByRole("header", { name: "David" })).toBeTruthy();
    expect(screen.getByText("Buenos días, entrenador")).toBeTruthy();
    expect(screen.getByText("Viernes · 20 de noviembre")).toBeTruthy();
  });

  it("a la izquierda del saludo, la foto del perfil, que lleva a Perfil", async () => {
    renderWithProviders(<ScheduleScreen />);

    expect(await screen.findByRole("button", { name: "Mi perfil" })).toBeTruthy();
    await waitFor(() =>
      expect(mockImage).toHaveBeenLastCalledWith(
        expect.objectContaining({ source: { uri: "https://img.test/avatars/teacher/42.jpg" } }),
      ),
    );
  });

  it("bajo la cabecera, las cifras de hoy: clases, plazas sumadas y tiempo real en pista", async () => {
    jest.mocked(scheduleService.getClasses).mockResolvedValue(
      scheduleResponse({
        classes: [
          // 16:00–17:15 y 16:30–17:30 en dos pistas: de 16:00 a 17:30, 1:30 h.
          scheduleClass({ id: 31, class_date: "2026-11-20", class_time: "16:00:00", duration_minutes: 75, current_participants: 3 }),
          scheduleClass({ id: 32, class_date: "2026-11-20", class_time: "16:30:00", duration_minutes: 60, current_participants: 4 }),
          // Otro día: no cuenta.
          scheduleClass({ id: 33, class_date: "2026-11-21", class_time: "10:00:00", current_participants: 2 }),
        ],
        next_class: null,
      }),
    );
    renderWithProviders(<ScheduleScreen />);

    expect(await screen.findByLabelText("clases hoy: 2")).toBeTruthy();
    expect(screen.getByLabelText("alumnos hoy: 7")).toBeTruthy();
    expect(screen.getByLabelText("en pista hoy: 1:30 h")).toBeTruthy();
  });

  it("mientras no llega la agenda, no enseña cifras", () => {
    jest.mocked(scheduleService.getClasses).mockReturnValue(new Promise(() => undefined));
    renderWithProviders(<ScheduleScreen />);

    expect(screen.queryByTestId("today-stats")).toBeNull();
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

  it("su foto lleva a Perfil", async () => {
    renderWithProviders(<ScheduleScreen />);

    fireEvent.press(await screen.findByRole("button", { name: "Mi perfil" }));

    expect(navigate).toHaveBeenCalledWith("/profile");
  });

  it("ya no tiene «Cerrar sesión»: está en Perfil", async () => {
    renderWithProviders(<ScheduleScreen />);

    expect(await screen.findByTestId("class-31")).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Cerrar sesión" })).toBeNull();
  });
});
