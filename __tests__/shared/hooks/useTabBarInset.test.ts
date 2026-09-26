import { renderHook } from "@testing-library/react-native";

import { TAB_BAR_HEIGHT } from "@/shared/components/TabBar";
import { darkTheme } from "@/shared/config/theme";
import { useTabBarInset } from "@/shared/hooks/useTabBarInset";

describe("useTabBarInset", () => {
  it("deja el alto de la barra, su margen, la zona segura y un respiro", () => {
    const { result } = renderHook(() => useTabBarInset());

    // El mock de safe-area da 0 de zona segura inferior.
    expect(result.current).toBe(TAB_BAR_HEIGHT + darkTheme.spacing.md * 2);
  });
});
