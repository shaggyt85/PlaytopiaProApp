import { makeStyles } from "@/shared/hooks/makeStyles";

export const useStyles = makeStyles((theme) => ({
  base: {
    minHeight: theme.touchTarget,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.md,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  primary: { backgroundColor: theme.colors.primary },
  secondary: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  ghost: { backgroundColor: "transparent" },
  pressed: { opacity: 0.8 },
  disabled: { opacity: 0.5 },
}));
