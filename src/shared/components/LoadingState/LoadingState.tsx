import { ActivityIndicator } from "react-native";

import { StateLayout } from "@/shared/components/StateLayout";
import { Text } from "@/shared/components/Text";
import { useTheme } from "@/shared/hooks/useTheme";
import { useTranslation } from "@/shared/hooks/useTranslation";

export interface LoadingStateProps {
  /** Texto ya traducido; por defecto "Cargando…". */
  message?: string;
}

export function LoadingState({ message }: LoadingStateProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const text = message ?? t("common.loading");

  return (
    <StateLayout accessibilityRole="progressbar" accessibilityLabel={text}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <Text color="textSecondary">{text}</Text>
    </StateLayout>
  );
}
