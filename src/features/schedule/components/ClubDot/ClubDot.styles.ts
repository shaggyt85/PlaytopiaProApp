import { makeStyles } from "@/shared/hooks/makeStyles";
import { withAlpha } from "@/shared/utils/color";

/** Los tamaños del punto: el del emoji de 9 px de las pastillas y el de la tarjeta del club (`text-2xl`). */
export const CLUB_DOT_SIZES = { sm: 8, lg: 20 } as const;

export type ClubDotSize = keyof typeof CLUB_DOT_SIZES;

const circle = (size: number) => ({ width: size, height: size, borderRadius: size / 2 });

export const useStyles = makeStyles((theme) => ({
  sm: circle(CLUB_DOT_SIZES.sm),
  lg: circle(CLUB_DOT_SIZES.lg),
  // El borde oscuro del emoji del prototipo (🟢): el fondo al 60 %.
  ring: { borderWidth: 1, borderColor: withAlpha(theme.colors.background, 0.6) },
}));
