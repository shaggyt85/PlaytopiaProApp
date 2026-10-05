import { QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react-native";
import type { ReactNode } from "react";

import { useTeacherGroups } from "@/features/groups/hooks/useTeacherGroups";
import { createQueryClient } from "@/shared/config/queryClient";
import { serverNow } from "@/shared/utils/serverClock";

import { scheduleClass, scheduleResponse } from "../../../helpers/scheduleFactories";
import { signInTeacher } from "../../../helpers/scheduleMocks";

jest.mock("@/shared/utils/serverClock", () => ({ serverNow: jest.fn() }));

function setup(getClasses: jest.Mock) {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={createQueryClient()}>{children}</QueryClientProvider>
  );
  return renderHook(() => useTeacherGroups({ getClasses }), { wrapper });
}

describe("useTeacherGroups", () => {
  beforeEach(() => {
    signInTeacher();
    // El 5 de octubre a mediodía.
    jest.mocked(serverNow).mockReturnValue(new Date(2026, 9, 5, 12, 0).getTime());
  });

  it("pide la agenda de hoy y las 6 semanas siguientes, y saca sus grupos", async () => {
    const getClasses = jest
      .fn()
      .mockResolvedValue(
        scheduleResponse({
          classes: [scheduleClass({ id: 31, group_id: 11, class_date: "2026-10-06", attendance_opens_at: "2026-10-06T14:00:00Z" })],
        }),
      );
    const { result } = setup(getClasses);

    await waitFor(() => expect(result.current.groups).toHaveLength(1));
    expect(getClasses).toHaveBeenCalledWith("2026-10-05", "2026-11-15");
    expect(result.current.hasData).toBe(true);
  });

  it("mientras llega, sin datos ni grupos", () => {
    const { result } = setup(jest.fn().mockReturnValue(new Promise(() => undefined)));

    expect(result.current.hasData).toBe(false);
    expect(result.current.groups).toEqual([]);
  });
});
