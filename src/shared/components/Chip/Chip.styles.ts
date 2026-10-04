import type { Theme } from "@/shared/config/theme";
import { makeStyles } from "@/shared/hooks/makeStyles";
import { withAlpha } from "@/shared/utils/color";

/** Tamaño del punto del chip (el `●` de Lovable). */
const DOT = 6;

/** El color de un chip: el de marca o el oro de las recuperaciones. */
export type ChipTone = "primary" | "gold";

/** El color del texto y del punto de cada tono; el fondo es ese color al 20 %. */
export const chipColor = (theme: Theme, tone: ChipTone): string =>
  tone === "gold" ? theme.accents.gold.color : theme.colors.primary;

export const useStyles = makeStyles((theme) => ({
  // `rounded-full px-2 py-0.5` de Lovable.
  container: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs / 2,
    borderRadius: theme.radius.pill,
  },
  primary: { backgroundColor: withAlpha(chipColor(theme, "primary"), 0.2) },
  gold: { backgroundColor: withAlpha(chipColor(theme, "gold"), 0.2) },
  dot: {
    width: DOT,
    height: DOT,
    borderRadius: DOT / 2,
  },
}));
