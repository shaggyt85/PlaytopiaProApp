import type { Theme } from "@/shared/config/theme";
import { makeStyles } from "@/shared/hooks/makeStyles";
import type { AttendanceStatus } from "@/shared/schemas/schedule.schema";
import { withAlpha } from "@/shared/utils/color";

/** El círculo (`h-6 w-6`) y su icono (`h-3.5 w-3.5`). */
export const DOT_SIZE = 24;
export const DOT_ICON_SIZE = 14;

/**
 * El color de cada marca, el mismo que el ✓/✗ del detalle de una clase:
 * magenta si vino, coral si faltó.
 */
export const markColor = (theme: Theme, status: AttendanceStatus): string =>
  status === "present" ? theme.colors.primary : theme.accents.coral.color;

export const useStyles = makeStyles((theme) => ({
  // `flex flex-col items-center gap-1`.
  column: { flex: 1, alignItems: "center", gap: theme.spacing.xs },
  // `grid h-6 w-6 place-items-center rounded-full`, sobre su color al 15 %.
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  present: { backgroundColor: withAlpha(markColor(theme, "present"), 0.15) },
  absent: { backgroundColor: withAlpha(markColor(theme, "absent"), 0.15) },
}));
