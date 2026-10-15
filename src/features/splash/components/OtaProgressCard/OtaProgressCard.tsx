import { IconLoRefreshCw } from "@playtopia/icons/react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Text, View } from "react-native";

import { t } from "@/shared/config/i18n";
import { darkTheme } from "@/shared/config/theme";

import { OTA_ICON_SIZE, styles } from "./OtaProgressCard.styles";

interface OtaProgressCardProps {
  /** De 0 a 1: lo que lleva descargado. */
  progress: number;
}

/**
 * La tarjeta del splash mientras baja una actualización: «Actualizando
 * Playtopia Pro», el porcentaje y la barra con el progreso real. Solo pinta.
 */
export function OtaProgressCard({ progress }: OtaProgressCardProps) {
  const percent = Math.round(Math.min(Math.max(progress, 0), 1) * 100);

  return (
    <View
      style={styles.card}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={`${t("splash.ota.title")}. ${t("splash.ota.subtitle")}`}
      accessibilityValue={{ min: 0, max: 100, now: percent }}
      testID="ota-progress-card"
    >
      <View style={styles.header}>
        <View style={styles.iconCircle}>
          <IconLoRefreshCw size={OTA_ICON_SIZE} color={darkTheme.colors.primary} />
        </View>
        <View style={styles.texts}>
          <Text style={styles.title}>{t("splash.ota.title")}</Text>
          <Text style={styles.subtitle}>{t("splash.ota.subtitle")}</Text>
        </View>
        <Text style={styles.percent}>{t("splash.ota.percent", { percent })}</Text>
      </View>
      <View style={styles.track}>
        <LinearGradient
          colors={darkTheme.gradients.brand}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={[styles.fill, { width: `${percent}%` }]}
          testID="ota-progress-fill"
        />
      </View>
    </View>
  );
}
