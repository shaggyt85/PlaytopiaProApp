import type { ComponentType } from "react";

/**
 * Un icono de `@playtopia/icons/react-native`, tal como lo usa la app: tamaño,
 * color y, en los de un solo grosor, `strokeWidth`. La librería no exporta un
 * tipo común (cada icono tiene su interfaz): este es el único sitio.
 */
export type IconComponent = ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
