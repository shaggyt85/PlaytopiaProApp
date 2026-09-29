import { seatsLabel } from "@/features/schedule/utils/seatsLabel";

describe("seatsLabel", () => {
  it("las plazas como el prototipo: «ocupadas/total»", () => {
    expect(seatsLabel({ current_participants: 2, max_participants: 4 })).toBe("2/4");
    expect(seatsLabel({ current_participants: 0, max_participants: 12 })).toBe("0/12");
  });
});
