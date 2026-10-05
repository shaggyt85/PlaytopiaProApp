import { QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react-native";
import type { ReactNode } from "react";
import { Alert } from "react-native";

import { useMarkAttendance } from "@/features/schedule/hooks/useMarkAttendance";
import type { ScheduleClass, ScheduleResponse } from "@/features/schedule/schemas/schedule.schema";
import { scheduleKeys } from "@/features/schedule/services/scheduleService";
import { createQueryClient } from "@/shared/config/queryClient";
import { HttpError } from "@/shared/services/HttpError";

import { attendanceMark, classStudent, scheduleClass, scheduleResponse } from "../../../helpers/scheduleFactories";

const target = { dbId: 4, classId: 31, studentId: 55 };
const key = scheduleKeys.classes(42, "2026-09-28", "2026-11-08");
const agenda = scheduleResponse({ classes: [scheduleClass({ students: [classStudent()] })], next_class: null });

function setup(markAttendance: jest.Mock) {
  const client = createQueryClient();
  client.setQueryData(key, agenda);
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  const hook = renderHook(() => useMarkAttendance({ markAttendance }), { wrapper });
  const attendance = () => client.getQueryData<ScheduleResponse>(key)?.classes[0].students[0].attendance;
  return { ...hook, client, attendance };
}

describe("useMarkAttendance", () => {
  beforeEach(() => jest.spyOn(Alert, "alert").mockImplementation(() => undefined));

  it("pide la marca a Core con la clase del alumno", async () => {
    const markAttendance = jest.fn().mockResolvedValue(attendanceMark());
    const { result } = setup(markAttendance);

    await act(() => result.current.mutateAsync({ target, status: "present" }));

    expect(markAttendance).toHaveBeenCalledWith(target, "present");
  });

  it("la marca se ve al instante, antes de que conteste Core", async () => {
    const markAttendance = jest.fn().mockReturnValue(new Promise(() => undefined));
    const { result, attendance } = setup(markAttendance);

    act(() => result.current.mutate({ target, status: "absent" }));

    await waitFor(() => expect(attendance()).toBe("absent"));
  });

  it("si Core la rechaza, vuelve la que había y un aviso dice por qué, traducido por su type", async () => {
    const markAttendance = jest.fn().mockRejectedValue(
      HttpError.fromResponse(409, { type: "urn:playtopia:problem:attendance-closed", status: 409 }),
    );
    const { result, attendance } = setup(markAttendance);

    act(() => result.current.mutate({ target, status: "present" }));

    await waitFor(() =>
      expect(Alert.alert).toHaveBeenCalledWith("Ya pasó el plazo para marcar la asistencia de esta clase."),
    );
    expect(attendance()).toBeNull();
  });

  it("también en la clase anterior de un grupo, con su forma (una sola clase)", async () => {
    const markAttendance = jest.fn().mockReturnValue(new Promise(() => undefined));
    const { result, client } = setup(markAttendance);
    const previousKey = scheduleKeys.previous(42, 4, 31);
    client.setQueryData(previousKey, scheduleClass({ id: 30, students: [classStudent({ class_id: 30 })] }));

    act(() => result.current.mutate({ target: { dbId: 4, classId: 30, studentId: 55 }, status: "absent" }));

    await waitFor(() =>
      expect(client.getQueryData<ScheduleClass>(previousKey)?.students[0].attendance).toBe("absent"),
    );
  });

  it("al terminar, la agenda se vuelve a pedir", async () => {
    const markAttendance = jest.fn().mockResolvedValue(attendanceMark());
    const { result, client } = setup(markAttendance);
    const invalidate = jest.spyOn(client, "invalidateQueries");

    await act(() => result.current.mutateAsync({ target, status: "present" }));

    expect(invalidate).toHaveBeenCalledWith({ queryKey: scheduleKeys.all });
  });
});
