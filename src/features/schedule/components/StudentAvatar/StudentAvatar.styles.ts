import { StyleSheet } from "react-native";

import type { TextVariant } from "@/shared/config/theme";
import { makeStyles } from "@/shared/hooks/makeStyles";

export type StudentAvatarSize = "sm" | "md";

/** Cada tamaño del prototipo (`CoachAvatar`): `h-8 w-8 text-[10px]` y `h-11 w-11 text-xs`. */
export const AVATAR_SIZES = {
  sm: { side: 32, variant: "avatarInitials" },
  md: { side: 44, variant: "avatarInitialsMd" },
} as const satisfies Record<StudentAvatarSize, { side: number; variant: TextVariant }>;

/** El aro que separa un círculo del de al lado (`ring-2 ring-background`). */
const RING = 2;

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
  ring: { borderWidth: RING, borderColor: theme.colors.background },
  more: { backgroundColor: theme.colors.surfaceStrong },
  fill: StyleSheet.absoluteFill,
}));
