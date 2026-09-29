import { Input, type InputProps } from "@/shared/components/Input";
import { useTranslation } from "@/shared/hooks/useTranslation";

/** Largo máximo de un email (RFC 5321): el mismo tope que valida Core. */
const EMAIL_MAX_LENGTH = 254;

/** Como `InputProps`, pero la etiqueta ya viene puesta. */
type EmailInputProps = Omit<InputProps, "label"> & { label?: string };

/**
 * Campo de email del acceso (login, registro y recuperación), con el teclado,
 * el autocompletado y el tope de un email. Lo que cambia entre pantallas —el
 * valor, los eventos, la tecla de retorno— llega por props, y cualquiera de las
 * fijas se puede sobrescribir.
 */
export function EmailInput({ label, ...props }: EmailInputProps) {
  const { t } = useTranslation();

  return (
    <Input
      label={label ?? t("auth.signIn.emailLabel")}
      placeholder={t("auth.signIn.emailPlaceholder")}
      keyboardType="email-address"
      autoCapitalize="none"
      autoCorrect={false}
      autoComplete="email"
      textContentType="emailAddress"
      maxLength={EMAIL_MAX_LENGTH}
      {...props}
    />
  );
}
