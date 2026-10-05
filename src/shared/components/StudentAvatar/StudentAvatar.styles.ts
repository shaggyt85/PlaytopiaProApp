import { StyleSheet } from "react-native";

import type { TextVariant } from "@/shared/config/theme";
import { makeStyles } from "@/shared/hooks/makeStyles";

export type StudentAvatarSize = "sm" | "md" | "lg";

/**
 * Cada tamaño del prototipo: los círculos solapados de la próxima clase
 * (`h-9 w-9`), la lista del detalle (`CoachAvatar md`, `h-11 w-11`) y la
 * cabecera de la ficha de un alumno (`h-16 w-16`). Las iniciales, con su variante
 * de cada tamaño.
 */
export const AVATAR_SIZES = {
  sm: { side: 36, variant: "avatarInitials" },
  md: { side: 44, variant: "avatarInitialsMd" },
  lg: { side: 64, variant: "avatarInitialsLg" },
} as const satisfies Record<StudentAvatarSize, { side: number; variant: TextVariant }>;

/** El icono de una plaza libre (`h-3.5 w-3.5`). */
export const EMPTY_ICON_SIZE = 14;

/** El aro que separa un círculo del de al lado (`ring-2`). */
const RING = 2;
/** La marca de recuperación (`h-3.5 w-3.5`, `-bottom-0.5 -right-0.5`, `ring-1`). */
const BADGE = 14;
const BADGE_OFFSET = -2;

const circle = (side: number) =>
  ({
    width: side,
    height: side,
    borderRadius: side / 2,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  }) as const;

export const useStyles = makeStyles((theme) => ({
  sm: circle(AVATAR_SIZES.sm.side),
  md: circle(AVATAR_SIZES.md.side),
  lg: circle(AVATAR_SIZES.lg.side),
  // `ring-2 ring-surface`; el de quien recupera, `ring-gold`.
  ring: { borderWidth: RING, borderColor: theme.colors.surface },
  recoveryRing: { borderColor: theme.accents.gold.color },
  more: { backgroundColor: theme.colors.surfaceStrong },
  // Una plaza libre: `border border-dashed border-border bg-surface-2`.
  empty: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surfaceStrong,
  },
  fill: StyleSheet.absoluteFill,
  // Fuera del círculo, que recorta: si no, la marca se cortaría.
  badge: {
    position: "absolute",
    right: BADGE_OFFSET,
    bottom: BADGE_OFFSET,
    width: BADGE,
    height: BADGE,
    borderRadius: BADGE / 2,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: theme.colors.surface,
    backgroundColor: theme.accents.gold.color,
  },
}));
