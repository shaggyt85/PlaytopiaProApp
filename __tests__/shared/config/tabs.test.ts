import { TABS } from "@/shared/config/tabs";
import { hasTranslation } from "@/shared/config/i18n";

describe("TABS", () => {
  it("son las 5 del menú, en orden, con rutas en inglés", () => {
    expect(TABS.map((tab) => tab.name)).toEqual(["index", "calendar", "groups", "network", "profile"]);
  });

  it("no repiten nombre ni ruta", () => {
    expect(new Set(TABS.map((tab) => tab.name)).size).toBe(TABS.length);
    expect(new Set(TABS.map((tab) => tab.href)).size).toBe(TABS.length);
  });

  it("cada una tiene su texto traducido y su icono", () => {
    for (const tab of TABS) {
      expect(hasTranslation(tab.label)).toBe(true);
      expect(tab.Icon).toBeDefined();
    }
  });
});
