import { makeStyles } from "@/shared/hooks/makeStyles";

/** La flecha (`h-4 w-4`), la de las filas del Mes. */
export const CHEVRON_SIZE = 16;

export const useStyles = makeStyles((theme) => ({
  // `rounded-2xl bg-surface p-3.5 ring-soft`, como las filas de los alumnos.
  card: {
    padding: theme.spacing.sm + theme.spacing.xs + theme.spacing.xs / 2,
    borderRadius: theme.radius.xxl,
    ...theme.ringSoft,
    backgroundColor: theme.colors.surface,
  },
  // `flex items-center justify-between gap-2`.
  top: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: theme.spacing.sm },
  title: { flexShrink: 1 },
  // El día: `rounded-full bg-surface-2 px-2.5 py-0.5`.
  date: {
    flexShrink: 0,
    paddingHorizontal: theme.spacing.sm + theme.spacing.xs / 2,
    paddingVertical: theme.spacing.xs / 2,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.surfaceStrong,
  },
  // `mt-0.5`.
  attendance: { marginTop: theme.spacing.xs / 2 },
  // `mt-2.5 flex items-center gap-2.5`, con la flecha al final (`ml-auto`).
  students: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm + theme.spacing.xs / 2,
    marginTop: theme.spacing.sm + theme.spacing.xs / 2,
  },
  count: { flex: 1 },
}));
