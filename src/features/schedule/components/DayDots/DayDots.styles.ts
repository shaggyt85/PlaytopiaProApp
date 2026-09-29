import { makeStyles } from "@/shared/hooks/makeStyles";
import { withAlpha } from "@/shared/utils/color";

/** Cada punto (`h-1 w-1`). */
const DOT = 4;

export const useStyles = makeStyles((theme) => ({
  // `mt-1 flex h-1 items-center gap-0.5`.
  row: { flexDirection: "row", height: DOT, gap: theme.spacing.xs / 2, marginTop: theme.spacing.xs },
  dot: { width: DOT, height: DOT, borderRadius: DOT / 2 },
  // Sobre el degradado, blancos al 80 % (`bg-primary-foreground/80`).
  onBrand: { backgroundColor: withAlpha(theme.colors.onPrimary, 0.8) },
}));
