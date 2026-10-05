import { QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react-native";
import type { ReactNode } from "react";

import { usePrefetchGroupAttendance } from "@/features/groups/hooks/usePrefetchGroupAttendance";
import { groupAttendanceKeys } from "@/features/groups/services/groupAttendanceService";
import { createQueryClient } from "@/shared/config/queryClient";
import { useSessionStore } from "@/shared/store/sessionStore";

import { studentAttendance } from "../../../helpers/groupAttendanceFactories";
import { signInTeacher } from "../../../helpers/scheduleMocks";

const target = { dbId: 4, groupId: 11, classId: 31 };

function setup() {
  const getGroupAttendance = jest.fn().mockResolvedValue([studentAttendance()]);
  const client = createQueryClient();
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  const hook = renderHook(() => usePrefetchGroupAttendance(target, { getGroupAttendance }), { wrapper });
  return { client, getGroupAttendance, hook };
}

describe("usePrefetchGroupAttendance", () => {
  it("deja el historial del grupo en la caché de sus fichas, con una petición", async () => {
    signInTeacher();
    const { client, getGroupAttendance, hook } = setup();

    await waitFor(() => expect(client.getQueryData(groupAttendanceKeys.of(42, 4, 11))).toEqual([studentAttendance()]));
    hook.rerender({});
    expect(getGroupAttendance).toHaveBeenCalledTimes(1);
    expect(getGroupAttendance).toHaveBeenCalledWith(4, 31);
  });

  it("sin profesor en sesión no pide nada", () => {
    useSessionStore.getState().setAnonymous();
    const { getGroupAttendance } = setup();

    expect(getGroupAttendance).not.toHaveBeenCalled();
  });
});
