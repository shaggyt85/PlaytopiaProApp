import { StyleSheet } from "react-native";

import { makeStyles } from "@/shared/hooks/makeStyles";
import { withAlpha } from "@/shared/utils/color";

/** El punto de «● PRÓXIMA CLASE» (`h-1.5 w-1.5`). */
const LABEL_DOT = 6;
/** La flecha de la derecha. */
export const CHEVRON_SIZE = 20;

/**
 * El halo borroso de la esquina (`-right-12 -top-12 h-44 w-44 bg-lime/30
 * blur-3xl`): un círculo de 176 que sobresale 48 por arriba y por la derecha, y
 * que el desenfoque alarga unos 64 más.
 */
export const CORNER_GLOW = { fromRight: 40, fromTop: 40, radius: 150, opacity: 0.3 } as const;

export const useStyles = makeStyles((theme) => ({
  // `rounded-3xl gradient-ink p-5 ring-soft`, con el borde de marca de la captura.
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    padding: theme.spacing.md + theme.spacing.xs,
    borderRadius: theme.radius.xxxl,
    borderWidth: 1,
    borderColor: withAlpha(theme.colors.primary, 0.4),
    overflow: "hidden",
  },
  fill: StyleSheet.absoluteFill,
  content: { flex: 1, gap: theme.spacing.xs + theme.spacing.xs / 2 },
  labelRow: { flexDirection: "row", alignItems: "center", gap: theme.spacing.xs + theme.spacing.xs / 2 },
  labelDot: {
    width: LABEL_DOT,
    height: LABEL_DOT,
    borderRadius: LABEL_DOT / 2,
    backgroundColor: theme.colors.primary,
  },
  clubRow: { flexDirection: "row", alignItems: "center", gap: theme.spacing.xs + theme.spacing.xs / 2 },
  clubName: { flexShrink: 1 },
  studentsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    marginTop: theme.spacing.xs,
  },
}));
