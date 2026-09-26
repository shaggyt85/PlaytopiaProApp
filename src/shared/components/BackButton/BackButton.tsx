import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "@/shared/hooks/useTheme";
import { useTranslation } from "@/shared/hooks/useTranslation";

import { useStyles } from "./BackButton.styles";

/** Botón circular de volver, arriba a la izquierda (debajo de la barra de estado). */
export function BackButton({ onPress }: { onPress?: () => void }) {
  const styles = useStyles();
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t("common.back")}
      hitSlop={theme.spacing.sm}
      onPress={onPress ?? (() => router.back())}
      style={({ pressed }) => [
        styles.circle,
        { top: insets.top + theme.spacing.md, opacity: pressed ? 0.7 : 1 },
      ]}
    >
      <Ionicons name="arrow-back" size={24} color={theme.colors.disabled} />
    </Pressable>
  );
}
