import { fireEvent, screen } from "@testing-library/react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import { StudentDetailScreen } from "@/features/groups";
import { groupAttendanceService } from "@/features/groups/services/groupAttendanceService";
import { HttpError } from "@/shared/services/HttpError";
import { myClubsService } from "@/shared/services/myClubsService";
import { scheduleService } from "@/shared/services/scheduleService";
import { serverNow } from "@/shared/utils/serverClock";

import { studentAttendance } from "../../helpers/groupAttendanceFactories";
import { schoolCard } from "../../helpers/networkFactories";
import { renderWithProviders } from "../../helpers/renderWithProviders";
import { classStudent, scheduleClass, scheduleResponse } from "../../helpers/scheduleFactories";
import { signInTeacher } from "../../helpers/scheduleMocks";

jest.mock("expo-router", () => ({ useLocalSearchParams: jest.fn(), useRouter: jest.fn() }));
jest.mock("@/shared/services/scheduleService", () => require("../../helpers/scheduleMocks").scheduleServiceModule());
jest.mock("@/shared/services/myClubsService", () => require("../../helpers/scheduleMocks").myClubsServiceModule());
jest.mock("@/shared/utils/serverClock", () => ({ serverNow: jest.fn() }));

const router = {
  push: jest.fn(),
  back: jest.fn(),
  replace: jest.fn(),
  dismissTo: jest.fn(),
  canGoBack: jest.fn(() => true),
};
const cantera = scheduleClass({
  db_id: 4,
  club_id: 7,
  id: 31,
  group_id: 11,
  title: "Cantera Intermedios",
  class_date: "2026-10-06",
  attendance_opens_at: "2026-10-06T14:00:00Z",
  students: [
    classStudent({ student_id: 54, name: "Diego", last_name: "Pérez", level: 2 }),
    classStudent({ student_id: 77, name: "Marta", last_name: "Prieto", is_recovery: true }),
    classStudent({ student_id: 55, level: 2.5 }),
  ],
});
const getGroupAttendance = jest.spyOn(groupAttendanceService, "getGroupAttendance");

const openWith = (params: Record<string, string>) => {
  jest.mocked(useLocalSearchParams).mockReturnValue(params);
  renderWithProviders(<StudentDetailScreen />);
};

describe("StudentDetailScreen", () => {
  beforeEach(() => {
    signInTeacher();
    jest.mocked(serverNow).mockReturnValue(Date.parse("2026-10-05T10:00:00Z"));
    jest.mocked(useRouter).mockReturnValue(router as never);
    jest.mocked(myClubsService.getMyClubs).mockResolvedValue({ clubs: [schoolCard(4, 7, { club_name: "Sede Centro" })] });
    jest.mocked(scheduleService.getClasses).mockResolvedValue(scheduleResponse({ classes: [cantera] }));
    getGroupAttendance.mockResolvedValue([
      studentAttendance({ student_id: 55, alert: { kind: "absences_in_last", absences: 3, of: 4 } }),
    ]);
  });

  it("como el prototipo: el alumno con su nivel, su grupo, su asistencia y la próxima clase", async () => {
    openWith({ dbId: "4", groupId: "11", studentId: "55" });

    expect(await screen.findByRole("header", { name: "Lucía Romero" })).toBeTruthy();
    expect(screen.getByLabelText("Nivel 2,5")).toBeTruthy();
    expect(screen.getByTestId("student-group")).toBeTruthy();
    expect(await screen.findByLabelText("Vino a 1 de 2 clases, 3 ausencias en las últimas 4 clases")).toBeTruthy();
    expect(screen.getByTestId("next-session")).toBeTruthy();
    expect(getGroupAttendance).toHaveBeenCalledWith(4, 31);
  });

  it("«Su grupo» vuelve al detalle del grupo", async () => {
    openWith({ dbId: "4", groupId: "11", studentId: "55" });

    fireEvent.press(await screen.findByTestId("student-group"));

    expect(router.dismissTo).toHaveBeenCalledWith({
      pathname: "/group/[dbId]/[groupId]",
      params: { dbId: "4", groupId: "11" },
    });
  });

  it("un alumno sin marcas en el grupo, sin la sección de asistencia", async () => {
    openWith({ dbId: "4", groupId: "11", studentId: "54" });

    expect(await screen.findByRole("header", { name: "Diego Pérez" })).toBeTruthy();
    expect(screen.queryByTestId("attendance-history")).toBeNull();
  });

  it("si falla la asistencia, el error traducido en su sitio y el resto de la ficha", async () => {
    getGroupAttendance.mockRejectedValue(
      HttpError.fromResponse(403, { type: "urn:playtopia:problem:not-class-teacher", title: "Forbidden", status: 403 }),
    );
    openWith({ dbId: "4", groupId: "11", studentId: "55" });

    expect(await screen.findByText("Esta clase la da otro profesor.")).toBeTruthy();
    expect(screen.getByRole("header", { name: "Lucía Romero" })).toBeTruthy();
  });

  it("quien viene a recuperar, o quien ya no está en el grupo, no tiene ficha en él", async () => {
    openWith({ dbId: "4", groupId: "11", studentId: "77" });

    expect(await screen.findByText("Alumno no encontrado")).toBeTruthy();
  });

  it("unos parámetros que no valen: «Alumno no encontrado»", () => {
    openWith({ dbId: "4", groupId: "x", studentId: "55" });

    expect(screen.getByText("Alumno no encontrado")).toBeTruthy();
  });
});
