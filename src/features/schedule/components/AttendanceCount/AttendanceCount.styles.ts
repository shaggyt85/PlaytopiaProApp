import { makeStyles } from "@/shared/hooks/makeStyles";

/** La ✓ (`h-3 w-3`). */
export const CHECK_SIZE = 12;

export const useStyles = makeStyles((theme) => ({
  // `flex items-center gap-1`.
  done: { flexDirection: "row", alignItems: "center", gap: theme.spacing.xs },
}));
