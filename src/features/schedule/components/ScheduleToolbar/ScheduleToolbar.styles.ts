import { makeStyles } from "@/shared/hooks/makeStyles";

export const useStyles = makeStyles((theme) => ({
  // `flex items-center gap-1.5`: las flechas, el texto y, a la derecha, el selector.
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs + theme.spacing.xs / 2,
    marginBottom: theme.spacing.sm,
  },
  label: { flex: 1, marginLeft: theme.spacing.xs },
}));
