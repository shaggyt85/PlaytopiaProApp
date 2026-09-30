import { compareText } from "@/shared/utils/compareText";

describe("compareText", () => {
  it("ordena como el idioma: acentos y mayúsculas no cuentan, la «ñ» va tras la «n»", () => {
    expect(["Nuria", "Ñandú", "álvaro", "Beatriz"].sort(compareText)).toEqual([
      "álvaro",
      "Beatriz",
      "Nuria",
      "Ñandú",
    ]);
  });

  it("iguales salvo acentos o mayúsculas, empatan", () => {
    expect(compareText("Lucía", "lucia")).toBe(0);
  });
});
