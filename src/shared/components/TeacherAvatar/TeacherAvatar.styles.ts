import { StyleSheet } from "react-native";

import { halo } from "@/shared/config/theme";
import { makeStyles } from "@/shared/hooks/makeStyles";

/**
 * Los tamaños del círculo, con el aro de marca que deja ver y su brillo:
 * - `md`: la cabecera de la Agenda (`h-12 w-12 p-[2px] shadow-[0_0_20px_-6px]`).
 * - `xl`: la cabecera de Perfil (`h-24 w-24 p-[3px] shadow-[0_0_28px_-8px]`).
 */
export const AVATAR_SIZES = {
  md: { side: 48, ring: 2, blur: 20, spread: -6 },
  xl: { side: 96, ring: 3, blur: 28, spread: -8 },
} as const;
export type TeacherAvatarSize = keyof typeof AVATAR_SIZES;

/** El aro (con el brillo), el degradado y la foto de un tamaño. */
const sized = (size: TeacherAvatarSize, primary: string, card: string) => {
  const { side, ring, blur, spread } = AVATAR_SIZES[size];
  return {
    // Sin `overflow: hidden` aquí: recortaría el brillo. El degradado se redondea solo.
    ring: { width: side, height: side, borderRadius: side / 2, padding: ring, ...halo(primary, blur, spread) },
    gradient: { ...StyleSheet.absoluteFill, borderRadius: side / 2 },
    // Si la foto no carga, queda el fondo de la tarjeta (`bg-card`).
    photo: { flex: 1, borderRadius: side / 2, overflow: "hidden", backgroundColor: card },
  } as const;
};

export const useStyles = makeStyles((theme) => {
  const md = sized("md", theme.colors.primary, theme.colors.card);
  const xl = sized("xl", theme.colors.primary, theme.colors.card);
  return {
    ringMd: md.ring,
    gradientMd: md.gradient,
    photoMd: md.photo,
    ringXl: xl.ring,
    gradientXl: xl.gradient,
    photoXl: xl.photo,
  };
});
