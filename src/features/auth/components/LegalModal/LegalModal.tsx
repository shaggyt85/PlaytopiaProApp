import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { Alert, Animated, Linking, Modal, Pressable, ScrollView, View } from "react-native";

import { Button } from "@/shared/components/Button";
import { Text } from "@/shared/components/Text";
import { BRAND } from "@/shared/config/brand";
import { useTheme } from "@/shared/hooks/useTheme";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { withAlpha } from "@/shared/utils/color";

import { useStyles } from "./LegalModal.styles";

export type LegalDocument = "terms" | "privacy";

// Documentos completos en la web (los mismos que la app de alumnos).
const DOCUMENT_URL: Record<LegalDocument, string> = {
  terms: "https://playtopiax.com/legal/",
  privacy: "https://playtopiax.com/privacy/",
};

const ICON: Record<LegalDocument, keyof typeof Ionicons.glyphMap> = {
  terms: "document-text-outline",
  privacy: "shield-checkmark-outline",
};

// Fondo de la tarjeta: el "cristal" oscuro de la app de alumnos.
const CARD_GRADIENT = [withAlpha(BRAND.night, 0.75), withAlpha(BRAND.slate, 0.8)] as const;

interface LegalModalProps {
  document: LegalDocument | null;
  onClose: () => void;
}

/** Resumen de las condiciones o la privacidad, con enlace al documento completo. */
export function LegalModal({ document, onClose }: LegalModalProps) {
  const styles = useStyles();
  const theme = useTheme();
  const { t } = useTranslation();
  // Se crea una sola vez; con useState se puede leer durante el render.
  const [scale] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (!document) return;
    scale.setValue(0);
    Animated.spring(scale, {
      toValue: 1,
      tension: 120,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, [document, scale]);

  const openFullDocument = async () => {
    if (!document) return;
    try {
      await Linking.openURL(DOCUMENT_URL[document]);
    } catch {
      Alert.alert(t("legalDocs.openFailed"));
    }
  };

  return (
    <Modal transparent visible={document !== null} animationType="fade" onRequestClose={onClose}>
      <View style={styles.root}>
        <Pressable style={styles.overlay} onPress={onClose} accessibilityLabel={t("common.close")} />
        {document ? (
          <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
            <LinearGradient colors={CARD_GRADIENT} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
              <View style={styles.header}>
                <Text variant="subtitle" style={styles.title} accessibilityRole="header">
                  {t(`legalDocs.${document}.title`)}
                </Text>
                <Pressable
                  onPress={onClose}
                  style={styles.close}
                  accessibilityRole="button"
                  accessibilityLabel={t("common.close")}
                >
                  <Ionicons name="close" size={24} color={theme.colors.text} />
                </Pressable>
              </View>
              <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.iconCircle}>
                  <Ionicons name={ICON[document]} size={48} color={theme.colors.text} />
                </View>
                <Text style={styles.summary}>{t(`legalDocs.${document}.summary`)}</Text>
                <View style={styles.action}>
                  <Button title={t("legalDocs.viewFullDocument")} onPress={openFullDocument} />
                </View>
              </ScrollView>
            </LinearGradient>
          </Animated.View>
        ) : null}
      </View>
    </Modal>
  );
}
