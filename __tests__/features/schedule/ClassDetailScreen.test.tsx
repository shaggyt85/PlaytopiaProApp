import { fireEvent, screen, waitFor } from "@testing-library/react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import { ClassDetailScreen } from "@/features/schedule/ClassDetailScreen";
import { scheduleService } from "@/features/schedule/services/scheduleService";
import { myClubsService } from "@/shared/services/myClubsService";
import { serverNow } from "@/shared/utils/serverClock";

import { schoolCard } from "../../helpers/networkFactories";
import { renderWithProviders } from "../../helpers/renderWithProviders";
import { scheduleClass, scheduleResponse } from "../../helpers/scheduleFactories";
import { signInTeacher } from "../../helpers/scheduleMocks";

jest.mock("expo-router", () => ({ useLocalSearchParams: jest.fn(), useRouter: jest.fn() }));
jest.mock("@/features/schedule/services/scheduleService", () =>
  require("../../helpers/scheduleMocks").scheduleServiceModule(),
);
jest.mock("@/shared/services/myClubsService", () => require("../../helpers/scheduleMocks").myClubsServiceModule());
jest.mock("@/shared/utils/serverClock", () => ({ serverNow: jest.fn() }));

// La clase de ejemplo es el 18 de noviembre a las 16:00.
const BEFORE_CLASS = new Date(2026, 10, 18, 15, 0).getTime();
const DURING_CLASS = new Date(2026, 10, 18, 16, 30).getTime();

const cantera = scheduleClass({
  db_id: 4,
  club_id: 7,
  id: 31,
  class_date: "2026-11-18",
  class_time: "16:00:00",
  title: "Cantera Tarde",
});
const router = { back: jest.fn(), replace: jest.fn(), canGoBack: jest.fn(() => true) };

const openWith = (params: Record<string, string>) => {
  jest.mocked(useLocalSearchParams).mockReturnValue(params);
  renderWithProviders(<ClassDetailScreen />);
};

describe("ClassDetailScreen", () => {
  beforeEach(() => {
    signInTeacher();
    jest.mocked(serverNow).mockReturnValue(BEFORE_CLASS);
    jest.mocked(useRouter).mockReturnValue(router as never);
    jest.mocked(myClubsService.getMyClubs).mockResolvedValue({
      clubs: [schoolCard(4, 7, { club_name: "Sede Centro" })],
    });
    jest.mocked(scheduleService.getClasses).mockResolvedValue(scheduleResponse({ classes: [cantera] }));
  });

  it("la cabecera de la clase con su club, sin la sección del club debajo", async () => {
    openWith({ dbId: "4", classId: "31", date: "2026-11-18" });

    expect(await screen.findByRole("header", { name: "Cantera Tarde" })).toBeTruthy();
    expect(await screen.findByText("Sede Centro")).toBeTruthy();
    expect(screen.queryByRole("header", { name: "Club" })).toBeNull();
  });

  it("debajo, sus alumnos con su nivel y cuántos han venido", async () => {
    openWith({ dbId: "4", classId: "31", date: "2026-11-18" });

    expect(await screen.findByRole("header", { name: "Alumnos y asistencia" })).toBeTruthy();
    expect(screen.getByLabelText("Diego Pérez, Nivel 3,0")).toBeTruthy();
    expect(screen.getByLabelText("Lucía Romero, Nivel 2,5")).toBeTruthy();
    expect(screen.getByText("0/2 presentes")).toBeTruthy();
  });

  it("antes de que empiece la clase, sin botones de asistencia", async () => {
    openWith({ dbId: "4", classId: "31", date: "2026-11-18" });

    expect(await screen.findByLabelText("Lucía Romero, Nivel 2,5")).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Marcar presente a Lucía Romero" })).toBeNull();
  });

  it("desde que empieza, se marca a cada alumno en la clase en la que está inscrito y se ve al instante", async () => {
    jest.mocked(serverNow).mockReturnValue(DURING_CLASS);
    // Core aún no ha contestado: lo que se ve es la marca puesta en la caché.
    jest.mocked(scheduleService.markAttendance).mockReturnValue(new Promise(() => undefined));
    openWith({ dbId: "4", classId: "31", date: "2026-11-18" });

    fireEvent.press(await screen.findByRole("button", { name: "Marcar presente a Lucía Romero" }));

    expect(await screen.findByText("1/2 presentes")).toBeTruthy();
    await waitFor(() =>
      expect(scheduleService.markAttendance).toHaveBeenCalledWith({ dbId: 4, classId: 31, studentId: 55 }, "present"),
    );
  });

  it("si la sede ya no está en «Mis clubes», la cabecera sin la línea del club", async () => {
    jest.mocked(myClubsService.getMyClubs).mockResolvedValue({ clubs: [] });
    openWith({ dbId: "4", classId: "31", date: "2026-11-18" });

    expect(await screen.findByRole("header", { name: "Cantera Tarde" })).toBeTruthy();
    expect(screen.queryByTestId("club-dot")).toBeNull();
  });

  it("← vuelve a donde se vino", async () => {
    openWith({ dbId: "4", classId: "31", date: "2026-11-18" });

    fireEvent.press(await screen.findByRole("button", { name: "Volver" }));

    expect(router.back).toHaveBeenCalled();
  });

  it("si no hay a dónde volver (se abrió desde un aviso), lleva a la Agenda", async () => {
    router.canGoBack.mockReturnValueOnce(false);
    openWith({ dbId: "4", classId: "31", date: "2026-11-18" });

    fireEvent.press(await screen.findByRole("button", { name: "Volver" }));

    expect(router.replace).toHaveBeenCalledWith("/");
  });

  it("si la clase ya no está, «Clase no encontrada» con «Volver»", async () => {
    openWith({ dbId: "4", classId: "99", date: "2026-11-18" });

    expect(await screen.findByText("Clase no encontrada")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Volver" })).toBeTruthy();
  });

  it("con parámetros que no son de una clase, «Clase no encontrada» sin pedir nada", () => {
    openWith({ dbId: "x", classId: "31" });

    expect(screen.getByText("Clase no encontrada")).toBeTruthy();
    expect(scheduleService.getClasses).not.toHaveBeenCalled();
  });

  it("mientras llega, «Cargando…»", () => {
    jest.mocked(scheduleService.getClasses).mockReturnValue(new Promise(() => undefined));
    openWith({ dbId: "4", classId: "31", date: "2026-11-18" });

    expect(screen.getByText("Cargando…")).toBeTruthy();
  });
});
