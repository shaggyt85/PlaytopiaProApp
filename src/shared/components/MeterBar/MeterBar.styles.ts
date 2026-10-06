import { StyleSheet } from "react-native";

import { makeStyles } from "@/shared/hooks/makeStyles";

/** Las dos alturas del prototipo: `h-1` (la ocupación de una clase) y `h-1.5` (las horas de Perfil). */
export const METER_HEIGHTS = { sm: 4, md: 6 } as const;
export type MeterSize = keyof typeof METER_HEIGHTS;

export const useStyles = makeStyles((theme) => ({
  // `flex-1 overflow-hidden rounded-full bg-surface-2`.
  track: {
    flex: 1,
    overflow: "hidden",
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.surfaceStrong,
  },
  sm: { height: METER_HEIGHTS.sm },
  md: { height: METER_HEIGHTS.md },
  fill: { height: "100%", overflow: "hidden", borderRadius: theme.radius.pill },
  gradient: StyleSheet.absoluteFill,
}));
