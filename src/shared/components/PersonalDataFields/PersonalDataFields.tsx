import { Controller, useFormContext } from "react-hook-form";

import { DateInput } from "@/shared/components/DateInput";
import { EmailInput } from "@/shared/components/EmailInput";
import { GenderSelector } from "@/shared/components/GenderSelector";
import { Input } from "@/shared/components/Input";
import { PhoneInput } from "@/shared/components/PhoneInput";
import { useFieldErrorText } from "@/shared/hooks/useFieldErrorText";
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
  const fieldError = useFieldErrorText();
  const {
    control,
    formState: { errors },
  } = useFormContext<PersonalDataFormInput>();
  // Hasta hoy mismo: nadie nace en el futuro.
  const today = new Date();

  return (
    <>
      <Controller
        control={control}
        name="firstName"
        render={({ field: { onChange, onBlur, value } }) => (
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
            error={fieldError(errors.firstName?.message)}
          />
        )}
      />

      <Controller
        control={control}
        name="lastName"
        render={({ field: { onChange, onBlur, value } }) => (
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
            error={fieldError(errors.lastName?.message)}
          />
        )}
      />

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <EmailInput
            variant="solid"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={fieldError(errors.email?.message)}
          />
        )}
      />

      <Controller
        control={control}
        name="country"
        render={({ field: country }) => (
          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, onBlur, value } }) => (
              <PhoneInput
                country={country.value}
                onCountryChange={country.onChange}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={fieldError(errors.phone?.message)}
              />
            )}
          />
        )}
      />

      <Controller
        control={control}
        name="birthday"
        render={({ field: { onChange, onBlur, value } }) => (
          <DateInput
            label={t("personalData.birthdayLabel")}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            maximumDate={today}
            required={birthdayRequired}
            error={fieldError(errors.birthday?.message)}
          />
        )}
      />

      <Controller
        control={control}
        name="gender"
        render={({ field: { onChange, value } }) => (
          <GenderSelector value={value} onChange={onChange} error={fieldError(errors.gender?.message)} />
        )}
      />
    </>
  );
}
