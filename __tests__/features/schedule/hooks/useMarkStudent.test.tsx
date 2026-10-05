import { renderHook } from "@testing-library/react-native";
import { Alert } from "react-native";

import { useMarkAttendance } from "@/features/schedule/hooks/useMarkAttendance";
import { useMarkStudent } from "@/features/schedule/hooks/useMarkStudent";
import type { AttendanceState } from "@/features/schedule/utils/attendanceWindow";
import { selectionFeedback } from "@/shared/utils/haptics";

import { classStudent } from "../../../helpers/scheduleFactories";

jest.mock("@/features/schedule/hooks/useMarkAttendance", () => ({ useMarkAttendance: jest.fn() }));
jest.mock("@/shared/utils/haptics", () => ({ selectionFeedback: jest.fn() }));

const mutate = jest.fn();
// Recupera en la clase 31 desde su plaza, la 90.
const marta = classStudent({ class_id: 90, student_id: 77, attendance: null, is_recovery: true });

const markWith = (attendance: AttendanceState) => renderHook(() => useMarkStudent(4, attendance)).result.current;

describe("useMarkStudent", () => {
  beforeEach(() => {
    jest.mocked(useMarkAttendance).mockReturnValue({ mutate } as never);
    jest.spyOn(Alert, "alert").mockImplementation(() => undefined);
  });

  it("con la asistencia abierta, marca en la clase en la que está inscrito, con su vibración", () => {
    markWith("open")(marta, "present");

    expect(selectionFeedback).toHaveBeenCalled();
    expect(mutate).toHaveBeenCalledWith({ target: { dbId: 4, classId: 90, studentId: 77 }, status: "present" });
  });

  it("la marca que ya tiene no se vuelve a pedir", () => {
    markWith("open")({ ...marta, attendance: "present" }, "present");

    expect(mutate).not.toHaveBeenCalled();
  });

  it("pasado el plazo, dice por qué, como lo diría Core, sin pedirle nada", () => {
    markWith("closed")(marta, "present");

    expect(Alert.alert).toHaveBeenCalledWith("Ya pasó el plazo para marcar la asistencia de esta clase.");
    expect(mutate).not.toHaveBeenCalled();
  });

  it("antes de que abra, nada", () => {
    markWith("notYet")(marta, "present");

    expect(mutate).not.toHaveBeenCalled();
    expect(Alert.alert).not.toHaveBeenCalled();
  });
});
