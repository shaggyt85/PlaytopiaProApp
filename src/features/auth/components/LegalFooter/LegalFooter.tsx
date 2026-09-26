import { useState } from "react";

import { Text } from "@/shared/components/Text";
import { useTranslation } from "@/shared/hooks/useTranslation";

import { LegalModal, type LegalDocument } from "../LegalModal";

const link = { textDecorationLine: "underline" } as const;

/** "Al registrarte aceptas nuestras condiciones de uso y políticas de privacidad". */
export function LegalFooter() {
  const { t } = useTranslation();
  const [open, setOpen] = useState<LegalDocument | null>(null);

  return (
    <>
      <Text variant="small" color="textSecondary" align="center">
        {t("auth.legal.text")}{" "}
        <Text variant="small" color="link" style={link} onPress={() => setOpen("terms")} accessibilityRole="link">
          {t("auth.legal.terms")}
        </Text>{" "}
        {t("auth.legal.and")}{" "}
        <Text variant="small" color="link" style={link} onPress={() => setOpen("privacy")} accessibilityRole="link">
          {t("auth.legal.privacy")}
        </Text>
      </Text>
      <LegalModal document={open} onClose={() => setOpen(null)} />
    </>
  );
}
