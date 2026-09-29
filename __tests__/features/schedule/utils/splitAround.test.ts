import { splitAround } from "@/features/schedule/utils/splitAround";
import { changeLanguage, t } from "@/shared/config/i18n";

describe("splitAround", () => {
  it("el texto antes y después del dato, para pintarlo aparte", () => {
    expect(splitAround((mark) => t("schedule.week.filteredBy", { day: mark }))).toEqual(["Filtrado por ", ""]);
  });

  it("cada idioma pone el dato donde le toca", async () => {
    await changeLanguage("de");

    expect(splitAround((mark) => t("schedule.week.filteredBy", { day: mark }))).toEqual(["Gefiltert nach ", ""]);
  });

  it("con texto detrás del dato", () => {
    expect(splitAround((mark) => `Antes ${mark} después`)).toEqual(["Antes ", " después"]);
  });
});
