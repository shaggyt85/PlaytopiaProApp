import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { PersonalDataFields } from "@/shared/components/PersonalDataFields";
import {
  PersonalDataFormSchema,
  toPersonalDataRequest,
  type PersonalDataForm,
  type PersonalDataFormInput,
} from "@/shared/schemas/personalData.schema";
import { getErrorMessage } from "@/shared/utils/getErrorMessage";
import { isProblem } from "@/shared/utils/isProblem";

import { useUpdateProfile } from "../../hooks/useUpdateProfile";
import { personalDataDefaults } from "../../utils/personalDataDefaults";
import { ProfileEditorForm } from "../ProfileEditorForm";
import type { ProfileEditorProps } from "../ProfileEditorSheet/profileEditors";

/** El email ya es de otra cuenta: se marca en su campo, no abajo. */
const EMAIL_TAKEN = "email-already-registered";

/**
 * Editor de los datos personales: los mismos campos y reglas que el alta
 * (`PersonalDataFields`, `PersonalDataFormSchema`), rellenos con lo guardado
 * (`personalDataDefaults`), en el esqueleto de los editores
 * (`ProfileEditorForm`). Si el email es de otra cuenta, lo dice en el campo;
 * cualquier otro error, abajo, traducido por su `type`.
 */
export function PersonalDataEditor({ profile, onDone }: ProfileEditorProps) {
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
    <ProfileEditorForm form={form} onSave={save} saving={update.isPending} error={otherError} testID="personal-data-editor">
      <PersonalDataFields />
    </ProfileEditorForm>
  );
}
