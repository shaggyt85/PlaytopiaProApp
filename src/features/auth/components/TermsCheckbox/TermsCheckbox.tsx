import { View } from "react-native";

import { Checkbox } from "@/shared/components/Checkbox";
import { FieldError } from "@/shared/components/FieldError";
import { useTranslation } from "@/shared/hooks/useTranslation";

import { LegalLinks, legalSentence } from "../LegalLinks";

interface TermsCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Mensaje de error ya traducido. */
  error?: string;
}

/** Aceptación de condiciones y privacidad del registro; los enlaces abren su resumen. */
export function TermsCheckbox({ checked, onChange, error }: TermsCheckboxProps) {
  const { t } = useTranslation();

  return (
    <View>
      <Checkbox checked={checked} onChange={onChange} accessibilityLabel={legalSentence(t)}>
        <LegalLinks variant="label" />
      </Checkbox>
      <FieldError message={error} />
    </View>
  );
}
