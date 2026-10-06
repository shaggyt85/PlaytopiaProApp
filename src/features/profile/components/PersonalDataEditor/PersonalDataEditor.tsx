import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { PersonalDataFields } from "@/shared/components/PersonalDataFields";
import {
  PersonalDataFormSchema,
  toPersonalDataRequest,
  type PersonalDataForm,
  type PersonalDataFormInput,
} from "@/shared/schemas/personalData.schema";
import { isProblem } from "@/shared/utils/isProblem";

import { useEditorSave } from "../../hooks/useEditorSave";
import { useUpdateProfile } from "../../hooks/useUpdateProfile";
import { personalDataDefaults } from "../../utils/personalDataDefaults";
import { ProfileEditorForm } from "../ProfileEditorForm";
import type { ProfileEditorProps } from "../ProfileEditorSheet/profileEditors";

/** El email ya es de otra cuenta: se marca en su campo, no abajo. */
const EMAIL_TAKEN = "email-already-registered";
const isEmailTaken = (error: unknown) => isProblem(error, EMAIL_TAKEN);

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

  const { save, saving, error } = useEditorSave(update, onDone, { inField: isEmailTaken });

  const submit = form.handleSubmit(async (values) => {
    const failure = await save(toPersonalDataRequest(values));
    if (isEmailTaken(failure)) form.setError("email", { message: `errors.byType.${EMAIL_TAKEN}` });
  });

  return (
    <ProfileEditorForm form={form} onSave={submit} saving={saving} error={error} testID="personal-data-editor">
      <PersonalDataFields />
    </ProfileEditorForm>
  );
}
