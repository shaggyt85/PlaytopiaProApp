import { initialMode } from "@/features/profile/utils/availabilityModes";

describe("initialMode", () => {
  it("una semana vacía se abre «Por franja»", () => {
    expect(initialMode({})).toBe("bands");
  });

  it("una semana de franjas se abre «Por franja»", () => {
    expect(initialMode({ "1": [18, 19, 20, 21, 22, 23], "3": [18, 19, 20, 21, 22, 23] })).toBe("bands");
  });

  it("horas sueltas se abren «Por día», para que se vean marcadas", () => {
    expect(initialMode({ "1": [9, 10, 17] })).toBe("day");
  });
});
