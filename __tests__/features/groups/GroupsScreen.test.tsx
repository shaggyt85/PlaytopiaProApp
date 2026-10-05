import { fireEvent, screen } from "@testing-library/react-native";
import { useRouter } from "expo-router";

import { GroupsScreen } from "@/features/groups";
import { myClubsService } from "@/shared/services/myClubsService";
import { scheduleService } from "@/shared/services/scheduleService";
import { serverNow } from "@/shared/utils/serverClock";

import { schoolCard } from "../../helpers/networkFactories";
import { renderWithProviders } from "../../helpers/renderWithProviders";
import { scheduleClass, scheduleResponse } from "../../helpers/scheduleFactories";
import { signInTeacher } from "../../helpers/scheduleMocks";

jest.mock("expo-router", () => ({ useRouter: jest.fn() }));
jest.mock("@/shared/services/scheduleService", () => require("../../helpers/scheduleMocks").scheduleServiceModule());
jest.mock("@/shared/services/myClubsService", () => require("../../helpers/scheduleMocks").myClubsServiceModule());
jest.mock("@/shared/utils/serverClock", () => ({ serverNow: jest.fn() }));

const router = { push: jest.fn() };
const cantera = scheduleClass({
  db_id: 4,
  club_id: 7,
  id: 31,
  group_id: 11,
  title: "Cantera Intermedios",
  class_date: "2026-10-06",
  attendance_opens_at: "2026-10-06T14:00:00Z",
});

describe("GroupsScreen", () => {
  beforeEach(() => {
    signInTeacher();
    jest.mocked(serverNow).mockReturnValue(Date.parse("2026-10-05T10:00:00Z"));
    jest.mocked(useRouter).mockReturnValue(router as never);
    jest.mocked(myClubsService.getMyClubs).mockResolvedValue({ clubs: [schoolCard(4, 7, { club_name: "Sede Centro" })] });
    jest.mocked(scheduleService.getClasses).mockResolvedValue(scheduleResponse({ classes: [cantera] }));
  });

  it("«Mis grupos», cuántos tiene activos y una tarjeta por grupo", async () => {
    renderWithProviders(<GroupsScreen />);

    expect(screen.getByRole("header", { name: "Mis grupos" })).toBeTruthy();
    expect(await screen.findByText("1 grupo activo")).toBeTruthy();
    expect(screen.getAllByTestId("group-card")).toHaveLength(1);
  });

  it("tocar un grupo abre su detalle", async () => {
    renderWithProviders(<GroupsScreen />);

    fireEvent.press(await screen.findByTestId("group-card"));

    expect(router.push).toHaveBeenCalledWith({ pathname: "/group/[dbId]/[groupId]", params: { dbId: "4", groupId: "11" } });
  });

  it("sin grupos, la tarjeta vacía de siempre con su mensaje", async () => {
    jest.mocked(scheduleService.getClasses).mockResolvedValue(scheduleResponse({ classes: [] }));
    renderWithProviders(<GroupsScreen />);

    expect(await screen.findByText("Aún no tienes grupos ni clases")).toBeTruthy();
    expect(screen.getByText("0 grupos activos")).toBeTruthy();
  });

  it("mientras llega, «Cargando…»", () => {
    jest.mocked(scheduleService.getClasses).mockReturnValue(new Promise(() => undefined));
    renderWithProviders(<GroupsScreen />);

    expect(screen.getByText("Cargando…")).toBeTruthy();
  });
});
