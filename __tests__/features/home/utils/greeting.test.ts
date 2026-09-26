import { greetingFor } from "@/features/home/utils/greeting";

describe("greetingFor", () => {
  it.each([
    [6, "morning"],
    [11, "morning"],
    [12, "afternoon"],
    [19, "afternoon"],
    [20, "evening"],
    [23, "evening"],
    [0, "evening"],
    [5, "evening"],
  ] as const)("a las %i: %s", (hour, period) => {
    expect(greetingFor(hour)).toBe(period);
  });
});
