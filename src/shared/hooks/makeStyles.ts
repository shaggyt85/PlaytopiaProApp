import { useMemo } from "react";
import { StyleSheet } from "react-native";

import type { Theme } from "@/shared/config/theme";

import { useTheme } from "./useTheme";

/**
 * Estilos que dependen del tema, escritos una sola vez:
 *
 *   // Button.styles.ts
 *   export const useStyles = makeStyles((theme) => ({
 *     container: { backgroundColor: theme.colors.primary },
 *   }));
 *
 *   // Button.tsx
 *   const styles = useStyles();
 */
export function makeStyles<T extends StyleSheet.NamedStyles<T>>(
  factory: (theme: Theme) => T,
): () => T {
  return function useStyles() {
    const theme = useTheme();
    return useMemo(() => StyleSheet.create(factory(theme)), [theme]);
  };
}
