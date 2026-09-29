import { NETWORK_TABS } from "@/features/network/utils/networkTabs";
import { hasTranslation } from "@/shared/config/i18n";

describe("NETWORK_TABS", () => {
  it("abre en «Mis clubes» y luego «Cerca de mí»", () => {
    expect(NETWORK_TABS.map(({ key }) => key)).toEqual(["myClubs", "nearMe"]);
  });

  it("cada pestaña tiene texto y un icono", () => {
    for (const { label, Icon } of NETWORK_TABS) {
      expect(hasTranslation(label)).toBe(true);
      expect(Icon).toBeDefined();
    }
  });
});
