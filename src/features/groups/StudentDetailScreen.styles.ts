import { makeStyles } from "@/shared/hooks/makeStyles";

export const useStyles = makeStyles((theme) => ({
  // `px-5 pt-4`.
  content: { paddingHorizontal: theme.gutter, paddingTop: theme.spacing.md, paddingBottom: theme.spacing.lg },
  // `mt-6 space-y-4`.
  sections: { gap: theme.spacing.md, marginTop: theme.spacing.lg },
}));
