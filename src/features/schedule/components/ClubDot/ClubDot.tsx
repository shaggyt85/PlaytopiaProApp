import { View } from "react-native";

import { useStyles } from "./ClubDot.styles";

interface ClubDotProps {
  /** El color del club (`ScheduleClub.colors.color`). */
  color: string;
}

/**
 * El punto del color de un club delante de su nombre (el 🟢 de la captura): en
 * la pastilla de cada clase de la tira y en la línea del club de la próxima.
 */
export function ClubDot({ color }: ClubDotProps) {
  const styles = useStyles();
  return <View style={[styles.dot, { backgroundColor: color }]} testID="club-dot" />;
}
