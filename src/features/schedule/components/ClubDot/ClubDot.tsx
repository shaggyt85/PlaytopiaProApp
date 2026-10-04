import { View } from "react-native";

import { useStyles } from "./ClubDot.styles";

interface ClubDotProps {
  /** Su color: el blanco sobre el degradado de la cabecera del detalle. */
  color: string;
}

/** El punto delante del nombre del club en la cabecera del detalle de una clase. */
export function ClubDot({ color }: ClubDotProps) {
  const styles = useStyles();
  return <View style={[styles.dot, { backgroundColor: color }]} testID="club-dot" />;
}
