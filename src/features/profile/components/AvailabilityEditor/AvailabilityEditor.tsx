import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import { DataState } from "@/shared/components/DataState";
import { SegmentedTabs } from "@/shared/components/SegmentedTabs";
import { Text } from "@/shared/components/Text";
import { useScheduleClubs } from "@/shared/hooks/useScheduleClubs";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { getErrorMessage } from "@/shared/utils/getErrorMessage";
import { sedeKey } from "@/shared/utils/sedeKey";

import { useProfileDetails } from "../../hooks/useProfileDetails";
import { useSaveAvailability } from "../../hooks/useSaveAvailability";
import type { ClubAvailability } from "../../schemas/profileDetails.schema";
import type { WeeklyHours } from "../../schemas/weeklyHours.schema";
import { AVAILABILITY_MODES, initialMode, type AvailabilityMode } from "../../utils/availabilityModes";
import { profileClubLabel } from "../../utils/profileClubLabel";
import { BandsMode } from "../BandsMode";
import { ChipGroup } from "../ChipGroup";
import { DayMode } from "../DayMode";
import { ProfileEditorForm } from "../ProfileEditorForm";
import type { ProfileEditorProps } from "../ProfileEditorSheet/profileEditors";
import { WeekSummary } from "../WeekSummary";

/**
 * Editor de la disponibilidad, con la configuración de la app de alumnos y el
 * aspecto de la Pro. Las sedes y sus semanas salen de la misma caché que la
 * tarjeta (`useProfileDetails`).
 */
export function AvailabilityEditor({ onDone }: ProfileEditorProps) {
  const details = useProfileDetails();
  return (
    <DataState hasData={details.data !== undefined} error={details.error} onRetry={details.refetch}>
      {details.data ? <AvailabilityForm clubs={details.data.availability} onDone={onDone} /> : null}
    </DataState>
  );
}

/** Lo que pinta cada modo; los dos editan la misma semana. */
const MODE_VIEWS = { bands: BandsMode, day: DayMode } as const satisfies Record<
  AvailabilityMode,
  typeof BandsMode
>;

interface AvailabilityFormProps {
  clubs: readonly ClubAvailability[];
  onDone: () => void;
}

/**
 * La sede (si hay varias), el modo («Por franja» o «Por día»), lo del modo,
 * «Tu semana» y guardar. Lo que se guarda es la semana (el valor del
 * formulario); los modos la cambian. Al cambiar de sede se carga la suya y se
 * pierde lo no guardado, como en la app de alumnos.
 */
function AvailabilityForm({ clubs, onDone }: AvailabilityFormProps) {
  const { t } = useTranslation();
  const { clubOf } = useScheduleClubs();
  const save = useSaveAvailability();
  const [clubKey, setClubKey] = useState(clubs[0] ? sedeKey(clubs[0]) : "");
  const club = clubs.find((c) => sedeKey(c) === clubKey);
  const [mode, setMode] = useState<AvailabilityMode>(() => initialMode(club?.week ?? {}));
  const form = useForm<{ week: WeeklyHours }>({ defaultValues: { week: club?.week ?? {} } });
  const week = useWatch({ control: form.control, name: "week" });

  if (!club) {
    return (
      <Text variant="caption" color="textSecondary">
        {t("profile.clubs.empty")}
      </Text>
    );
  }

  const changeClub = (key: string) => {
    const next = clubs.find((c) => sedeKey(c) === key);
    if (!next) return;
    setClubKey(key);
    form.reset({ week: next.week });
    setMode(initialMode(next.week));
  };

  const submit = form.handleSubmit(async ({ week: saved }) => {
    // El error queda en save.error y sale abajo.
    const done = await save.mutateAsync({ dbId: club.db_id, clubId: club.club_id, week: saved }).catch(() => undefined);
    if (done) onDone();
  });

  const ModeView = MODE_VIEWS[mode];

  return (
    <ProfileEditorForm
      form={form}
      onSave={submit}
      saving={save.isPending}
      error={save.error ? getErrorMessage(save.error) : null}
      testID="availability-editor"
    >
      {clubs.length > 1 ? (
        <ChipGroup
          label={t("profile.availability.club")}
          options={clubs.map((c) => ({ key: sedeKey(c), label: profileClubLabel(c, clubOf), selected: sedeKey(c) === clubKey }))}
          onPress={changeClub}
        />
      ) : null}
      <SegmentedTabs
        options={AVAILABILITY_MODES.map((option) => ({ key: option.key, label: t(option.label) }))}
        value={mode}
        onChange={setMode}
        testID="availability-modes"
      />
      {/* Por sede y modo: al entrar en un modo, lo marcado sale de la semana de ese momento. */}
      <ModeView
        key={`${clubKey}-${mode}`}
        week={week}
        onChange={(next) => form.setValue("week", next, { shouldDirty: true })}
      />
      <WeekSummary week={week} />
    </ProfileEditorForm>
  );
}
