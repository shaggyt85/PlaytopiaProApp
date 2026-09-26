import { normalizeEmail, sameEmail } from "@/features/auth/utils/email";

describe("email", () => {
  it("normaliza sin espacios y en minúsculas", () => {
    expect(normalizeEmail("  Ana@Club.COM ")).toBe("ana@club.com");
  });

  it("compara emails escritos de distinta forma", () => {
    expect(sameEmail("Ana@club.com", " ana@CLUB.com")).toBe(true);
    expect(sameEmail("ana@club.com", "otro@club.com")).toBe(false);
  });

  it("un email vacío o ausente nunca coincide", () => {
    expect(sameEmail("", "")).toBe(false);
    expect(sameEmail(null, "ana@club.com")).toBe(false);
    expect(sameEmail("ana@club.com", undefined)).toBe(false);
  });
});
