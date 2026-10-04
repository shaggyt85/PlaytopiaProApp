import { TABS, tabIndexForPath } from "@/shared/config/tabs";
import { hasTranslation } from "@/shared/config/i18n";

describe("TABS", () => {
  it("son las 3 del menú, en orden, con rutas en inglés: el inicio es Agenda", () => {
    expect(TABS.map((tab) => tab.name)).toEqual(["index", "groups", "profile"]);
    expect(TABS[0].label).toBe("tabs.calendar");
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
    expect(tabIndexForPath("/groups/12")).toBe(1);
    expect(tabIndexForPath("/profile")).toBe(2);
  });

  it("una ruta de ninguna pestaña da -1", () => {
    expect(tabIndexForPath("/sign-in")).toBe(-1);
    expect(tabIndexForPath("/calendario")).toBe(-1);
    // Agenda está oculta: su ruta existe, pero no es de ninguna pestaña.
    expect(tabIndexForPath("/calendar")).toBe(-1);
    // Red, igual: oculta en el menú del lanzamiento.
    expect(tabIndexForPath("/network")).toBe(-1);
  });
});
