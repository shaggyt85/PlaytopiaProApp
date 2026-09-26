import { useSafeAreaInsets } from "react-native-safe-area-context";

import { TAB_BAR_HEIGHT } from "@/shared/components/TabBar";
import { useTheme } from "@/shared/hooks/useTheme";

/**
 * Hueco que cada pantalla del menú deja abajo para que la barra flotante no
 * tape su contenido: la barra, su margen inferior, la zona segura y un respiro.
 */
export function useTabBarInset(): number {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  return TAB_BAR_HEIGHT + insets.bottom + theme.spacing.md * 2;
}
