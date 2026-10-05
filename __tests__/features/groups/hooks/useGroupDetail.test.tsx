import { QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react-native";
import type { ReactNode } from "react";

import { useGroupDetail } from "@/features/groups/hooks/useGroupDetail";
import { createQueryClient } from "@/shared/config/queryClient";
import { serverNow } from "@/shared/utils/serverClock";

import { scheduleClass, scheduleResponse } from "../../../helpers/scheduleFactories";
import { signInTeacher } from "../../../helpers/scheduleMocks";

jest.mock("@/shared/utils/serverClock", () => ({ serverNow: jest.fn() }));

const session = (db_id: number, group_id: number, id: number) =>
  scheduleClass({ db_id, group_id, id, class_date: "2026-10-06", attendance_opens_at: "2026-10-06T14:00:00Z" });

function setup(groupId: number) {
  const getClasses = jest
    .fn()
    .mockResolvedValue(scheduleResponse({ classes: [session(4, 11, 31), session(5, 11, 41), session(4, 12, 51)] }));
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={createQueryClient()}>{children}</QueryClientProvider>
  );
  return renderHook(() => useGroupDetail(4, groupId, { getClasses }), { wrapper });
}

describe("useGroupDetail", () => {
  beforeEach(() => {
    signInTeacher();
    jest.mocked(serverNow).mockReturnValue(Date.parse("2026-10-05T10:00:00Z"));
  });

  it("el grupo de esa escuela, de la misma agenda que «Mis grupos»", async () => {
    const { result } = setup(11);

    await waitFor(() => expect(result.current.group?.next.id).toBe(31));
  });

  it("si ya no está, null (la pantalla dice «Grupo no encontrado»)", async () => {
    const { result } = setup(99);

    await waitFor(() => expect(result.current.hasData).toBe(true));
    expect(result.current.group).toBeNull();
  });
});
