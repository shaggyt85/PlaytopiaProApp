import { IconLoLock, IconLoShield, IconLoZap } from "@playtopia/icons/react-native";
import { Alert, View } from "react-native";

import { PromptSheet } from "@/shared/components/PromptSheet";
import { Text } from "@/shared/components/Text";
import type { IconComponent } from "@/shared/config/icons";
import { useTheme } from "@/shared/hooks/useTheme";
import { useTranslation } from "@/shared/hooks/useTranslation";
import type { TranslationKey } from "@/shared/locales";

import { useBiometricOffer, type OfferResult } from "../../hooks/useBiometricOffer";

import { useStyles } from "./BiometricOfferModal.styles";

const BENEFIT_ICON = 20;

const BENEFITS: readonly { Icon: IconComponent; label: TranslationKey }[] = [
  { Icon: IconLoZap, label: "auth.biometric.offer.instant" },
  { Icon: IconLoShield, label: "auth.biometric.offer.security" },
  { Icon: IconLoLock, label: "auth.biometric.offer.encrypted" },
];

/** El aviso nativo de cada resultado; al cancelar no se avisa. */
const RESULT_ALERT: Record<Exclude<OfferResult, "cancelled">, { title: TranslationKey; message: TranslationKey }> = {
  enabled: { title: "auth.biometric.offer.enabledTitle", message: "auth.biometric.offer.enabledMessage" },
  failed: { title: "auth.biometric.offer.failedTitle", message: "auth.biometric.offer.failedMessage" },
  unavailable: {
    title: "auth.biometric.offer.unavailableTitle",
    message: "auth.biometric.offer.unavailableMessage",
  },
  expired: { title: "auth.biometric.offer.expiredTitle", message: "auth.biometric.offer.expiredMessage" },
};

/**
 * Oferta de activar la biometría tras entrar con contraseña (la de la app de
 * alumnos, con el panel de Lovable). Los resultados se avisan con `Alert`: al
 * activarla o si la oferta caducó el panel se cierra; si falla, sigue abierto
 * para reintentar.
 */
export function BiometricOfferModal() {
  const styles = useStyles();
  const theme = useTheme();
  const { t } = useTranslation();
  const { visible, enable, isEnabling, dismiss } = useBiometricOffer();

  const activate = async () => {
    const result = await enable();
    if (result === "cancelled") return;
    const { title, message } = RESULT_ALERT[result];
    Alert.alert(t(title), t(message), [{ text: t("common.accept") }]);
  };

  return (
    <PromptSheet
      visible={visible}
      onClose={isEnabling ? noop : dismiss}
      Icon={IconLoShield}
      title={t("auth.biometric.offer.title")}
      subtitle={t("auth.biometric.offer.subtitle")}
      primary={{
        title: t(isEnabling ? "auth.biometric.offer.enabling" : "auth.biometric.offer.enable"),
        onPress: activate,
        loading: isEnabling,
      }}
      secondary={{ title: t("common.notNow"), onPress: dismiss, disabled: isEnabling }}
    >
      <View style={styles.benefits}>
        {BENEFITS.map(({ Icon, label }) => (
          <View key={label} style={styles.benefit}>
            <Icon size={BENEFIT_ICON} color={theme.colors.primary} />
            <Text variant="emphasis">{t(label)}</Text>
          </View>
        ))}
      </View>
    </PromptSheet>
  );
}

// Mientras se activa no se cierra: el diálogo del sistema está en marcha.
const noop = () => undefined;
