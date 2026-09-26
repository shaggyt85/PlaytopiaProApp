import { makeStyles } from "@/shared/hooks/makeStyles";

export const useStyles = makeStyles((theme) => ({
  // flexGrow: el contenido corto (p. ej. «Próximamente») puede centrarse.
  content: { flexGrow: 1, paddingTop: theme.spacing.md + theme.spacing.xs },
}));
