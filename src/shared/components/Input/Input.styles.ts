import { makeStyles } from "@/shared/hooks/makeStyles";

export const useStyles = makeStyles((theme) => ({
  container: { gap: theme.spacing.xs },
  input: {
    ...theme.typography.body,
    minHeight: theme.touchTarget,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    color: theme.colors.text,
  },
  inputError: { borderColor: theme.colors.danger },
}));
