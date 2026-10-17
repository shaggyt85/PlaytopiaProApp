import { zodResolver } from "@hookform/resolvers/zod";
import { IconLoTrash2 } from "@playtopia/icons/react-native";
import { useForm } from "react-hook-form";

import { ControlledField } from "@/shared/components/ControlledField";
import { Input } from "@/shared/components/Input";
import { Text } from "@/shared/components/Text";
import { useTranslation } from "@/shared/hooks/useTranslation";

import { useDeleteAccount } from "../../hooks/useDeleteAccount";
import { useEditorSave } from "../../hooks/useEditorSave";
import {
  DeleteAccountFormSchema,
  REASON_MAX_LENGTH,
  type DeleteAccountForm,
} from "../../schemas/accountDeletion.schema";
import { confirmDestructive } from "../../utils/confirmDestructive";
import { ProfileEditorForm } from "../ProfileEditorForm";
import type { ProfileEditorProps } from "../ProfileEditorSheet/profileEditors";

/**
 * La baja de la cuenta, en el panel de Perfil: qué pasa, el motivo (Core lo
 * pide, de 10 a 1000 caracteres) y «Borrar cuenta», que aún pide confirmar en
 * un `Alert` nativo. Lo que pasa después lo hace `useDeleteAccount`.
 */
export function DeleteAccountEditor({ onDone }: ProfileEditorProps) {
  const { t } = useTranslation();
  const { save, saving, error } = useEditorSave(useDeleteAccount(), onDone);
  const form = useForm<DeleteAccountForm>({
    resolver: zodResolver(DeleteAccountFormSchema),
    mode: "onTouched",
    defaultValues: { reason: "" },
  });

  const submit = form.handleSubmit(({ reason }) =>
    confirmDestructive(
      {
        title: t("profile.deleteAccount.confirm"),
        message: t("profile.deleteAccount.confirmMessage"),
        confirm: t("profile.deleteAccount.title"),
        onConfirm: () => void save(reason),
      },
      t,
    ),
  );

  return (
    <ProfileEditorForm
      form={form}
      onSave={submit}
      saving={saving}
      error={error}
      submit={{ title: t("profile.deleteAccount.title"), variant: "dangerOutline", Icon: IconLoTrash2 }}
      testID="delete-account-editor"
    >
      <Text color="textSecondary">{t("profile.deleteAccount.warning")}</Text>
      <ControlledField
        control={form.control}
        name="reason"
        render={({ value, onChange, onBlur, error }) => (
          <Input
            variant="solid"
            multiline
            label={t("profile.deleteAccount.reason")}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            maxLength={REASON_MAX_LENGTH}
            error={error}
          />
        )}
      />
    </ProfileEditorForm>
  );
}
