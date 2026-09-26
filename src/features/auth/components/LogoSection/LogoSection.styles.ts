import { makeStyles } from "@/shared/hooks/makeStyles";

const LOGO_SIZE = 100;

export const useStyles = makeStyles((theme) => ({
  container: {
    alignItems: "center",
    marginBottom: theme.spacing.xl,
    ...theme.shadows.glow,
  },
  logo: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    marginBottom: theme.spacing.sm + theme.spacing.xs,
  },
  title: {
    ...theme.shadows.textGlow,
    marginBottom: theme.spacing.xs,
  },
  version: { opacity: 0.5 },
}));
