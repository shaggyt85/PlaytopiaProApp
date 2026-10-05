import { IconLoCheck, IconLoX } from "@playtopia/icons/react-native";
import { StyleSheet } from "react-native";

import type { IconComponent } from "@/shared/config/icons";
import { makeStyles } from "@/shared/hooks/makeStyles";

import type { AttendanceStatus } from "../../schemas/schedule.schema";

/** El cuadrado (`h-9 w-9`) y su icono (`h-4 w-4`). */
export const TOGGLE_SIZE = 36;
export const TOGGLE_ICON_SIZE = 16;

/** El icono de cada marca: ✓ presente, ✗ ausente. */
export const TOGGLE_ICON = {
  present: IconLoCheck,
  absent: IconLoX,
} as const satisfies Record<AttendanceStatus, IconComponent>;

export const useStyles = makeStyles((theme) => ({
  // `grid h-9 w-9 place-items-center rounded-xl`; sin elegir, `bg-surface-2`.
  box: {
    width: TOGGLE_SIZE,
    height: TOGGLE_SIZE,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.surfaceStrong,
  },
  // Elegido: `gradient-lime btn-3d-lime` (el lime del prototipo es el magenta de marca).
  present: theme.shadows.raised,
  // Elegido: `gradient-coral btn-3d-coral`.
  absent: theme.shadows.raisedCoral,
  fill: { ...StyleSheet.absoluteFill, borderRadius: theme.radius.sm },
  pressed: { transform: [{ scale: 0.95 }] },
  // Pasado el plazo: la marca a la vista, atenuada (sin su brillo en relieve).
  locked: { opacity: 0.5, boxShadow: "none" },
}));
