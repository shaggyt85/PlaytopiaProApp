import { branchKey } from "@/shared/utils/branchKey";

describe("branchKey", () => {
  it("es la escuela y la sucursal: la misma sucursal en otra escuela es otra sede", () => {
    expect(branchKey({ db_id: 4, club_id: 7 })).toBe("4-7");
    expect(branchKey({ db_id: 5, club_id: 7 })).not.toBe(branchKey({ db_id: 4, club_id: 7 }));
  });
});
