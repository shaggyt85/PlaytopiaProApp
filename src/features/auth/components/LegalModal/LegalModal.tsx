import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Animated, Modal, Pressable, View } from "react-native";

import { AppScrollView } from "@/shared/components/AppScrollView";
import { Button } from "@/shared/components/Button";
import { DiagonalGradient } from "@/shared/components/DiagonalGradient";
import { Text } from "@/shared/components/Text";
import { useTheme } from "@/shared/hooks/useTheme";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { openExternalUrl } from "@/shared/utils/openExternalUrl";

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

interface LegalModalProps {
  document: LegalDocument | null;
  onClose: () => void;
  /** Si se pasa, el modal pide aceptar el documento con un botón "Aceptar". */
  onAccept?: () => void | Promise<unknown>;
  /** Error al aceptar, ya traducido. */
  error?: string | null;
}

/** Resumen de las condiciones o la privacidad, con enlace al documento completo. */
export function LegalModal({ document, onClose, onAccept, error }: LegalModalProps) {
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
    await openExternalUrl(DOCUMENT_URL[document], t);
  };

  return (
    <Modal transparent visible={document !== null} animationType="fade" onRequestClose={onClose}>
      <View style={styles.root}>
        <Pressable style={styles.overlay} onPress={onClose} accessibilityLabel={t("common.close")} />
        {document ? (
          <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
            <DiagonalGradient colors={theme.gradients.modal}>
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
              <AppScrollView contentContainerStyle={styles.content}>
                <View style={styles.iconCircle}>
                  <Ionicons name={ICON[document]} size={48} color={theme.colors.text} />
                </View>
                <Text style={styles.summary}>{t(`legalDocs.${document}.summary`)}</Text>
                <View style={styles.action}>
                  <Button title={t("legalDocs.viewFullDocument")} onPress={openFullDocument} />
                  {onAccept ? <Button title={t("common.accept")} onPress={onAccept} /> : null}
                  {error ? (
                    <Text variant="caption" align="center" accessibilityRole="alert">
                      {error}
                    </Text>
                  ) : null}
                </View>
              </AppScrollView>
            </DiagonalGradient>
          </Animated.View>
        ) : null}
      </View>
    </Modal>
  );
}
