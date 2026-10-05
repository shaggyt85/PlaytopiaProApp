import { fireEvent, screen } from "@testing-library/react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import { GroupDetailScreen } from "@/features/groups";
import { groupAttendanceService } from "@/features/groups/services/groupAttendanceService";
import { myClubsService } from "@/shared/services/myClubsService";
import { scheduleService } from "@/shared/services/scheduleService";
import { serverNow } from "@/shared/utils/serverClock";

import { schoolCard } from "../../helpers/networkFactories";
import { renderWithProviders } from "../../helpers/renderWithProviders";
import { classStudent, scheduleClass, scheduleResponse } from "../../helpers/scheduleFactories";
import { signInTeacher } from "../../helpers/scheduleMocks";

jest.mock("expo-router", () => ({ useLocalSearchParams: jest.fn(), useRouter: jest.fn() }));
jest.mock("@/shared/services/scheduleService", () => require("../../helpers/scheduleMocks").scheduleServiceModule());
jest.mock("@/shared/services/myClubsService", () => require("../../helpers/scheduleMocks").myClubsServiceModule());
jest.mock("@/shared/utils/serverClock", () => ({ serverNow: jest.fn() }));

const router = { push: jest.fn(), back: jest.fn(), replace: jest.fn(), canGoBack: jest.fn(() => true) };
const cantera = scheduleClass({
  db_id: 4,
  club_id: 7,
  id: 31,
  group_id: 11,
  title: "Cantera Intermedios",
  level_range: "2 - 3",
  class_date: "2026-10-06",
  attendance_opens_at: "2026-10-06T14:00:00Z",
  track_name: "Pista 1",
  students: [
    classStudent({ student_id: 54, name: "Diego", last_name: "Pérez" }),
    classStudent(),
    classStudent({ student_id: 77, name: "Marta", last_name: "Prieto", is_recovery: true }),
  ],
});

const getGroupAttendance = jest.spyOn(groupAttendanceService, "getGroupAttendance");

const openWith = (params: Record<string, string>) => {
  jest.mocked(useLocalSearchParams).mockReturnValue(params);
  renderWithProviders(<GroupDetailScreen />);
};

describe("GroupDetailScreen", () => {
  beforeEach(() => {
    signInTeacher();
    jest.mocked(serverNow).mockReturnValue(Date.parse("2026-10-05T10:00:00Z"));
    jest.mocked(useRouter).mockReturnValue(router as never);
    jest.mocked(myClubsService.getMyClubs).mockResolvedValue({ clubs: [schoolCard(4, 7, { club_name: "Sede Centro" })] });
    jest.mocked(scheduleService.getClasses).mockResolvedValue(scheduleResponse({ classes: [cantera] }));
    getGroupAttendance.mockResolvedValue([]);
  });

  it("como el prototipo: el nombre, la sede y la pista, y cuántos alumnos tiene el grupo", async () => {
    openWith({ dbId: "4", groupId: "11" });

    expect(await screen.findByRole("header", { name: "Cantera Intermedios" })).toBeTruthy();
    expect(await screen.findByText("Sede Centro · Pista 1")).toBeTruthy();
    expect(screen.getByText("2 alumnos inscritos")).toBeTruthy();
  });

  it("«Alumnos del grupo» sin los que vienen a recuperar, que se cuentan en la próxima clase", async () => {
    openWith({ dbId: "4", groupId: "11" });

    expect(await screen.findAllByTestId("group-student")).toHaveLength(2);
    expect(screen.queryByLabelText(/Marta Prieto/)).toBeNull();
    expect(screen.getByText("3 alumnos previstos", { includeHiddenElements: true })).toBeTruthy();
  });

  it("tocar la próxima clase abre su detalle", async () => {
    openWith({ dbId: "4", groupId: "11" });

    fireEvent.press(await screen.findByTestId("next-session"));

    expect(router.push).toHaveBeenCalledWith({
      pathname: "/class/[dbId]/[classId]",
      params: { dbId: "4", classId: "31", date: "2026-10-06" },
    });
  });

  it("tocar un alumno abre su ficha en el grupo", async () => {
    openWith({ dbId: "4", groupId: "11" });

    fireEvent.press(await screen.findByRole("button", { name: /^Diego Pérez/ }));

    expect(router.push).toHaveBeenCalledWith({
      pathname: "/student/[dbId]/[groupId]/[studentId]",
      params: { dbId: "4", groupId: "11", studentId: "54" },
    });
  });

  it("pide ya el historial de asistencia del grupo, con su próxima clase, para sus fichas", async () => {
    openWith({ dbId: "4", groupId: "11" });

    await screen.findByTestId("group-students");
    expect(getGroupAttendance).toHaveBeenCalledWith(4, 31);
  });

  it("‹ vuelve a donde se vino", async () => {
    openWith({ dbId: "4", groupId: "11" });

    fireEvent.press(await screen.findByRole("button", { name: "Volver" }));

    expect(router.back).toHaveBeenCalled();
  });

  it("si el grupo ya no está, «Grupo no encontrado» con «Volver»", async () => {
    openWith({ dbId: "4", groupId: "99" });

    expect(await screen.findByText("Grupo no encontrado")).toBeTruthy();
  });

  it("con parámetros que no son de un grupo, «Grupo no encontrado» sin pedir nada", () => {
    openWith({ dbId: "x", groupId: "11" });

    expect(screen.getByText("Grupo no encontrado")).toBeTruthy();
    expect(scheduleService.getClasses).not.toHaveBeenCalled();
  });
});
