import { View } from "react-native";

import { useStyles } from "./ClubDot.styles";

interface ClubDotProps {
  /** Su color: el blanco sobre el degradado de la cabecera del detalle. */
  color: string;
}

/**
 * El punto del color de un club delante de su nombre: en la cabecera del detalle
 * de una clase y en las tarjetas de Perfil (horas y clubes).
 */
export function ClubDot({ color }: ClubDotProps) {
  const styles = useStyles();
  return <View style={[styles.dot, { backgroundColor: color }]} testID="club-dot" />;
}
