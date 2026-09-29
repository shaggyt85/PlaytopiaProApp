import { StyleSheet } from "react-native";

import { halo, type TextVariant, type ThemeColor } from "@/shared/config/theme";
import { makeStyles } from "@/shared/hooks/makeStyles";
import { withAlpha } from "@/shared/utils/color";

import type { DayMark } from "../../utils/dayMark";

/** El punto coral de hoy (`h-2 w-2`), con su brillo de 8. */
const TODAY_MARK = 8;
const TODAY_MARK_BLUR = 8;

/** Dónde va el día: la pastilla de la tira de la semana o la celda del mes. */
export type DayButtonVariant = "strip" | "cell";

/**
 * Lo que cambia con cada sitio, como en el prototipo: el número (`text-lg` en la
 * tira, `text-sm` en el mes) y si los demás días llevan aro (`ring-soft` en la
 * tira; en el mes, solo el fondo).
 */
export const DAY_BUTTON_VARIANTS = {
  strip: { number: "subtitle", otherRing: true },
  cell: { number: "rowTitle", otherRing: false },
} as const satisfies Record<DayButtonVariant, { number: TextVariant; otherRing: boolean }>;

/** El color del texto de cada aspecto: la letra del día y su número. */
export const DAY_MARK_COLORS = {
  selected: { label: "onPrimary", number: "onPrimary" },
  today: { label: "primary", number: "primary" },
  other: { label: "textSecondary", number: "text" },
} as const satisfies Record<DayMark, { label: ThemeColor; number: ThemeColor }>;

export const useStyles = makeStyles((theme) => ({
  base: { alignItems: "center", justifyContent: "center" },
  fill: StyleSheet.absoluteFill,
  // Elegido: `gradient-lime btn-3d-lime`.
  selected: theme.shadows.raised,
  // Hoy sin elegir: `bg-lime/15 ring-1 ring-lime/40`.
  today: {
    borderWidth: 1,
    borderColor: withAlpha(theme.colors.primary, 0.4),
    backgroundColor: withAlpha(theme.colors.primary, 0.15),
  },
  // Los demás: `bg-surface`, y en la tira además `ring-soft` (`otherRing`).
  other: { backgroundColor: theme.colors.surface },
  otherRing: { borderWidth: 1, borderColor: theme.colors.hairline },
  // `absolute -top-1 right-1 h-2 w-2 rounded-full bg-coral shadow-[0_0_8px_var(--coral)]`.
  todayMark: {
    position: "absolute",
    top: -theme.spacing.xs,
    right: theme.spacing.xs,
    width: TODAY_MARK,
    height: TODAY_MARK,
    borderRadius: TODAY_MARK / 2,
    backgroundColor: theme.accents.coral.color,
    ...halo(theme.accents.coral.color, TODAY_MARK_BLUR),
  },
}));
