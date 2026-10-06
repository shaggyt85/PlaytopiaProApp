import { makeStyles } from "@/shared/hooks/makeStyles";

export const useStyles = makeStyles((theme) => ({
  // `flex flex-wrap gap-1.5`.
  tags: { flexDirection: "row", flexWrap: "wrap", gap: theme.spacing.xs + theme.spacing.xs / 2 },
}));
