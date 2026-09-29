import { sedeKey } from "@/features/network/utils/sedeKey";

describe("sedeKey", () => {
  it("es la escuela y la sucursal: la misma sucursal en otra escuela es otra sede", () => {
    expect(sedeKey({ db_id: 4, club_id: 7 })).toBe("4-7");
    expect(sedeKey({ db_id: 5, club_id: 7 })).not.toBe(sedeKey({ db_id: 4, club_id: 7 }));
  });
});
