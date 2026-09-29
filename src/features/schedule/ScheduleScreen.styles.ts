import { makeStyles } from "@/shared/hooks/makeStyles";

export const useStyles = makeStyles((theme) => ({
  // `px-5 pt-5`, como la tarjeta del prototipo.
  nextClass: { paddingHorizontal: theme.gutter, paddingTop: theme.spacing.md + theme.spacing.xs },
  signOut: { paddingHorizontal: theme.gutter, paddingTop: theme.spacing.lg },
}));
