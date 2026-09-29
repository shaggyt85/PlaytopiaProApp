import { makeStyles } from "@/shared/hooks/makeStyles";

/** El punto junto a la hora (`h-2 w-2`). */
const DOT = 8;
/** El grosor de la línea (`h-[2px]`). */
const LINE = 2;
/** El brillo coral del punto y la línea (`shadow-[0_0_12px_var(--coral)]`). */
const coralGlow = (color: string) => `0 0 12px ${color}`;
/** La sombra de la pastilla (`shadow-lg` de Tailwind). */
const PILL_SHADOW = "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)";

export const useStyles = makeStyles((theme) => ({
  // `absolute left-0 right-0 flex items-center`, encima de las tarjetas.
  row: { position: "absolute", left: 0, right: 0, flexDirection: "row", alignItems: "center", zIndex: 1 },
  // `rounded-full bg-coral px-1.5 py-0.5`.
  pill: {
    paddingHorizontal: theme.spacing.xs + theme.spacing.xs / 2,
    paddingVertical: theme.spacing.xs / 2,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.accents.coral.color,
    boxShadow: PILL_SHADOW,
  },
  dot: {
    width: DOT,
    height: DOT,
    marginLeft: theme.spacing.xs,
    borderRadius: DOT / 2,
    backgroundColor: theme.accents.coral.color,
    boxShadow: coralGlow(theme.accents.coral.color),
  },
  line: {
    flex: 1,
    height: LINE,
    backgroundColor: theme.accents.coral.color,
    boxShadow: coralGlow(theme.accents.coral.color),
  },
}));
