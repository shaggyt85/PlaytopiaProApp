import { makeStyles } from "@/shared/hooks/makeStyles";

export const useStyles = makeStyles((theme) => ({
  // `space-y-3 px-5 pb-8`.
  content: { gap: theme.spacing.sm + theme.spacing.xs, paddingHorizontal: theme.gutter, paddingBottom: theme.spacing.xl },
}));
