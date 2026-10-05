import { panel } from "@/shared/config/theme";
import { makeStyles } from "@/shared/hooks/makeStyles";

export const useStyles = makeStyles((theme) => ({
  // `rounded-lg border bg-surface-2/60 ring-soft`.
  card: { ...panel(theme), overflow: "hidden" },
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
}));
