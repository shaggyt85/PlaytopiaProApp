import { TABS, tabIndexForPath } from "@/shared/config/tabs";
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

describe("tabIndexForPath", () => {
  it("el inicio solo con / exacto", () => {
    expect(tabIndexForPath("/")).toBe(0);
  });

  it("cada pestaña con su ruta y sus subrutas", () => {
    expect(tabIndexForPath("/calendar")).toBe(1);
    expect(tabIndexForPath("/groups/12")).toBe(2);
    expect(tabIndexForPath("/profile")).toBe(4);
  });

  it("una ruta de ninguna pestaña da -1", () => {
    expect(tabIndexForPath("/sign-in")).toBe(-1);
    expect(tabIndexForPath("/calendario")).toBe(-1);
  });
});
