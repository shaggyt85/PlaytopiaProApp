import { View, type ViewProps } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "@/shared/hooks/useTheme";

import { useStyles } from "./TabBar.styles";

/**
 * Barra de pestañas flotante: píldora de cristal sobre el contenido. Recibe
 * los botones como hijos y las props de `TabList` (por `asChild`).
 */
export function TabBar({ style, children, ...rest }: ViewProps) {
  const styles = useStyles();
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[styles.container, { paddingBottom: insets.bottom + theme.spacing.md }]}
      pointerEvents="box-none"
    >
      <View accessibilityRole="tablist" style={[styles.bar, style]} {...rest}>
        {children}
      </View>
    </View>
  );
}
