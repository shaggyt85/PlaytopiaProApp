import { dayMark } from "@/features/schedule/utils/dayMark";

describe("dayMark", () => {
  it("el elegido manda, aunque sea hoy", () => {
    expect(dayMark("2026-11-18", "2026-11-18", "2026-11-18")).toBe("selected");
  });

  it("hoy sin elegir y los demás", () => {
    expect(dayMark("2026-11-18", "2026-11-20", "2026-11-18")).toBe("today");
    expect(dayMark("2026-11-19", "2026-11-20", "2026-11-18")).toBe("other");
  });

  it("sin día elegido", () => {
    expect(dayMark("2026-11-18", null, "2026-11-18")).toBe("today");
  });
});
