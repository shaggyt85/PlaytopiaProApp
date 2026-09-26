import { makeStyles } from "@/shared/hooks/makeStyles";

export const useStyles = makeStyles((theme) => ({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: theme.spacing.sm + theme.spacing.xs,
    paddingHorizontal: theme.spacing.md + theme.spacing.xs,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.md,
  },
  texts: { flex: 1 },
  title: { marginTop: theme.spacing.xs },
  titlePlaceholder: { marginTop: theme.spacing.xs, height: theme.typography.hero.lineHeight },
  subtitle: { marginTop: theme.spacing.xs },
}));
