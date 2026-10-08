import { makeStyles } from "@/shared/hooks/makeStyles";

export const useStyles = makeStyles((theme) => ({
  flex: { flex: 1 },
  // Centrado, con el margen de las pantallas de acceso.
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: theme.gutter,
    gap: theme.spacing.md,
  },
  text: { gap: theme.spacing.sm },
}));
