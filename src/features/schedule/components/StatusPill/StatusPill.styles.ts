import { IconLoCheck } from "@playtopia/icons/react-native";
import { StyleSheet } from "react-native";

import type { IconComponent } from "@/shared/config/icons";
import type { TextVariant, ThemeColor } from "@/shared/config/theme";
import type { TranslationKey } from "@/shared/locales";
import { makeStyles } from "@/shared/hooks/makeStyles";
import { withAlpha } from "@/shared/utils/color";

import type { ClassStatus } from "../../utils/classTiming";

/** El estado de una clase que se marca con una pastilla. */
export type StatusPillVariant = "live" | "next" | "done";

/** La marca de cada estado de una clase: «EN VIVO», «PRÓXIMA», «COMPLETADA» o ninguna (Día y Semana). */
export const STATUS_PILL_OF = {
  live: "live",
  next: "next",
  past: "done",
  upcoming: null,
} as const satisfies Record<ClassStatus, StatusPillVariant | null>;

/** El icono de delante (`h-3 w-3`). */
export const PILL_ICON_SIZE = 12;

/**
 * El contenido de cada pastilla: su texto, su variante, su color, si va sobre el
 * degradado de marca y el icono de delante.
 */
export const STATUS_PILL = {
  live: { label: "schedule.week.live", variant: "statusBadge", color: "onPrimary", brand: false, Icon: undefined },
  next: { label: "schedule.day.next", variant: "badge", color: "onPrimary", brand: true, Icon: undefined },
  done: { label: "schedule.day.done", variant: "badge", color: "primary", brand: false, Icon: IconLoCheck },
} as const satisfies Record<
  StatusPillVariant,
  { label: TranslationKey; variant: TextVariant; color: ThemeColor; brand: boolean; Icon: IconComponent | undefined }
>;

export const useStyles = makeStyles((theme) => ({
  // `rounded-full px-1.5 py-0.5`, sin encogerse junto a un título largo.
  pill: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 0,
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.xs + theme.spacing.xs / 2,
    paddingVertical: theme.spacing.xs / 2,
    borderRadius: theme.radius.pill,
    overflow: "hidden",
  },
  // «EN VIVO»: `bg-coral`.
  live: { backgroundColor: theme.accents.coral.color },
  // «PRÓXIMA»: `gradient-brand` (lo pinta el componente, con `BrandGradient`).
  next: {},
  // «COMPLETADA»: `bg-lime/15 ring-1 ring-lime/40` (el lime del prototipo es el magenta de marca).
  done: {
    backgroundColor: withAlpha(theme.colors.primary, 0.15),
    borderWidth: 1,
    borderColor: withAlpha(theme.colors.primary, 0.4),
  },
  fill: StyleSheet.absoluteFill,
}));
