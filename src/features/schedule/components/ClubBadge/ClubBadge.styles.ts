import { StyleSheet } from "react-native";

import type { TextVariant } from "@/shared/config/theme";
import { makeStyles } from "@/shared/hooks/makeStyles";

export type ClubBadgeSize = "legend" | "mini";

/** El texto de cada tamaño: `text-[10px] font-bold` y `text-[9px] font-bold`. */
export const LABEL_VARIANT = {
  legend: "chip",
  mini: "badge",
} as const satisfies Record<ClubBadgeSize, TextVariant>;

export const useStyles = makeStyles((theme) => {
  const pill = {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    flexShrink: 1,
    gap: theme.spacing.xs,
    overflow: "hidden",
    paddingVertical: theme.spacing.xs / 2,
    borderRadius: theme.radius.pill,
  } as const;
  return {
    // `rounded-full px-2 py-0.5` en la leyenda y `px-1.5 py-0.5` en las filas.
    legend: { ...pill, paddingHorizontal: theme.spacing.sm },
    mini: { ...pill, paddingHorizontal: theme.spacing.xs + theme.spacing.xs / 2 },
    fill: StyleSheet.absoluteFill,
    label: { flexShrink: 1 },
  };
});
