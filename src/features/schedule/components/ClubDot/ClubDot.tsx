import { View } from "react-native";

import { useStyles, type ClubDotSize } from "./ClubDot.styles";

interface ClubDotProps {
  /** El color del club (`ScheduleClub.colors.color`). */
  color: string;
  /** Con un aro oscuro, para que se vea sobre su propio color (en `ClubBadge`). */
  ring?: boolean;
  /** `sm` (por defecto) en las pastillas y líneas; `lg` en la tarjeta del club del detalle. */
  size?: ClubDotSize;
}

/**
 * El punto del color de un club delante de su nombre (el 🟢 de la captura): en
 * la pastilla de cada clase de la tira, en la línea del club de la próxima y en
 * la pastilla con el degradado del club, donde lleva un aro para verse, y en
 * grande en la tarjeta del club del detalle (el emoji del club en la captura).
 */
export function ClubDot({ color, ring = false, size = "sm" }: ClubDotProps) {
  const styles = useStyles();
  return <View style={[styles[size], ring && styles.ring, { backgroundColor: color }]} testID="club-dot" />;
}
