import { useFormContext } from "react-hook-form";

import { ControlledField } from "@/shared/components/ControlledField";
import { DateInput } from "@/shared/components/DateInput";
import { EmailInput } from "@/shared/components/EmailInput";
import { GenderSelector } from "@/shared/components/GenderSelector";
import { Input } from "@/shared/components/Input";
import { PhoneInput } from "@/shared/components/PhoneInput";
import { useTranslation } from "@/shared/hooks/useTranslation";
import type { PersonalDataFormInput } from "@/shared/schemas/personalData.schema";

interface PersonalDataFieldsProps {
  /** El alta la pide; en Perfil es opcional. */
  birthdayRequired?: boolean;
}

/**
 * Los campos de los datos personales (nombre, apellido, email, teléfono,
 * nacimiento y género), los del registro. Único sitio que los pinta: el alta y
 * el editor de Perfil. Van dentro del `FormProvider` del formulario, que valida
 * con `PersonalDataFormSchema` (o uno que lo extiende), así que las reglas y
 * los campos son los mismos en los dos.
 */
export function PersonalDataFields({ birthdayRequired = false }: PersonalDataFieldsProps) {
  const { t } = useTranslation();
  const { control } = useFormContext<PersonalDataFormInput>();
  // Hasta hoy mismo: nadie nace en el futuro.
  const today = new Date();

  return (
    <>
      <ControlledField
        control={control}
        name="firstName"
        render={({ value, onChange, onBlur, error }) => (
          <Input
            variant="solid"
            label={t("personalData.firstNameLabel")}
            placeholder={t("personalData.firstNamePlaceholder")}
            autoCapitalize="words"
            autoComplete="given-name"
            textContentType="givenName"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={error}
          />
        )}
      />

      <ControlledField
        control={control}
        name="lastName"
        render={({ value, onChange, onBlur, error }) => (
          <Input
            variant="solid"
            label={t("personalData.lastNameLabel")}
            placeholder={t("personalData.lastNamePlaceholder")}
            autoCapitalize="words"
            autoComplete="family-name"
            textContentType="familyName"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={error}
          />
        )}
      />

      <ControlledField
        control={control}
        name="email"
        render={({ value, onChange, onBlur, error }) => (
          <EmailInput
            variant="solid"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={error}
          />
        )}
      />

      <ControlledField
        control={control}
        name="country"
        render={(country) => (
          <ControlledField
            control={control}
            name="phone"
            render={({ value, onChange, onBlur, error }) => (
              <PhoneInput
                country={country.value}
                onCountryChange={country.onChange}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={error}
              />
            )}
          />
        )}
      />

      <ControlledField
        control={control}
        name="birthday"
        render={({ value, onChange, onBlur, error }) => (
          <DateInput
            label={t("personalData.birthdayLabel")}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            maximumDate={today}
            required={birthdayRequired}
            error={error}
          />
        )}
      />

      <ControlledField
        control={control}
        name="gender"
        render={({ value, onChange, error }) => (
          <GenderSelector value={value} onChange={onChange} error={error} />
        )}
      />
    </>
  );
}
