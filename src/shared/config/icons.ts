import { IconLoActivity, IconLoCheck, IconLoX } from "@playtopia/icons/react-native";
import type { ComponentType } from "react";

import type { AttendanceStatus } from "@/shared/schemas/schedule.schema";

/**
 * Un icono de `@playtopia/icons/react-native`, tal como lo usa la app: tamaño,
 * color y, en los de un solo grosor, `strokeWidth`. La librería no exporta un
 * tipo común (cada icono tiene su interfaz): este es el único sitio.
 */
export type IconComponent = ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;

/**
 * El icono del nivel, en todos los sitios que lo enseñan. Provisional:
 * `IconLoActivity` hasta que `@playtopia/icons` publique `IconLoBarChart2`
 * (1.10.0); entonces se cambia aquí y nada más.
 */
export const LEVEL_ICON: IconComponent = IconLoActivity;

/** El icono de cada marca de asistencia: ✓ vino, ✗ faltó. */
export const ATTENDANCE_ICON = {
  present: IconLoCheck,
  absent: IconLoX,
} as const satisfies Record<AttendanceStatus, IconComponent>;
