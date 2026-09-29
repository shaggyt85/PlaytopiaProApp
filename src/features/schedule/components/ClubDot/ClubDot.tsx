import { View } from "react-native";

import { useStyles } from "./ClubDot.styles";

interface ClubDotProps {
  /** El color del club (`ScheduleClub.colors.color`). */
  color: string;
  /** Con un aro oscuro, para que se vea sobre su propio color (en `ClubBadge`). */
  ring?: boolean;
}

/**
 * El punto del color de un club delante de su nombre (el 🟢 de la captura): en
 * la pastilla de cada clase de la tira, en la línea del club de la próxima y en
 * la pastilla con el degradado del club, donde lleva un aro para verse.
 */
export function ClubDot({ color, ring = false }: ClubDotProps) {
  const styles = useStyles();
  return <View style={[styles.dot, ring && styles.ring, { backgroundColor: color }]} testID="club-dot" />;
}
