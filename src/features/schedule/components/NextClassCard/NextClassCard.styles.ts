import { StyleSheet } from "react-native";

import { halo } from "@/shared/config/theme";
import { makeStyles } from "@/shared/hooks/makeStyles";
import { withAlpha } from "@/shared/utils/color";

/** El punto de la etiqueta (`h-1.5 w-1.5`). */
const LABEL_DOT = 6;
/** Los iconos pequeños: ubicación, reloj y nivel (`h-3.5 w-3.5`). */
export const SMALL_ICON = 14;
/** La flecha de la derecha (`h-5 w-5`). */
export const CHEVRON_SIZE = 20;
/** Dónde para cada color del degradado (`…, surface 60%, …`). */
export const NEXT_CLASS_STOPS = [0, 0.6, 1] as const;

export const useStyles = makeStyles((theme) => {
  // `gap-1.5` y `mt-3.5` del prototipo, de los tokens.
  const gap6 = theme.spacing.xs + theme.spacing.xs / 2;
  const gap14 = theme.spacing.sm + gap6;
  return {
    // `rounded-2xl border border-magenta/40 p-4 shadow-[0_0_28px_-10px_var(--magenta)]`
    // sobre `surface`. Sin `overflow: hidden`, que recortaría el brillo: el degradado
    // se redondea solo.
    card: {
      padding: theme.spacing.md,
      borderRadius: theme.radius.xxl,
      borderWidth: 1,
      borderColor: withAlpha(theme.colors.primary, 0.4),
      backgroundColor: theme.colors.surface,
      ...halo(theme.colors.primary, 28, -10),
    },
    fill: { ...StyleSheet.absoluteFill, borderRadius: theme.radius.xxl - 1 },
    // `flex items-start gap-3`: los textos y la flecha.
    top: { flexDirection: "row", alignItems: "flex-start", gap: theme.spacing.sm + theme.spacing.xs },
    texts: { flex: 1, minWidth: 0 },
    labelRow: { flexDirection: "row", alignItems: "center", gap: gap6 },
    labelDot: { width: LABEL_DOT, height: LABEL_DOT, borderRadius: LABEL_DOT / 2, backgroundColor: theme.colors.primary },
    label: { flexShrink: 1 },
    title: { marginTop: gap6 },
    placeRow: { flexDirection: "row", alignItems: "center", gap: gap6, marginTop: theme.spacing.xs },
    place: { flexShrink: 1 },
    // `mt-6`: la flecha baja hasta el título.
    chevron: { marginTop: theme.spacing.lg },
    // `mt-3.5 flex items-center gap-3`.
    studentsRow: { flexDirection: "row", alignItems: "center", gap: theme.spacing.sm + theme.spacing.xs, marginTop: gap14 },
    seats: { flexShrink: 1, gap: theme.spacing.xs / 2 },
    // `mt-3.5 flex justify-between border-t border-border/40 pt-2.5`.
    footer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: gap14,
      paddingTop: theme.spacing.sm + theme.spacing.xs / 2,
      borderTopWidth: 1,
      borderTopColor: withAlpha(theme.colors.border, 0.4),
    },
    footerItem: { flexDirection: "row", alignItems: "center", gap: gap6 },
  };
});
