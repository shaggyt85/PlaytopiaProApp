import { IconLoChevronRight } from "@playtopia/icons/react-native";
import { Pressable } from "react-native";

import { Text } from "@/shared/components/Text";
import { useTheme } from "@/shared/hooks/useTheme";
import { useTranslation } from "@/shared/hooks/useTranslation";

import { useStyles } from "./EditButton.styles";

/** La › de «Editar» (`h-4 w-4`). */
const ICON_SIZE = 16;

interface EditButtonProps {
  onPress: () => void;
  /** Qué se edita, para el lector de pantalla: «Editar datos personales». */
  accessibilityLabel: string;
}

/** «Editar ›» a la derecha del título de una tarjeta de Perfil, en magenta, como el prototipo. */
export function EditButton({ onPress, accessibilityLabel }: EditButtonProps) {
  const styles = useStyles();
  const theme = useTheme();
  const { t } = useTranslation();
  return (
    <Pressable
      onPress={onPress}
      style={styles.button}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <Text variant="labelStrong" color="primary">
        {t("profile.edit")}
      </Text>
      <IconLoChevronRight size={ICON_SIZE} color={theme.colors.primary} />
    </Pressable>
  );
}
