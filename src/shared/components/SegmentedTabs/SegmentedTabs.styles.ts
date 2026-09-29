import { StyleSheet } from "react-native";

import type { TextVariant } from "@/shared/config/theme";
import { makeStyles } from "@/shared/hooks/makeStyles";

/** Icono de cada pestaña (el `h-3.5 w-3.5` de Lovable). */
export const TAB_ICON_SIZE = 14;
/** Hueco entre el icono y el texto (el `gap-1.5` de Lovable). */
const ICON_GAP = 6;

/** Alto de cada opción del tamaño `compact` (`py-1.5` con su texto de 11). */
export const COMPACT_TAB_HEIGHT = 28;

/** Cómo es cada tamaño del selector. */
export type SegmentedTabsVariant = "full" | "compact";

/** El texto de cada tamaño. */
export const LABEL_VARIANT = {
  full: "mark",
  compact: "segment",
} as const satisfies Record<SegmentedTabsVariant, TextVariant>;

export const useStyles = makeStyles((theme) => {
  // «Red de clubes» (`full`): `flex gap-1 rounded-2xl bg-surface p-1 ring-soft`,
  // cada pestaña a partes iguales y a la altura del área táctil mínima; la activa
  // con el brillo de marca.
  // La agenda (`compact`): `rounded-full bg-surface p-0.5 ring-soft`, cada opción
  // lo que mide su texto (`px-2.5 py-1.5`); la activa en relieve (`btn-3d-lime`).
  // El `ring-soft` se aproxima con un borde fino, como en la tarjeta de sede.
  const box = {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: theme.colors.hairline,
    backgroundColor: theme.colors.surface,
  } as const;
  return {
    full: { ...box, gap: theme.spacing.xs, padding: theme.spacing.xs, borderRadius: theme.radius.xxl },
    compact: { ...box, alignSelf: "flex-start", padding: theme.spacing.xs / 2, borderRadius: theme.radius.pill },
    fullTab: { flex: 1, minHeight: theme.touchTarget, borderRadius: theme.radius.xl },
    compactTab: { minHeight: COMPACT_TAB_HEIGHT, justifyContent: "center", borderRadius: theme.radius.pill },
    fullActive: theme.shadows.glow,
    compactActive: theme.shadows.raised,
    fullFill: { ...StyleSheet.absoluteFill, borderRadius: theme.radius.xl },
    compactFill: { ...StyleSheet.absoluteFill, borderRadius: theme.radius.pill },
    fullContent: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: ICON_GAP,
      paddingHorizontal: theme.spacing.md,
    },
    compactContent: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: ICON_GAP,
      paddingHorizontal: theme.spacing.sm + theme.spacing.xs / 2,
    },
    label: { flexShrink: 1 },
  };
});
