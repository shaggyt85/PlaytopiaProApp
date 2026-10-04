import { makeStyles } from "@/shared/hooks/makeStyles";

export const useStyles = makeStyles((theme) => ({
  // Las cifras del día: `grid grid-cols-3 px-4 py-3`.
  stats: { flexDirection: "row", paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.sm + theme.spacing.xs },
  // `px-5 pt-5`, como la tarjeta del prototipo.
  nextClass: { paddingHorizontal: theme.gutter, paddingTop: theme.spacing.md + theme.spacing.xs },
  signOut: { paddingHorizontal: theme.gutter, paddingTop: theme.spacing.lg },
}));
