import { makeStyles } from "@/shared/hooks/makeStyles";

const SIZE = 40;

export const useStyles = makeStyles((theme) => ({
  // Sin zIndex a propósito: el botón va como último hijo de su contenedor y se
  // pinta encima por orden. Un hijo con zIndex que se desmonta en una
  // transición tumba la app en Android (IndexOutOfBoundsException).
  circle: {
    position: "absolute",
    left: theme.spacing.lg,
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    borderWidth: 2,
    borderColor: theme.colors.disabled,
    alignItems: "center",
    justifyContent: "center",
  },
}));
