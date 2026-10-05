import { makeStyles } from "@/shared/hooks/makeStyles";

/** El punto del color del grupo (`h-3 w-3`). */
const DOT = 12;

export const useStyles = makeStyles((theme) => ({
  // `px-5 pt-4`.
  content: { paddingHorizontal: theme.gutter, paddingTop: theme.spacing.md, paddingBottom: theme.spacing.lg },
  // `mt-4 flex items-center gap-2`.
  titleRow: { flexDirection: "row", alignItems: "center", gap: theme.spacing.sm, marginTop: theme.spacing.md },
  dot: { width: DOT, height: DOT, borderRadius: DOT / 2 },
  title: { flex: 1 },
  // `mt-3`.
  place: { marginTop: theme.spacing.sm + theme.spacing.xs },
  // `mt-2`.
  members: { marginTop: theme.spacing.sm },
  // `mt-5 space-y-4`.
  sections: { gap: theme.spacing.md, marginTop: theme.spacing.md + theme.spacing.xs },
}));
