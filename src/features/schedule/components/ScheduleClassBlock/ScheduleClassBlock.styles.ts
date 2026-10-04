import { StyleSheet } from "react-native";

import { halo } from "@/shared/config/theme";
import { makeStyles } from "@/shared/hooks/makeStyles";
import { withAlpha } from "@/shared/utils/color";

import { PAST_OPACITY } from "../../utils/timelineMetrics";

/** La flecha de la derecha (`h-4 w-4`). */
export const CHEVRON_SIZE = 16;

export const useStyles = makeStyles((theme) => ({
  // Hueco entre tarjetas: el `- 8` de su alto y el respiro entre columnas.
  slot: { position: "absolute", paddingRight: theme.spacing.xs, paddingBottom: theme.spacing.sm },
  past: { opacity: PAST_OPACITY },
  // La sombra y el brillo, fuera de la caja que recorta (`StripeCard`): si no, se cortarían.
  press: { flex: 1, borderRadius: theme.radius.lg },
  lifted: theme.shadows.lifted,
  // La próxima: `ring-magenta/60 shadow-[0_0_26px_-8px_var(--magenta)]`.
  nextGlow: halo(theme.colors.primary, 26, -8),
  nextRing: { borderColor: withAlpha(theme.colors.primary, 0.6) },
  card: { flex: 1 },
  fill: StyleSheet.absoluteFill,
  // `flex flex-col gap-0.5 pl-6 pr-9`: deja libre la franja a la izquierda y la
  // flecha a la derecha. Arriba y no centrado (el prototipo centra): en una clase
  // larga la marca quedaba lejos del borde; así empieza igual en todas.
  content: {
    flex: 1,
    gap: theme.spacing.xs / 2,
    paddingVertical: theme.spacing.sm,
    paddingLeft: theme.spacing.lg,
    paddingRight: theme.spacing.lg + theme.spacing.sm + theme.spacing.xs,
  },
  // `flex items-center gap-1.5`: la marca no se estira a todo el ancho.
  pills: { flexDirection: "row", alignItems: "center", gap: theme.spacing.xs + theme.spacing.xs / 2 },
  // `flex flex-wrap gap-x-3 gap-y-0.5`: duración, nivel y plazas.
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    columnGap: theme.spacing.sm + theme.spacing.xs,
    rowGap: theme.spacing.xs / 2,
  },
  // `absolute right-2.5 top-1/2 -translate-y-1/2`.
  chevron: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: theme.spacing.sm + theme.spacing.xs / 2,
    justifyContent: "center",
  },
}));
