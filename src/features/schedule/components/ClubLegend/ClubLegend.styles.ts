import { makeStyles } from "@/shared/hooks/makeStyles";

export const useStyles = makeStyles((theme) => ({
  // `mb-2 flex flex-wrap items-center gap-1.5`: en varias líneas si no caben.
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: theme.spacing.xs + theme.spacing.xs / 2,
    marginBottom: theme.spacing.sm,
  },
}));
