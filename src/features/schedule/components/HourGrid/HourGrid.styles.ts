import { StyleSheet } from "react-native";

import { makeStyles } from "@/shared/hooks/makeStyles";

import { HOUR_LABEL_WIDTH } from "../../utils/timelineMetrics";

export const useStyles = makeStyles((theme) => ({
  fill: StyleSheet.absoluteFill,
  // Cada hora centrada en su línea (`flex items-center`).
  row: { position: "absolute", left: 0, right: 0, flexDirection: "row", alignItems: "center" },
  label: { width: HOUR_LABEL_WIDTH, textAlign: "right" },
  // `ml-2 h-px bg-border/40`.
  line: { flex: 1, height: 1, marginLeft: theme.spacing.sm, backgroundColor: theme.colors.hairline },
}));
