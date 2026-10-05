import { changeLanguage } from "@/shared/config/i18n";
import { formatLevel } from "@/shared/utils/formatLevel";

describe("formatLevel", () => {
  it("con la coma del idioma y al menos un decimal", async () => {
    expect(formatLevel(2.5)).toBe("2,5");
    expect(formatLevel(3)).toBe("3,0");

    await changeLanguage("en");
    expect(formatLevel(2.5)).toBe("2.5");
  });

  it("sin perder el segundo decimal", () => {
    expect(formatLevel(2.75)).toBe("2,75");
  });
});
