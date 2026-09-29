import { schoolLocation } from "@/features/network/utils/schoolLocation";

describe("schoolLocation", () => {
  it("une la ciudad y la dirección con un punto medio", () => {
    expect(schoolLocation({ city: "Madrid", address: "Calle Mayor 1" })).toBe("Madrid · Calle Mayor 1");
  });

  it("si falta uno de los dos, deja solo el otro, sin separador suelto", () => {
    expect(schoolLocation({ city: "Madrid", address: "" })).toBe("Madrid");
    expect(schoolLocation({ city: "  ", address: "Calle Mayor 1" })).toBe("Calle Mayor 1");
  });

  it("sin ninguno de los dos, queda vacío", () => {
    expect(schoolLocation({ city: "", address: " " })).toBe("");
  });
});
