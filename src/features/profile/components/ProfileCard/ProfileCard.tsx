import type { ReactNode } from "react";
import { View } from "react-native";

import { Text } from "@/shared/components/Text";
import type { IconComponent } from "@/shared/config/icons";
import { useTheme } from "@/shared/hooks/useTheme";

import { PROFILE_CARD_ICON_SIZE, useStyles } from "./ProfileCard.styles";

interface ProfileCardProps {
  Icon: IconComponent;
  /** El color del icono: magenta (por defecto) o el oro de las horas (`text-gold`). */
  iconColor?: string;
  /** Ya traducido: «Datos personales»… Se pinta en mayúsculas. */
  title: string;
  /** Lo que va a la derecha del título: el mes de las horas y, con su editor, «Editar». */
  aside?: ReactNode;
  children: ReactNode;
  testID?: string;
}

/**
 * Una tarjeta de Perfil, como el prototipo: el icono en magenta y el título en
 * mayúsculas, y debajo su contenido. La base de todas las de la pantalla, así
 * su aspecto se escribe una vez. A la derecha del título, lo que diga cada una
 * (`aside`): el mes en las horas y, cuando llegue su editor, «Editar».
 */
export function ProfileCard({ Icon, iconColor, title, aside, children, testID }: ProfileCardProps) {
  const styles = useStyles();
  const theme = useTheme();
  return (
    <View style={styles.card} testID={testID}>
      <View style={styles.head}>
        <Icon size={PROFILE_CARD_ICON_SIZE} color={iconColor ?? theme.colors.primary} />
        <Text variant="segment" color="textSecondary" accessibilityRole="header" style={styles.title}>
          {title}
        </Text>
        {aside}
      </View>
      <View style={styles.body}>{children}</View>
    </View>
  );
}
