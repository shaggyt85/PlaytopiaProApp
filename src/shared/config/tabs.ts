import { IconLoCalendarDays, IconLoUser, IconLoUsers } from "@playtopia/icons/react-native";
import type { Href } from "expo-router";

import type { IconComponent } from "@/shared/config/icons";

import type { TranslationKey } from "@/shared/locales";

export interface TabItem {
  /** Nombre de la ruta dentro de `(app)/(tabs)`. */
  name: string;
  href: Href;
  /** Texto de la pestaña (y título de su pantalla mientras no tenga contenido). */
  label: TranslationKey;
  Icon: IconComponent;
}

/**
 * Las pestañas del menú inferior, en orden. Única lista: la usan la
 * navegación (`AppTabs`), la barra y el «Próximamente».
 *
 * Hoy y Agenda se unifican en el prototipo: la pantalla de inicio (`index`)
 * lleva el nombre y el icono de Agenda, y la pestaña `calendar` queda oculta
 * (su ruta y el texto `tabs.today` se conservan para cuando vuelva).
 *
 * Red tampoco sale en el menú del lanzamiento (prototipo final). Sin su
 * pestaña, `/network` no se abre (lleva a la Agenda), pero la pantalla «Red de
 * clubes», su ruta y el texto `tabs.network` se conservan: para que vuelva,
 * basta con devolverla aquí.
 */
export const TABS = [
  { name: "index", href: "/", label: "tabs.calendar", Icon: IconLoCalendarDays },
  { name: "groups", href: "/groups", label: "tabs.groups", Icon: IconLoUsers },
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
