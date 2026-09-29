import { makeStyles } from "@/shared/hooks/makeStyles";
import { withAlpha } from "@/shared/utils/color";

/** El tamaño del punto (el emoji de 9 px del prototipo). */
const DOT = 8;

export const useStyles = makeStyles((theme) => ({
  dot: { width: DOT, height: DOT, borderRadius: DOT / 2 },
  // El borde oscuro del emoji del prototipo (🟢): el fondo al 60 %.
  ring: { borderWidth: 1, borderColor: withAlpha(theme.colors.background, 0.6) },
}));
