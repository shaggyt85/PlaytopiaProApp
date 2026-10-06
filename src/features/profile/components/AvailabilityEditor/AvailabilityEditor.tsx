import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { View } from "react-native";

import { DataState } from "@/shared/components/DataState";
import { SectionLabel } from "@/shared/components/SectionLabel";
import { Text } from "@/shared/components/Text";
import { useScheduleClubs } from "@/shared/hooks/useScheduleClubs";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { formatWeekdayInitials } from "@/shared/utils/formatDate";
import { getErrorMessage } from "@/shared/utils/getErrorMessage";
import { sedeKey } from "@/shared/utils/sedeKey";

import { useProfileDetails } from "../../hooks/useProfileDetails";
import { useSaveAvailability } from "../../hooks/useSaveAvailability";
import type { ClubAvailability } from "../../schemas/profileDetails.schema";
import { WEEK_DISPLAY_ORDER, type WeekDay, type WeeklyHours } from "../../schemas/weeklyHours.schema";
import { dayRangesLabel } from "../../utils/dayRangesLabel";
import { profileClubLabel } from "../../utils/profileClubLabel";
import { applyBands, bandsOf, TIME_BANDS, type BandId, type BandSelection } from "../../utils/timeBands";
import { ProfileEditorForm } from "../ProfileEditorForm";
import type { ProfileEditorProps } from "../ProfileEditorSheet/profileEditors";
import { ToggleChip } from "../ToggleChip";

import { useStyles } from "./AvailabilityEditor.styles";

/**
 * Editor de la disponibilidad, con la configuración de la app de alumnos y el
 * aspecto de la Pro: la sede (si trabaja en varias), las franjas y los días
 * («Por franja») y «Tu semana» con los tramos de cada día. Las sedes y sus
 * semanas salen de la misma caché que la tarjeta (`useProfileDetails`).
 */
export function AvailabilityEditor({ onDone }: ProfileEditorProps) {
  const details = useProfileDetails();
  return (
    <DataState hasData={details.data !== undefined} error={details.error} onRetry={details.refetch}>
      {details.data ? <AvailabilityForm clubs={details.data.availability} onDone={onDone} /> : null}
    </DataState>
  );
}

const toggle = <T,>(list: readonly T[], item: T): T[] =>
  list.includes(item) ? list.filter((x) => x !== item) : [...list, item];

interface AvailabilityFormProps {
  clubs: readonly ClubAvailability[];
  onDone: () => void;
}

/**
 * Lo que se guarda es la semana (`week`, el valor del formulario). Lo marcado en
 * «Por franja» es su entrada (se pueden marcar días antes que franjas) y la
 * semana se recalcula de ello en cada cambio (`applyBands`). Al abrir una sede,
 * lo marcado sale de su semana guardada (`bandsOf`).
 */
function AvailabilityForm({ clubs, onDone }: AvailabilityFormProps) {
  const styles = useStyles();
  const { t } = useTranslation();
  const { clubOf } = useScheduleClubs();
  const save = useSaveAvailability();
  const [clubKey, setClubKey] = useState(clubs[0] ? sedeKey(clubs[0]) : "");
  const club = clubs.find((c) => sedeKey(c) === clubKey);
  const form = useForm<{ week: WeeklyHours }>({ defaultValues: { week: club?.week ?? {} } });
  const [selection, setSelection] = useState<BandSelection>(() => bandsOf(club?.week ?? {}));
  const week = useWatch({ control: form.control, name: "week" });
  const letters = formatWeekdayInitials();

  if (!club) {
    return (
      <Text variant="caption" color="textSecondary">
        {t("profile.clubs.empty")}
      </Text>
    );
  }

  const select = (next: BandSelection) => {
    setSelection(next);
    form.setValue("week", applyBands(next), { shouldDirty: true });
  };

  // Otra sede: su semana guardada; lo no guardado de la anterior se pierde, como en la app de alumnos.
  const changeClub = (next: ClubAvailability) => {
    setClubKey(sedeKey(next));
    form.reset({ week: next.week });
    setSelection(bandsOf(next.week));
  };

  const submit = form.handleSubmit(async ({ week: saved }) => {
    // El error queda en save.error y sale abajo.
    const done = await save.mutateAsync({ dbId: club.db_id, clubId: club.club_id, week: saved }).catch(() => undefined);
    if (done) onDone();
  });

  const daysWithHours = WEEK_DISPLAY_ORDER.filter((day) => (week[day]?.length ?? 0) > 0);

  return (
    <ProfileEditorForm
      form={form}
      onSave={submit}
      saving={save.isPending}
      error={save.error ? getErrorMessage(save.error) : null}
      testID="availability-editor"
    >
      {clubs.length > 1 ? (
        <View style={styles.block}>
          <SectionLabel label={t("profile.availability.club")} />
          <View style={styles.chips}>
            {clubs.map((c) => (
              <ToggleChip
                key={sedeKey(c)}
                label={profileClubLabel(c, clubOf)}
                selected={sedeKey(c) === clubKey}
                onPress={() => changeClub(c)}
              />
            ))}
          </View>
        </View>
      ) : null}

      <View style={styles.block}>
        <SectionLabel label={t("profile.availability.bandsTitle")} />
        <View style={styles.chips}>
          {TIME_BANDS.map((band) => (
            <ToggleChip
              key={band.id}
              label={t(band.label)}
              selected={selection.bands.includes(band.id)}
              onPress={() => select({ ...selection, bands: toggle<BandId>(selection.bands, band.id) })}
            />
          ))}
        </View>
      </View>

      <View style={styles.block}>
        <SectionLabel label={t("profile.availability.daysTitle")} />
        <View style={styles.chips}>
          {WEEK_DISPLAY_ORDER.map((day, index) => (
            <ToggleChip
              key={day}
              label={letters[index]}
              accessibilityLabel={t(`profile.availability.weekdays.${day}`)}
              selected={selection.days.includes(day)}
              onPress={() => select({ ...selection, days: toggle<WeekDay>(selection.days, day) })}
            />
          ))}
        </View>
      </View>

      <View style={styles.week} testID="availability-week">
        <SectionLabel label={t("profile.availability.weekTitle")} />
        {daysWithHours.length > 0 ? (
          daysWithHours.map((day) => (
            <Text key={day} variant="caption">
              {dayRangesLabel(day, week[day] ?? [], t)}
            </Text>
          ))
        ) : (
          <Text variant="caption" color="textSecondary">
            {t("profile.availability.empty")}
          </Text>
        )}
      </View>
    </ProfileEditorForm>
  );
}
