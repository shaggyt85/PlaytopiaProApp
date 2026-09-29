import { joinParts } from "@/shared/utils/joinParts";

describe("joinParts", () => {
  it("une con « · »", () => {
    expect(joinParts(["16:00", "75 min", "Pista 1"])).toBe("16:00 · 75 min · Pista 1");
  });

  it("lo vacío, en blanco o ausente no deja separador", () => {
    expect(joinParts(["16:00", "", "  ", null, undefined, "Pista 1"])).toBe("16:00 · Pista 1");
    expect(joinParts(["", null])).toBe("");
  });

  it("con otro separador", () => {
    expect(joinParts(["Cantera Tarde", "16:00"], ", ")).toBe("Cantera Tarde, 16:00");
  });
});
