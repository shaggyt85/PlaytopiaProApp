import { makeStyles } from "@/shared/hooks/makeStyles";
import { withAlpha } from "@/shared/utils/color";

/** Tamaño del punto del chip (el `●` de Lovable). */
const DOT = 6;

export const useStyles = makeStyles((theme) => ({
  // `rounded-full px-2 py-0.5` de Lovable, con el color al 20 % de fondo.
  container: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs / 2,
    borderRadius: theme.radius.pill,
    backgroundColor: withAlpha(theme.colors.primary, 0.2),
  },
  dot: {
    width: DOT,
    height: DOT,
    borderRadius: DOT / 2,
    backgroundColor: theme.colors.primary,
  },
}));
