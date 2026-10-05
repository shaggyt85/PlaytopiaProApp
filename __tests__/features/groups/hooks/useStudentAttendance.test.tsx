import { QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react-native";
import type { ReactNode } from "react";

import { useStudentAttendance } from "@/features/groups/hooks/useStudentAttendance";
import { createQueryClient } from "@/shared/config/queryClient";

import { studentAttendance } from "../../../helpers/groupAttendanceFactories";
import { signInTeacher } from "../../../helpers/scheduleMocks";

const target = { dbId: 4, groupId: 11, classId: 31 };

function setup(studentIds: number[], getGroupAttendance = jest.fn()) {
  getGroupAttendance.mockResolvedValue([
    studentAttendance({ student_id: 54 }),
    studentAttendance({ student_id: 55, present: 2 }),
  ]);
  const client = createQueryClient();
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  const hooks = studentIds.map(
    (id) => renderHook(() => useStudentAttendance(target, id, { getGroupAttendance }), { wrapper }).result,
  );
  return { hooks, getGroupAttendance };
}

describe("useStudentAttendance", () => {
  beforeEach(() => signInTeacher());

  it("el historial del alumno, de la consulta de su grupo pedida con una clase suya", async () => {
    const { hooks, getGroupAttendance } = setup([55]);

    await waitFor(() => expect(hooks[0].current.attendance?.present).toBe(2));
    expect(getGroupAttendance).toHaveBeenCalledWith(4, 31);
  });

  it("todas las fichas del grupo, una sola petición", async () => {
    const { hooks, getGroupAttendance } = setup([54, 55]);

    await waitFor(() => expect(hooks[1].current.attendance?.student_id).toBe(55));
    expect(hooks[0].current.attendance?.student_id).toBe(54);
    expect(getGroupAttendance).toHaveBeenCalledTimes(1);
  });

  it("un alumno sin marcas en el grupo no tiene historial", async () => {
    const { hooks, getGroupAttendance } = setup([99]);

    await waitFor(() => expect(getGroupAttendance).toHaveBeenCalled());
    expect(hooks[0].current.attendance).toBeNull();
  });
});
