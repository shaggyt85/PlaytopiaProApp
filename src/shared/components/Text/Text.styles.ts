import { makeStyles } from "@/shared/hooks/makeStyles";

export const useStyles = makeStyles((theme) => ({
  title: theme.typography.title,
  subtitle: theme.typography.subtitle,
  body: theme.typography.body,
  caption: theme.typography.caption,
  button: theme.typography.button,
}));
