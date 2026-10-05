import { makeStyles } from "@/shared/hooks/makeStyles";

/** El icono del nivel (`h-4 w-4`). */
export const LEVEL_ICON_SIZE = 16;

export const useStyles = makeStyles((theme) => ({
  // `rounded-lg border bg-surface-2/60 ring-soft`.
  card: {
    overflow: "hidden",
    borderRadius: theme.radius.lg,
    ...theme.ringSoft,
    backgroundColor: theme.colors.surface,
  },
  // `px-4 pt-4`, y `mt-2` hasta la primera fila.
  label: { paddingHorizontal: theme.spacing.md, paddingTop: theme.spacing.md, paddingBottom: theme.spacing.sm },
  empty: { padding: theme.spacing.md, paddingTop: 0 },
  // `flex items-center gap-3 px-4 py-3`, con la línea fina de arriba.
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm + theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm + theme.spacing.xs,
    borderTopWidth: 1,
    borderTopColor: theme.colors.hairline,
  },
  name: { flex: 1 },
  // `flex items-center gap-1.5`.
  level: { flexDirection: "row", alignItems: "center", gap: theme.spacing.xs + theme.spacing.xs / 2 },
}));
