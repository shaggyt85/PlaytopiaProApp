import { makeStyles } from "@/shared/hooks/makeStyles";

export const useStyles = makeStyles((theme) => ({
  sports: { gap: theme.spacing.sm + theme.spacing.xs },
  sport: { gap: theme.spacing.xs + theme.spacing.xs / 2 },
  // `flex flex-wrap gap-2`.
  chips: { flexDirection: "row", flexWrap: "wrap", gap: theme.spacing.sm },
}));
