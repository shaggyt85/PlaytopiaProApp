import { View } from "react-native";

import { ClubDot } from "@/shared/components/ClubDot";
import { Text } from "@/shared/components/Text";
import type { ScheduleClub } from "@/shared/hooks/useScheduleClubs";

import { useStyles } from "./ClubName.styles";

interface ClubNameProps {
  /** El nombre y el color que tiene en la agenda (`useScheduleClubs`). */
  club: ScheduleClub;
}

/**
 * Una sede en Perfil: su punto de color y su nombre, los de la agenda. Único
 * sitio que la dibuja: «Clubes donde trabajas» y cada sede de la
 * disponibilidad.
 */
export function ClubName({ club }: ClubNameProps) {
  const styles = useStyles();
  return (
    <View style={styles.club}>
      <ClubDot color={club.colors.color} />
      <Text variant="rowLabel" numberOfLines={1} style={styles.name}>
        {club.label}
      </Text>
    </View>
  );
}
