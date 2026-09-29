import { StyleSheet } from "react-native";

import { makeStyles } from "@/shared/hooks/makeStyles";

/** El círculo pequeño del prototipo (`h-8 w-8`). */
const SIZE = 32;
/** El aro que separa un círculo del de al lado (`ring-2 ring-background`). */
const RING = 2;

export const useStyles = makeStyles((theme) => ({
  row: { flexDirection: "row", alignItems: "center" },
  circle: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: RING,
    borderColor: theme.colors.background,
  },
  // `-space-x-2`: cada círculo se mete bajo el anterior.
  overlap: { marginLeft: -theme.spacing.sm },
  fill: StyleSheet.absoluteFill,
  more: { backgroundColor: theme.colors.surfaceStrong },
}));
