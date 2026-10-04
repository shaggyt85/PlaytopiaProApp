import { makeStyles } from "@/shared/hooks/makeStyles";

export const useStyles = makeStyles((theme) => ({
  // `rounded-3xl bg-card p-4 ring-soft`.
  card: {
    gap: theme.spacing.xs + theme.spacing.xs / 2,
    padding: theme.spacing.md,
    borderRadius: theme.radius.xxxl,
    ...theme.ringSoft,
    backgroundColor: theme.colors.card,
  },
  // `grid grid-cols-7 gap-1.5`: una fila por semana.
  week: { flexDirection: "row", gap: theme.spacing.xs + theme.spacing.xs / 2 },
  slot: { flex: 1 },
  // `aspect-square rounded-2xl`; el aspecto (elegido, hoy, otro) lo pone `DayButton`.
  cell: { aspectRatio: 1, borderRadius: theme.radius.xxl },
}));
