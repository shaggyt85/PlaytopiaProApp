import { makeStyles } from "@/shared/hooks/makeStyles";

export const useStyles = makeStyles((theme) => ({
  input: { ...theme.typography.input, color: theme.colors.text },
}));
