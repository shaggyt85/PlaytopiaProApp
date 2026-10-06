import { makeStyles } from "@/shared/hooks/makeStyles";

export const useStyles = makeStyles((theme) => ({
  // `py-2.5` de cada mes.
  row: { paddingVertical: theme.spacing.sm },
  // `space-y-1 pb-2 pl-1`.
  detail: { gap: theme.spacing.xs, paddingBottom: theme.spacing.sm, paddingLeft: theme.spacing.xs },
  // `flex items-center justify-between gap-3`.
  club: { flexDirection: "row", alignItems: "center", gap: theme.spacing.sm + theme.spacing.xs },
  clubName: { flex: 1 },
}));
