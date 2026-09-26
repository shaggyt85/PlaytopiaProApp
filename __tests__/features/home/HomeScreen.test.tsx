import { act, fireEvent, screen, waitFor } from "@testing-library/react-native";

import { HomeScreen } from "@/features/home/HomeScreen";
import { session } from "@/shared/services/session";
import { teacherProfileService } from "@/shared/services/teacherProfileService";
import { useSessionStore } from "@/shared/store/sessionStore";
import { serverNow } from "@/shared/utils/serverClock";

import { teacherProfile } from "../../helpers/authFactories";
import { renderWithProviders } from "../../helpers/renderWithProviders";

jest.mock("@/shared/services/session", () => ({
  session: { end: jest.fn().mockResolvedValue(undefined) },
}));
jest.mock("@/shared/services/teacherProfileService", () => ({
  ...jest.requireActual("@/shared/services/teacherProfileService"),
  teacherProfileService: { get: jest.fn(), update: jest.fn() },
}));
jest.mock("@/shared/utils/serverClock", () => ({ serverNow: jest.fn() }));

// Viernes 20 de noviembre de 2026, a las 9:30 de la hora del móvil.
const MORNING = new Date(2026, 10, 20, 9, 30).getTime();

describe("HomeScreen", () => {
  beforeEach(() => {
    useSessionStore.getState().setAuthenticated({ userId: 42, dbId: 7 });
    jest.mocked(serverNow).mockReturnValue(MORNING);
    jest.mocked(teacherProfileService.get).mockResolvedValue(teacherProfile());
  });

  it("saluda según la hora con el nombre del profesor y la fecha", async () => {
    renderWithProviders(<HomeScreen />);

    expect(await screen.findByRole("header", { name: "David" })).toBeTruthy();
    expect(screen.getByText("Buenos días, entrenador")).toBeTruthy();
    expect(screen.getByText("Viernes · 20 de noviembre")).toBeTruthy();
  });

  it("por la tarde cambia el saludo", async () => {
    jest.mocked(serverNow).mockReturnValue(new Date(2026, 10, 20, 17, 0).getTime());
    renderWithProviders(<HomeScreen />);

    expect(await screen.findByText("Buenas tardes, entrenador")).toBeTruthy();
  });

  it("si el perfil no llega, la cabecera sale igual sin el nombre", async () => {
    jest.mocked(teacherProfileService.get).mockRejectedValue(new Error("400"));
    renderWithProviders(<HomeScreen />);

    expect(await screen.findByText("Buenos días, entrenador")).toBeTruthy();
    expect(screen.queryByRole("header", { name: "David" })).toBeNull();
    // Sin el nombre no queda hueco: la fecha sube.
    await waitFor(() => expect(screen.queryByTestId("screen-header-title-placeholder")).toBeNull());
  });

  it("mientras llega el nombre reserva su hueco", () => {
    jest.mocked(teacherProfileService.get).mockReturnValue(new Promise(() => undefined));
    renderWithProviders(<HomeScreen />);

    expect(screen.getByTestId("screen-header-title-placeholder")).toBeTruthy();
  });

  it("muestra la campana de notificaciones", async () => {
    renderWithProviders(<HomeScreen />);

    expect(await screen.findByRole("button", { name: "Notificaciones" })).toBeTruthy();
  });

  it("Cerrar sesión (provisional) cierra la sesión", async () => {
    renderWithProviders(<HomeScreen />);

    await act(async () => {
      fireEvent.press(await screen.findByRole("button", { name: "Cerrar sesión" }));
    });

    expect(session.end).toHaveBeenCalledTimes(1);
  });
});
