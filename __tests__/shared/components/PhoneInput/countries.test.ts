import {
  COUNTRIES,
  callingCodeOf,
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
