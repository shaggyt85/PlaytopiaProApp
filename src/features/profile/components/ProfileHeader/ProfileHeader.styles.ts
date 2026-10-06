import { makeStyles } from "@/shared/hooks/makeStyles";

export const useStyles = makeStyles((theme) => ({
  // `flex flex-col items-center px-5 pb-6 pt-2 text-center`.
  container: {
    alignItems: "center",
    paddingHorizontal: theme.gutter,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.lg,
  },
  // `mt-3`.
  name: { marginTop: theme.spacing.sm + theme.spacing.xs },
}));
