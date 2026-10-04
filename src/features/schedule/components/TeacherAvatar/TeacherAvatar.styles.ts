import { StyleSheet } from "react-native";

import { halo } from "@/shared/config/theme";
import { makeStyles } from "@/shared/hooks/makeStyles";

/** El círculo (`h-12 w-12`) y el aro de marca que deja ver (`p-[2px]`). */
const SIDE = 48;
const RING = 2;

export const useStyles = makeStyles((theme) => ({
  // `rounded-full gradient-brand p-[2px] shadow-[0_0_20px_-6px_var(--magenta)]`.
  ring: {
    width: SIDE,
    height: SIDE,
    borderRadius: SIDE / 2,
    padding: RING,
    // Sin `overflow: hidden` aquí: recortaría el brillo. El degradado se redondea solo.
    ...halo(theme.colors.primary, 20, -6),
  },
  gradient: { ...StyleSheet.absoluteFill, borderRadius: SIDE / 2 },
  // Si la foto no carga, queda el fondo de la tarjeta (`bg-card`).
  photo: { flex: 1, borderRadius: SIDE / 2, overflow: "hidden", backgroundColor: theme.colors.card },
}));
