import { darkTheme, type Theme } from "@/shared/config/theme";

/**
 * Tokens del tema activo.
 *
 * Por ahora siempre el oscuro: el tema claro todavía no está definido y la app
 * está fijada en `userInterfaceStyle: "dark"`. Cuando exista, aquí se elegirá
 * con `useColorScheme()` sin tocar ningún componente.
 */
export function useTheme(): Theme {
  return darkTheme;
}
