import { makeStyles } from "@/shared/hooks/makeStyles";

/** Alto de cada día de la cuadrícula (`h-9`): más bajo que ancho, la cuadrícula ocupa menos. */
const CELL_HEIGHT = 36;

export const useStyles = makeStyles((theme) => ({
  // `rounded-3xl bg-card p-3 ring-soft`.
  card: {
    gap: theme.spacing.xs,
    padding: theme.spacing.sm + theme.spacing.xs,
    borderRadius: theme.radius.xxxl,
    ...theme.ringSoft,
    backgroundColor: theme.colors.card,
  },
  // `grid grid-cols-7 gap-1`: una fila por semana.
  week: { flexDirection: "row", gap: theme.spacing.xs },
  slot: { flex: 1 },
  // `h-9 rounded-xl`; el aspecto (elegido, hoy, otro) lo pone `DayButton`.
  cell: { height: CELL_HEIGHT, borderRadius: theme.radius.xl },
}));
