import { IconLoActivity, IconLoChevronLeft } from "@playtopia/icons/react-native";
import { useLocalSearchParams } from "expo-router";
import { ScrollView, View } from "react-native";

import { DataState } from "@/shared/components/DataState";
import { DetailFrame } from "@/shared/components/DetailFrame";
import { EmptyState } from "@/shared/components/EmptyState";
import { IconButton } from "@/shared/components/IconButton";
import { Text } from "@/shared/components/Text";
import { useGoBack } from "@/shared/hooks/useGoBack";
import { useOpenClass } from "@/shared/hooks/useOpenClass";
import { useScheduleClubs } from "@/shared/hooks/useScheduleClubs";
import { useTheme } from "@/shared/hooks/useTheme";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { joinParts } from "@/shared/utils/joinParts";

import { GroupStudentsCard, NextSessionCard } from "./components";
import { useGroupDetail } from "./hooks/useGroupDetail";
import { groupColors } from "./utils/groupColors";
import { GroupDetailParamsSchema, type GroupDetailParams } from "./utils/groupRoute";
import type { TeacherGroup } from "./utils/groupsFromAgenda";
import { groupWhen } from "./utils/groupWhen";

import { BACK_SIZE, LEVEL_ICON_SIZE, useStyles } from "./GroupDetailScreen.styles";

/**
 * El detalle de un grupo, como el prototipo, encima de las pestañas como el de
 * una clase: ‹, su nombre con el punto de su color y su nivel, la sede y la
 * pista, cuándo es y cuántos alumnos tiene; «Alumnos del grupo» y su próxima
 * clase, que abre su detalle. Todo de su próxima clase (`useGroupDetail`).
 *
 * Los parámetros de la ruta llegan como texto: si no son válidos, «Grupo no
 * encontrado», igual que si el grupo ya no tiene clases por delante.
 *
 * Provisional: el nivel lleva `IconLoActivity` hasta que `@playtopia/icons`
 * publique `IconLoBarChart2` (1.10.0).
 */
export function GroupDetailScreen() {
  const params = GroupDetailParamsSchema.safeParse(useLocalSearchParams());
  return params.success ? <GroupDetail {...params.data} /> : <GroupNotFound />;
}

function GroupDetail({ dbId, groupId }: GroupDetailParams) {
  const styles = useStyles();
  const goBack = useGoBack();
  const { group, hasData, error, refetch } = useGroupDetail(dbId, groupId);

  return (
    <DetailFrame testID="group-detail-screen">
      <DataState hasData={hasData} error={error} onRetry={refetch}>
        {group ? (
          <ScrollView contentContainerStyle={styles.content}>
            <GroupHeader group={group} onBack={goBack} />
            <GroupBody group={group} />
          </ScrollView>
        ) : (
          <GroupNotFoundState onBack={goBack} />
        )}
      </DataState>
    </DetailFrame>
  );
}

/** ‹, el nombre con su punto y su nivel, la sede y la pista, cuándo y cuántos alumnos tiene. */
function GroupHeader({ group, onBack }: { group: TeacherGroup; onBack: () => void }) {
  const styles = useStyles();
  const theme = useTheme();
  const { t } = useTranslation();
  const { clubOf } = useScheduleClubs();
  const { next } = group;
  const members = next.students.filter((s) => !s.is_recovery).length;

  return (
    <View>
      <IconButton Icon={IconLoChevronLeft} size={BACK_SIZE} accessibilityLabel={t("common.back")} onPress={onBack} />
      <View style={styles.titleRow}>
        <View style={[styles.dot, { backgroundColor: groupColors(next, theme.clubColors).color }]} />
        <Text variant="title" accessibilityRole="header" style={styles.title}>
          {next.title}
        </Text>
        <View style={styles.level} accessible accessibilityLabel={t("schedule.next.level", { range: next.level_range })}>
          <IconLoActivity size={LEVEL_ICON_SIZE} color={theme.colors.primary} />
          <Text variant="subtitle">{next.level_range}</Text>
        </View>
      </View>
      <Text variant="label" color="textSecondary" style={styles.place}>
        {joinParts([clubOf(next).label, next.track_name])}
      </Text>
      <Text variant="label" color="textSecondary">
        {groupWhen(group, t)}
      </Text>
      <Text variant="rowLabel" style={styles.members}>
        {t("groups.detail.members", { count: members })}
      </Text>
    </View>
  );
}

/** «Alumnos del grupo» (sin los que vienen a recuperar) y su próxima clase. */
function GroupBody({ group }: { group: TeacherGroup }) {
  const styles = useStyles();
  const openClass = useOpenClass();
  const { next } = group;

  return (
    <View style={styles.sections}>
      <GroupStudentsCard students={next.students.filter((s) => !s.is_recovery)} />
      <NextSessionCard next={next} onPress={() => openClass(next)} />
    </View>
  );
}

function GroupNotFound() {
  return (
    <DetailFrame testID="group-detail-screen">
      <GroupNotFoundState onBack={useGoBack()} />
    </DetailFrame>
  );
}

function GroupNotFoundState({ onBack }: { onBack: () => void }) {
  const { t } = useTranslation();
  return <EmptyState title={t("groups.detail.notFound")} actionLabel={t("common.back")} onAction={onBack} />;
}
