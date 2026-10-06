import { StyleSheet } from "react-native";

import { makeStyles } from "@/shared/hooks/makeStyles";

export const useStyles = makeStyles((theme) => ({
  // `rounded-full px-3 py-1.5`: apagado, `bg-surface ring-soft`; encendido, el degradado de marca.
  chip: {
    overflow: "hidden",
    borderRadius: theme.radius.pill,
    paddingHorizontal: theme.spacing.sm + theme.spacing.xs,
    paddingVertical: theme.spacing.xs + theme.spacing.xs / 2,
    backgroundColor: theme.colors.surface,
    ...theme.ringSoft,
  },
  gradient: StyleSheet.absoluteFill,
}));
