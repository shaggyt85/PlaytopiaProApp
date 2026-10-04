import { StyleSheet } from "react-native";

import { halo } from "@/shared/config/theme";
import { makeStyles } from "@/shared/hooks/makeStyles";
import { withAlpha } from "@/shared/utils/color";

import { HOUR_LABEL_WIDTH, TIMELINE_LINE_X } from "../../utils/timelineMetrics";

/** Alto de la fila de cada marca: la hora y su punto se centran en ella, sobre su minuto. */
export const MARKER_HEIGHT = 16;
/** El puntito de cada hora (`h-[7px] w-[7px]`) y el punto de color de cada clase (`h-2.5 w-2.5`). */
const HOUR_DOT = 7;
const CLASS_DOT = 10;

const dot = (size: number) =>
  ({
    position: "absolute",
    left: TIMELINE_LINE_X - size / 2,
    top: (MARKER_HEIGHT - size) / 2,
    width: size,
    height: size,
    borderRadius: size / 2,
  }) as const;

export const useStyles = makeStyles((theme) => ({
  fill: StyleSheet.absoluteFill,
  // La línea vertical (`w-px bg-border/40`).
  line: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: TIMELINE_LINE_X,
    width: 1,
    backgroundColor: withAlpha(theme.colors.border, 0.4),
  },
  // Cada marca centrada en su minuto (`-translate-y-1/2`).
  marker: { position: "absolute", left: 0, right: 0, height: MARKER_HEIGHT, justifyContent: "center" },
  label: { width: HOUR_LABEL_WIDTH, textAlign: "right" },
  hourDot: { ...dot(HOUR_DOT), backgroundColor: withAlpha(theme.colors.border, 0.7) },
  classDot: dot(CLASS_DOT),
  // La próxima clase brilla (`shadow-[0_0_10px_var(--magenta)]`).
  nextDot: halo(theme.colors.primary, 10),
}));
