import { QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react-native";
import type { ReactNode } from "react";

import { useScheduleDays } from "@/features/schedule/hooks/useScheduleDays";
import { createQueryClient } from "@/shared/config/queryClient";
import { darkTheme } from "@/shared/config/theme";
import { scheduleService } from "@/shared/services/scheduleService";

import { scheduleClass, scheduleResponse } from "../../../helpers/scheduleFactories";
import { signInTeacher } from "../../../helpers/scheduleMocks";

jest.mock("@/shared/services/scheduleService", () =>
  require("../../../helpers/scheduleMocks").scheduleServiceModule(),
);


describe("useScheduleDays", () => {
  beforeEach(signInTeacher);

  it("las clases de cada día y sus puntos, uno por clase con su color en el día", async () => {
    jest.mocked(scheduleService.getClasses).mockResolvedValue(
      scheduleResponse({
        classes: [
          scheduleClass({ id: 1, class_date: "2026-11-18", class_time: "09:00:00" }),
          scheduleClass({ id: 2, class_date: "2026-11-18", class_time: "18:00:00" }),
        ],
      }),
    );
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={createQueryClient()}>{children}</QueryClientProvider>
    );
    const { result } = renderHook(() => useScheduleDays("2026-11-18"), { wrapper });

    await waitFor(() => expect(result.current.hasData).toBe(true));
    expect(result.current.byDate.get("2026-11-18")).toHaveLength(2);
    expect(result.current.dots.get("2026-11-18")).toEqual([darkTheme.clubColors[0].color, darkTheme.clubColors[1].color]);
  });
});
