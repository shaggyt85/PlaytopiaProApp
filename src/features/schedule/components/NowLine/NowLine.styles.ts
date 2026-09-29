import { halo } from "@/shared/config/theme";
import { makeStyles } from "@/shared/hooks/makeStyles";

/** El punto junto a la hora (`h-2 w-2`). */
const DOT = 8;
/** El grosor de la línea (`h-[2px]`). */
const LINE = 2;

export const useStyles = makeStyles((theme) => ({
  // `absolute left-0 right-0 flex items-center`. Queda encima de las tarjetas
  // por ser el último hijo de la tira, sin `zIndex` (se desmonta si no es hoy).
  row: { position: "absolute", left: 0, right: 0, flexDirection: "row", alignItems: "center" },
  // `rounded-full bg-coral px-1.5 py-0.5`.
  pill: {
    paddingHorizontal: theme.spacing.xs + theme.spacing.xs / 2,
    paddingVertical: theme.spacing.xs / 2,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.accents.coral.color,
    ...theme.shadows.lifted,
  },
  dot: {
    width: DOT,
    height: DOT,
    marginLeft: theme.spacing.xs,
    borderRadius: DOT / 2,
    backgroundColor: theme.accents.coral.color,
    ...halo(theme.accents.coral.color),
  },
  line: {
    flex: 1,
    height: LINE,
    backgroundColor: theme.accents.coral.color,
    ...halo(theme.accents.coral.color),
  },
}));
