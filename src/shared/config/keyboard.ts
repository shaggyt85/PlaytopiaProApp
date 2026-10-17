import { Platform } from "react-native";

/**
 * Cómo se aparta lo que hay detrás del teclado: en iOS se le da relleno; en
 * Android lo hace el sistema (`adjustResize`), así que nada. Lo usan el acceso
 * y los paneles que suben desde abajo.
 */
export const KEYBOARD_AVOIDING_BEHAVIOR = Platform.OS === "ios" ? "padding" : undefined;
