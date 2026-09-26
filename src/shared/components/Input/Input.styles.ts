import { makeStyles } from "@/shared/hooks/makeStyles";

export const useStyles = makeStyles((theme) => ({
  container: { gap: theme.spacing.xs },
  field: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: theme.touchTarget,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  fieldError: { borderColor: theme.colors.danger },
  input: {
    ...theme.typography.body,
    flex: 1,
    minHeight: theme.touchTarget,
    paddingHorizontal: theme.spacing.md,
    color: theme.colors.text,
  },
  accessory: { paddingRight: theme.spacing.sm },
}));
