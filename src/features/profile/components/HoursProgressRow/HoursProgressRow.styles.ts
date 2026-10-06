import { makeStyles } from "@/shared/hooks/makeStyles";

export const useStyles = makeStyles((theme) => ({
  // `space-y-1`: la línea y, debajo, la barra.
  row: { gap: theme.spacing.xs },
  // `flex items-center justify-between`.
  top: { flexDirection: "row", alignItems: "center", gap: theme.spacing.sm },
  label: { flex: 1 },
}));
