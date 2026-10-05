import { makeStyles } from "@/shared/hooks/makeStyles";

export const useStyles = makeStyles((theme) => ({
  // `space-y-3`.
  content: { gap: theme.spacing.sm + theme.spacing.xs },
}));
