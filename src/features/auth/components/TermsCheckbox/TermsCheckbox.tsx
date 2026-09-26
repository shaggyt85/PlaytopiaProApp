import { useState } from "react";
import { View } from "react-native";

import { Checkbox } from "@/shared/components/Checkbox";
import { Text } from "@/shared/components/Text";
import { useTranslation } from "@/shared/hooks/useTranslation";

import { LegalModal, type LegalDocument } from "../LegalModal";

const link = { textDecorationLine: "underline" } as const;

interface TermsCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Mensaje de error ya traducido. */
  error?: string;
}

/** Aceptación de condiciones y privacidad del registro; los enlaces abren su resumen. */
export function TermsCheckbox({ checked, onChange, error }: TermsCheckboxProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState<LegalDocument | null>(null);
  const label = `${t("auth.legal.text")} ${t("auth.legal.terms")} ${t("auth.legal.and")} ${t("auth.legal.privacy")}`;

  return (
    <View>
      <Checkbox checked={checked} onChange={onChange} accessibilityLabel={label}>
        {t("auth.legal.text")}{" "}
        <Text variant="label" color="link" style={link} onPress={() => setOpen("terms")} accessibilityRole="link">
          {t("auth.legal.terms")}
        </Text>{" "}
        {t("auth.legal.and")}{" "}
        <Text variant="label" color="link" style={link} onPress={() => setOpen("privacy")} accessibilityRole="link">
          {t("auth.legal.privacy")}
        </Text>
      </Checkbox>
      {error ? (
        <Text variant="caption" accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : null}
      <LegalModal document={open} onClose={() => setOpen(null)} />
    </View>
  );
}
