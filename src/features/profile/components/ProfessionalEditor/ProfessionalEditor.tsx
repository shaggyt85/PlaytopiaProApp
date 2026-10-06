import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";

import { DataState } from "@/shared/components/DataState";
import { Input } from "@/shared/components/Input";
import { SectionLabel } from "@/shared/components/SectionLabel";
import { useFieldErrorText } from "@/shared/hooks/useFieldErrorText";
import { useTranslation } from "@/shared/hooks/useTranslation";
import type { TeacherSport } from "@/shared/schemas/teacherProfile.schema";

import { useEditorSave } from "../../hooks/useEditorSave";
import { useSportsCatalog } from "../../hooks/useSportsCatalog";
import { useUpdateProfile } from "../../hooks/useUpdateProfile";
import {
  DESCRIPTION_MAX_LENGTH,
  ProfessionalFormSchema,
  toProfessionalRequest,
  type ProfessionalForm,
} from "../../schemas/professional.schema";
import { professionalDefaults } from "../../utils/professionalDefaults";
import { ProfileEditorForm } from "../ProfileEditorForm";
import type { ProfileEditorProps } from "../ProfileEditorSheet/profileEditors";
import { SpecialtyPicker } from "../SpecialtyPicker";
import { YearsStepper } from "../YearsStepper";

import { useStyles } from "./ProfessionalEditor.styles";

/**
 * Editor del perfil profesional, como el prototipo (sin los niveles, que Core
 * aún no tiene): los años, la presentación y las especialidades del catálogo.
 * Hasta que llega el catálogo, sus estados (`DataState`): el formulario no se
 * ve a medias.
 */
export function ProfessionalEditor({ profile, onDone }: ProfileEditorProps) {
  const catalog = useSportsCatalog();
  return (
    <DataState hasData={catalog.data !== undefined} error={catalog.error} onRetry={catalog.refetch}>
      {catalog.data ? <ProfessionalFormFields profile={profile} catalog={catalog.data} onDone={onDone} /> : null}
    </DataState>
  );
}

/** El formulario, ya con el catálogo: los valores iniciales dependen de él. */
function ProfessionalFormFields({ profile, catalog, onDone }: ProfileEditorProps & { catalog: readonly TeacherSport[] }) {
  const styles = useStyles();
  const { t } = useTranslation();
  const fieldError = useFieldErrorText();
  const { save, saving, error } = useEditorSave(useUpdateProfile(), onDone);
  const form = useForm<ProfessionalForm>({
    resolver: zodResolver(ProfessionalFormSchema),
    mode: "onTouched",
    defaultValues: professionalDefaults(profile, catalog),
  });
  const { control, formState } = form;

  const submit = form.handleSubmit((values) => save(toProfessionalRequest(values)));

  return (
    <ProfileEditorForm
      form={form}
      onSave={submit}
      saving={saving}
      error={error}
      testID="professional-editor"
    >
      <View style={styles.field}>
        <SectionLabel label={t("profile.professional.years")} />
        <Controller
          control={control}
          name="experienceYears"
          render={({ field: { value, onChange } }) => <YearsStepper value={value} onChange={onChange} />}
        />
      </View>

      <Controller
        control={control}
        name="description"
        render={({ field: { value, onChange, onBlur } }) => (
          <Input
            variant="solid"
            multiline
            label={t("profile.professional.description")}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            maxLength={DESCRIPTION_MAX_LENGTH}
            error={fieldError(formState.errors.description?.message)}
          />
        )}
      />

      <View style={styles.field}>
        <SectionLabel label={t("profile.professional.specialties")} />
        <Controller
          control={control}
          name="sports"
          render={({ field: { value, onChange } }) => (
            <SpecialtyPicker catalog={catalog} value={value} onChange={onChange} />
          )}
        />
      </View>
    </ProfileEditorForm>
  );
}
