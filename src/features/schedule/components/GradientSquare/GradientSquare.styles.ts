import { StyleSheet } from "react-native";

import { makeStyles } from "@/shared/hooks/makeStyles";

export const useStyles = makeStyles(() => ({
  square: { alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 },
  fill: StyleSheet.absoluteFill,
}));
