import { makeStyles } from "@/shared/hooks/makeStyles";

export const useStyles = makeStyles((theme) => ({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: theme.spacing.sm + theme.spacing.xs,
    paddingHorizontal: theme.gutter,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.md,
  },
  // Con avatar a la izquierda: `flex items-center gap-3`, como la Agenda del prototipo.
  centered: { alignItems: "center" },
  texts: { flex: 1 },
  title: { marginTop: theme.spacing.xs },
  titlePlaceholder: { marginTop: theme.spacing.xs, height: theme.typography.hero.lineHeight },
  subtitle: { marginTop: theme.spacing.xs },
}));
