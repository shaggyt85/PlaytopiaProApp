import { renderHook } from "@testing-library/react-native";

import { DEFAULT_SCHEDULE_HOURS, useScheduleHours } from "@/features/schedule/hooks/useScheduleHours";

describe("useScheduleHours", () => {
  it("de momento, la franja del prototipo: de 08:00 a 21:00", () => {
    const { result } = renderHook(() => useScheduleHours());
    expect(result.current).toEqual({ start: 8, end: 21 });
    expect(result.current).toBe(DEFAULT_SCHEDULE_HOURS);
  });
});
