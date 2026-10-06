import type { ReactNode } from "react";
import { View } from "react-native";

import { Text } from "@/shared/components/Text";
import type { IconComponent } from "@/shared/config/icons";
import { useTheme } from "@/shared/hooks/useTheme";

import { PROFILE_CARD_ICON_SIZE, useStyles } from "./ProfileCard.styles";

interface ProfileCardProps {
  Icon: IconComponent;
  /** Ya traducido: «Datos personales»… Se pinta en mayúsculas. */
  title: string;
  children: ReactNode;
  testID?: string;
}

/**
 * Una tarjeta de Perfil, como el prototipo: el icono en magenta y el título en
 * mayúsculas, y debajo su contenido. La base de todas las de la pantalla, así
 * su aspecto se escribe una vez. El «Editar» llega con su editor.
 */
export function ProfileCard({ Icon, title, children, testID }: ProfileCardProps) {
  const styles = useStyles();
  const theme = useTheme();
  return (
    <View style={styles.card} testID={testID}>
      <View style={styles.head}>
        <Icon size={PROFILE_CARD_ICON_SIZE} color={theme.colors.primary} />
        <Text variant="segment" color="textSecondary" accessibilityRole="header">
          {title}
        </Text>
      </View>
      <View style={styles.body}>{children}</View>
    </View>
  );
}
