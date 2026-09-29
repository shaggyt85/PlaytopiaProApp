import { StyleSheet } from "react-native";

import { makeStyles } from "@/shared/hooks/makeStyles";
import { withAlpha } from "@/shared/utils/color";

import { PAST_OPACITY } from "../../utils/timelineMetrics";

export const useStyles = makeStyles((theme) => ({
  // Hueco entre tarjetas: el `- 4` de su alto y entre columnas.
  slot: { position: "absolute", paddingRight: theme.spacing.xs, paddingBottom: theme.spacing.xs },
  past: { opacity: PAST_OPACITY },
  // `rounded-2xl p-2.5`, con el degradado de su club. Sin `overflow: hidden`:
  // recortaría el brillo de la próxima; el degradado lleva su propio radio.
  card: {
    flex: 1,
    padding: theme.spacing.sm + theme.spacing.xs / 2,
    borderRadius: theme.radius.xxl,
  },
  // La próxima, resaltada como en la captura: un aro claro y el brillo de su club
  // (el brillo lo pone el componente, con el color del club).
  next: { borderWidth: 2, borderColor: withAlpha(theme.colors.onPrimary, 0.35) },
  fill: { ...StyleSheet.absoluteFill, borderRadius: theme.radius.xxl },
  header: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: theme.spacing.sm },
  title: { flexShrink: 1 },
  meta: { marginTop: theme.spacing.xs / 2 },
  clubPill: { flexDirection: "row", alignItems: "center", gap: theme.spacing.xs, flexShrink: 1 },
  details: { flexDirection: "row", alignItems: "center", gap: theme.spacing.xs, marginTop: theme.spacing.xs },
  // `bg-black/30 rounded-full px-1.5 py-0.5` (el club) y `bg-background/30 ring-1`
  // (la marca «PRÓXIMA»): la tarjeta de fondo, oscurecida.
  pill: {
    paddingHorizontal: theme.spacing.xs + theme.spacing.xs / 2,
    paddingVertical: theme.spacing.xs / 2,
    borderRadius: theme.radius.pill,
    backgroundColor: withAlpha(theme.colors.background, 0.3),
  },
  nextPill: { borderWidth: 1, borderColor: theme.colors.hairlineStrong },
}));
