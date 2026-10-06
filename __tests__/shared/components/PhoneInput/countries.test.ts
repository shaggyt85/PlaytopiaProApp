import {
  COUNTRIES,
  callingCodeOf,
  joinPhone,
  splitPhone,
  countryByCode,
  flagEmoji,
} from "@/shared/components/PhoneInput/countries";
import { LOCALES } from "@/shared/locales";

describe("catálogo de países", () => {
  it("cada país tiene prefijo y nombre en los 6 idiomas", () => {
    for (const country of COUNTRIES) {
      expect(country.callingCode.length).toBeGreaterThan(0);
      for (const locale of LOCALES) expect(country.names[locale]).toBeTruthy();
    }
  });

  it("no repite códigos", () => {
    const codes = COUNTRIES.map((c) => c.cca2);
    expect(new Set(codes).size).toBe(codes.length);
  });

  it("devuelve el prefijo principal, y vacío si el país no existe", () => {
    expect(callingCodeOf("ES")).toBe("34");
    expect(callingCodeOf("VA")).toBe("3906698");
    expect(callingCodeOf("XX")).toBe("");
    expect(countryByCode("XX")).toBeUndefined();
  });

  it("la bandera sale del código ISO", () => {
    expect(flagEmoji("ES")).toBe("🇪🇸");
    expect(flagEmoji("ar")).toBe("🇦🇷");
  });
});

describe("joinPhone", () => {
  it("el prefijo del país y el número, como lo guarda Core", () => {
    expect(joinPhone("ES", "600123456")).toBe("+34600123456");
  });
});

describe("splitPhone", () => {
  it("lo contrario de joinPhone: el país por su prefijo y el número", () => {
    expect(splitPhone("+34600123456")).toEqual({ country: "ES", number: "600123456" });
    expect(splitPhone(joinPhone("AR", "1155556666"))).toEqual({ country: "AR", number: "1155556666" });
  });

  it("gana el prefijo más largo que encaja", () => {
    expect(splitPhone("+3906698123456")).toEqual({ country: "VA", number: "123456" });
  });

  it("sin «+» no hay prefijo que leer: el país por defecto y los dígitos", () => {
    expect(splitPhone("600 123 456")).toEqual({ country: "ES", number: "600123456" });
  });

  it("un prefijo que no existe deja los dígitos con el país por defecto", () => {
    expect(splitPhone("+999123", "PT")).toEqual({ country: "PT", number: "999123" });
  });
});
