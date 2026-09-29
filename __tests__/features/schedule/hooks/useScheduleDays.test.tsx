import { QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react-native";
import type { ReactNode } from "react";

import { useScheduleDays } from "@/features/schedule/hooks/useScheduleDays";
import { scheduleService } from "@/features/schedule/services/scheduleService";
import { createQueryClient } from "@/shared/config/queryClient";
import { darkTheme } from "@/shared/config/theme";
import { useSessionStore } from "@/shared/store/sessionStore";

import { scheduleClass, scheduleResponse } from "../../../helpers/scheduleFactories";

jest.mock("@/features/schedule/services/scheduleService", () => ({
  ...jest.requireActual("@/features/schedule/services/scheduleService"),
  scheduleService: { getClasses: jest.fn() },
}));

const wave = { label: "Wave", colors: darkTheme.clubColors[2] };
const reset = { label: "Reset", colors: darkTheme.clubColors[1] };
const clubOf = ({ club_id }: { club_id: number }) => (club_id === 7 ? wave : reset);

describe("useScheduleDays", () => {
  beforeEach(() => useSessionStore.getState().setAuthenticated({ userId: 42, dbId: 7 }));

  it("las clases de cada día y sus puntos, con el color de cada club", async () => {
    jest.mocked(scheduleService.getClasses).mockResolvedValue(
      scheduleResponse({
        classes: [
          scheduleClass({ id: 1, club_id: 7, class_date: "2026-11-18" }),
          scheduleClass({ id: 2, club_id: 8, class_date: "2026-11-18" }),
        ],
      }),
    );
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={createQueryClient()}>{children}</QueryClientProvider>
    );
    const { result } = renderHook(() => useScheduleDays("2026-11-18", clubOf), { wrapper });

    await waitFor(() => expect(result.current.hasData).toBe(true));
    expect(result.current.byDate.get("2026-11-18")).toHaveLength(2);
    expect(result.current.dots.get("2026-11-18")).toEqual([wave.colors.color, reset.colors.color]);
  });
});
