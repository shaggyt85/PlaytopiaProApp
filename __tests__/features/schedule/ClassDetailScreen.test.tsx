import { fireEvent, screen } from "@testing-library/react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import { ClassDetailScreen } from "@/features/schedule/ClassDetailScreen";
import { scheduleService } from "@/features/schedule/services/scheduleService";
import { myClubsService } from "@/shared/services/myClubsService";

import { schoolCard } from "../../helpers/networkFactories";
import { renderWithProviders } from "../../helpers/renderWithProviders";
import { scheduleClass, scheduleResponse } from "../../helpers/scheduleFactories";
import { signInTeacher } from "../../helpers/scheduleMocks";

jest.mock("expo-router", () => ({ useLocalSearchParams: jest.fn(), useRouter: jest.fn() }));
jest.mock("@/features/schedule/services/scheduleService", () =>
  require("../../helpers/scheduleMocks").scheduleServiceModule(),
);
jest.mock("@/shared/services/myClubsService", () => require("../../helpers/scheduleMocks").myClubsServiceModule());

const cantera = scheduleClass({ db_id: 4, club_id: 7, id: 31, class_date: "2026-11-18", title: "Cantera Tarde" });
const router = { back: jest.fn(), replace: jest.fn(), canGoBack: jest.fn(() => true) };

const openWith = (params: Record<string, string>) => {
  jest.mocked(useLocalSearchParams).mockReturnValue(params);
  renderWithProviders(<ClassDetailScreen />);
};

describe("ClassDetailScreen", () => {
  beforeEach(() => {
    signInTeacher();
    jest.mocked(useRouter).mockReturnValue(router as never);
    jest.mocked(myClubsService.getMyClubs).mockResolvedValue({ clubs: [schoolCard(4, 7, { club_name: "Sede Centro" })] });
    jest.mocked(scheduleService.getClasses).mockResolvedValue(scheduleResponse({ classes: [cantera] }));
  });

  it("la cabecera de la clase, con el nombre de su club", async () => {
    openWith({ dbId: "4", classId: "31", date: "2026-11-18" });

    expect(await screen.findByRole("header", { name: "Cantera Tarde" })).toBeTruthy();
    expect(await screen.findByText("Sede Centro")).toBeTruthy();
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
