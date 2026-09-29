import { occupancy } from "@/features/schedule/utils/occupancy";

describe("occupancy", () => {
  it("lo llena que está, de 0 a 1", () => {
    expect(occupancy({ current_participants: 3, max_participants: 4 })).toBe(0.75);
    expect(occupancy({ current_participants: 0, max_participants: 4 })).toBe(0);
  });

  it("con más alumnos que plazas, llena", () => {
    expect(occupancy({ current_participants: 5, max_participants: 4 })).toBe(1);
  });

  it("sin plazas, vacía", () => {
    expect(occupancy({ current_participants: 2, max_participants: 0 })).toBe(0);
  });
});
