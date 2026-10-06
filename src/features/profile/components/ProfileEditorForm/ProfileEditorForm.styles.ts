import { makeStyles } from "@/shared/hooks/makeStyles";

export const useStyles = makeStyles((theme) => ({
  // `space-y-3` entre campos y `mt-6` hasta «Guardar».
  form: { gap: theme.spacing.sm + theme.spacing.xs },
  save: { marginTop: theme.spacing.md },
}));
