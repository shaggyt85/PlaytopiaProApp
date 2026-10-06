import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { View } from "react-native";

import { Button } from "@/shared/components/Button";
import { FormError } from "@/shared/components/FormError";
import { PersonalDataFields } from "@/shared/components/PersonalDataFields";
import { useTranslation } from "@/shared/hooks/useTranslation";
import {
  PersonalDataFormSchema,
  toPersonalDataRequest,
  type PersonalDataForm,
  type PersonalDataFormInput,
} from "@/shared/schemas/personalData.schema";
import type { TeacherProfile } from "@/shared/schemas/teacherProfile.schema";
import { getErrorMessage } from "@/shared/utils/getErrorMessage";
import { isProblem } from "@/shared/utils/isProblem";

import { useUpdateProfile } from "../../hooks/useUpdateProfile";
import { personalDataDefaults } from "../../utils/personalDataDefaults";

import { useStyles } from "./PersonalDataEditor.styles";

/** El email ya es de otra cuenta: se marca en su campo, no abajo. */
const EMAIL_TAKEN = "email-already-registered";

interface PersonalDataEditorProps {
  profile: TeacherProfile;
  /** Al guardar: el panel se cierra. */
  onDone: () => void;
}

/**
 * Editor de los datos personales: los mismos campos y reglas que el alta
 * (`PersonalDataFields`, `PersonalDataFormSchema`), rellenos con lo guardado
 * (`personalDataDefaults`). «Guardar» envía el `PATCH` y cierra; mientras
 * guarda no se puede volver a pulsar. Si el email es de otra cuenta, lo dice
 * en el campo; cualquier otro error, abajo, traducido por su `type`.
 */
export function PersonalDataEditor({ profile, onDone }: PersonalDataEditorProps) {
  const styles = useStyles();
  const { t } = useTranslation();
  const update = useUpdateProfile();
  const form = useForm<PersonalDataFormInput, unknown, PersonalDataForm>({
    resolver: zodResolver(PersonalDataFormSchema),
    mode: "onTouched",
    defaultValues: personalDataDefaults(profile),
  });

  const save = form.handleSubmit(async (values) => {
    try {
      await update.mutateAsync(toPersonalDataRequest(values));
      onDone();
    } catch (error) {
      if (isProblem(error, EMAIL_TAKEN)) form.setError("email", { message: `errors.byType.${EMAIL_TAKEN}` });
    }
  });

  const otherError = update.error && !isProblem(update.error, EMAIL_TAKEN) ? getErrorMessage(update.error) : null;

  return (
    <FormProvider {...form}>
      <View style={styles.form} testID="personal-data-editor">
        <PersonalDataFields />
        <View style={styles.save}>
          <Button title={t("common.save")} onPress={save} loading={update.isPending} />
        </View>
        <FormError message={otherError} />
      </View>
    </FormProvider>
  );
}
