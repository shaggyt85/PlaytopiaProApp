import { StyleSheet } from "react-native";

import { makeStyles } from "@/shared/hooks/makeStyles";
import { withAlpha } from "@/shared/utils/color";

import { PAST_OPACITY } from "../../utils/timelineMetrics";

/** El cuadrado de la hora (`h-14 w-14`). */
export const TIME_SQUARE_SIZE = 56;
/** El reloj de la línea de datos (`h-3 w-3`). */
export const CLOCK_SIZE = 12;
/** La flecha (`h-4 w-4`). */
export const CHEVRON_SIZE = 16;
/** La barra de ocupación (`h-1`). */
const BAR_HEIGHT = 4;

export const useStyles = makeStyles((theme) => ({
  // `flex items-center gap-3 rounded-2xl p-2.5 ring-soft bg-surface`.
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm + theme.spacing.xs,
    padding: theme.spacing.sm + theme.spacing.xs / 2,
    borderRadius: theme.radius.xxl,
    borderWidth: 1,
    borderColor: theme.colors.hairline,
    backgroundColor: theme.colors.surface,
  },
  // En curso: `bg-lime/10 ring-1 ring-lime/40`.
  live: {
    borderColor: withAlpha(theme.colors.primary, 0.4),
    backgroundColor: withAlpha(theme.colors.primary, 0.1),
  },
  past: { opacity: PAST_OPACITY },
  content: { flex: 1, minWidth: 0 },
  titleRow: { flexDirection: "row", alignItems: "center", gap: theme.spacing.xs + theme.spacing.xs / 2 },
  title: { flexShrink: 1 },
  // «EN VIVO»: `rounded-full bg-coral px-1.5 py-0.5`.
  livePill: {
    flexShrink: 0,
    paddingHorizontal: theme.spacing.xs + theme.spacing.xs / 2,
    paddingVertical: theme.spacing.xs / 2,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.accents.coral.color,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
    marginTop: theme.spacing.xs / 2,
  },
  meta: { flexShrink: 1 },
  seatsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    marginTop: theme.spacing.xs + theme.spacing.xs / 2,
  },
  // `h-1 flex-1 overflow-hidden rounded-full bg-surface-2`.
  bar: {
    flex: 1,
    height: BAR_HEIGHT,
    overflow: "hidden",
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.surfaceStrong,
  },
  barFill: { height: "100%", overflow: "hidden", borderRadius: theme.radius.pill },
  fill: StyleSheet.absoluteFill,
}));
