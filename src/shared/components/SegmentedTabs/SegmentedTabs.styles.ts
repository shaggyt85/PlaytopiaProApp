import { StyleSheet } from "react-native";

import type { TextVariant } from "@/shared/config/theme";
import { makeStyles } from "@/shared/hooks/makeStyles";
import { withAlpha } from "@/shared/utils/color";

/** Icono de cada pestaña (el `h-3.5 w-3.5` de Lovable). */
export const TAB_ICON_SIZE = 14;
/** Hueco entre el icono y el texto (el `gap-1.5` de Lovable). */
const ICON_GAP = 6;
/** La raya bajo la activa del tamaño `underline` (`h-[2px]`). */
const UNDERLINE_HEIGHT = 2;

/** Cómo es cada tamaño del selector. */
export type SegmentedTabsVariant = "full" | "underline";

/** El texto de cada tamaño. */
export const LABEL_VARIANT = {
  full: "mark",
  underline: "mark",
} as const satisfies Record<SegmentedTabsVariant, TextVariant>;

export const useStyles = makeStyles((theme) => {
  // «Red de clubes» (`full`): `flex gap-1 rounded-2xl bg-surface p-1 ring-soft`,
  // cada pestaña a partes iguales y a la altura del área táctil mínima; la activa
  // con el brillo de marca. El `ring-soft` se aproxima con un borde fino, como en
  // la tarjeta de sede.
  // La agenda (`underline`): `grid grid-cols-3 border-b border-border/40`, solo el
  // texto; la activa en blanco y con una raya del degradado de marca debajo
  // (`absolute inset-x-5 -bottom-px h-[2px] rounded-full gradient-brand`).
  return {
    full: {
      flexDirection: "row",
      gap: theme.spacing.xs,
      padding: theme.spacing.xs,
      borderRadius: theme.radius.xxl,
      ...theme.ringSoft,
      backgroundColor: theme.colors.surface,
    },
    underline: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderBottomColor: withAlpha(theme.colors.border, 0.4),
    },
    fullTab: { flex: 1, minHeight: theme.touchTarget, borderRadius: theme.radius.xl },
    underlineTab: { flex: 1, minHeight: theme.touchTarget, justifyContent: "center" },
    fullActive: theme.shadows.glow,
    underlineActive: {},
    fullFill: { ...StyleSheet.absoluteFill, borderRadius: theme.radius.xl },
    underlineFill: {
      position: "absolute",
      left: theme.gutter,
      right: theme.gutter,
      bottom: -1,
      height: UNDERLINE_HEIGHT,
      borderRadius: theme.radius.pill,
    },
    fullContent: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: ICON_GAP,
      paddingHorizontal: theme.spacing.md,
    },
    underlineContent: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: ICON_GAP,
    },
    label: { flexShrink: 1 },
  };
});
