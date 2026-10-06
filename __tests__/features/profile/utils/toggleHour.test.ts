import { toggleHour } from "@/features/profile/utils/toggleHour";

describe("toggleHour", () => {
  it("marca una hora en su sitio, ordenada", () => {
    expect(toggleHour({ "1": [9, 11] }, "1", 10)).toEqual({ "1": [9, 10, 11] });
  });

  it("marca la primera hora de un día que no estaba", () => {
    expect(toggleHour({ "1": [9] }, "2", 7)).toEqual({ "1": [9], "2": [7] });
  });

  it("quitar la última hora de un día lo saca de la semana", () => {
    expect(toggleHour({ "1": [9], "2": [7] }, "2", 7)).toEqual({ "1": [9] });
  });

  it("no toca la semana de entrada", () => {
    const week = { "1": [9] };
    toggleHour(week, "1", 10);
    expect(week).toEqual({ "1": [9] });
  });
});
