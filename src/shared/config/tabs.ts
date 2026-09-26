import {
  IconLoCalendarDays,
  IconLoHome,
  IconLoNetwork,
  IconLoUser,
  IconLoUsers,
} from "@playtopia/icons/react-native";
import type { Href } from "expo-router";
import type { ComponentType } from "react";

import type { TranslationKey } from "@/shared/locales";

export interface TabItem {
  /** Nombre de la ruta dentro de `(app)/(tabs)`. */
  name: string;
  href: Href;
  /** Texto de la pestaña (y título de su pantalla mientras no tenga contenido). */
  label: TranslationKey;
  Icon: ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
}

/**
 * Las pestañas del menú inferior, en orden. Única lista: la usan la
 * navegación (`AppTabs`), la barra y el «Próximamente».
 */
export const TABS = [
  { name: "index", href: "/", label: "tabs.today", Icon: IconLoHome },
  { name: "calendar", href: "/calendar", label: "tabs.calendar", Icon: IconLoCalendarDays },
  { name: "groups", href: "/groups", label: "tabs.groups", Icon: IconLoUsers },
  { name: "network", href: "/network", label: "tabs.network", Icon: IconLoNetwork },
  { name: "profile", href: "/profile", label: "tabs.profile", Icon: IconLoUser },
] as const satisfies readonly TabItem[];

/**
 * Índice de la pestaña de una ruta: la del inicio solo con "/" exacto; las
 * demás también con sus subrutas. -1 si la ruta no es de ninguna.
 */
export function tabIndexForPath(pathname: string): number {
  return TABS.findIndex(({ href }) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`),
  );
}
