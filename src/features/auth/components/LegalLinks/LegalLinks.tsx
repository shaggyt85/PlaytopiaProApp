import { useState } from "react";

import { Text } from "@/shared/components/Text";
import type { TextVariant, ThemeColor } from "@/shared/config/theme";
import { useTranslation } from "@/shared/hooks/useTranslation";

import { LegalModal, type LegalDocument } from "../LegalModal";

const link = { textDecorationLine: "underline" } as const;

type Translate = ReturnType<typeof useTranslation>["t"];

/** La frase entera en texto plano, para lectores de pantalla. */
export const legalSentence = (t: Translate) =>
  `${t("auth.legal.text")} ${t("auth.legal.terms")} ${t("auth.legal.and")} ${t("auth.legal.privacy")}`;

interface LegalLinksProps {
  variant: TextVariant;
  color?: ThemeColor;
  align?: "left" | "center";
}

/**
 * "Al registrarte aceptas nuestras condiciones de uso y políticas de
 * privacidad": cada enlace abre el resumen de su documento en `LegalModal`.
 */
export function LegalLinks({ variant, color = "text", align }: LegalLinksProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState<LegalDocument | null>(null);

  const linkTo = (document: LegalDocument, label: string) => (
    <Text variant={variant} color="link" style={link} onPress={() => setOpen(document)} accessibilityRole="link">
      {label}
    </Text>
  );

  return (
    <>
      <Text variant={variant} color={color} align={align}>
        {t("auth.legal.text")} {linkTo("terms", t("auth.legal.terms"))} {t("auth.legal.and")}{" "}
        {linkTo("privacy", t("auth.legal.privacy"))}
      </Text>
      <LegalModal document={open} onClose={() => setOpen(null)} />
    </>
  );
}
