import { IconLoChevronLeft } from "@playtopia/icons/react-native";
import { useLocalSearchParams } from "expo-router";
import { ScrollView, View } from "react-native";

import { DataState } from "@/shared/components/DataState";
import { DetailFrame } from "@/shared/components/DetailFrame";
import { IconButton } from "@/shared/components/IconButton";
import { IconText } from "@/shared/components/IconText";
import { NotFoundState } from "@/shared/components/NotFoundState";
import { Text } from "@/shared/components/Text";
import { LEVEL_ICON } from "@/shared/config/icons";
import { useGoBack } from "@/shared/hooks/useGoBack";
import { useOpenClass } from "@/shared/hooks/useOpenClass";
import { useScheduleClubs } from "@/shared/hooks/useScheduleClubs";
import { useTheme } from "@/shared/hooks/useTheme";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { joinParts } from "@/shared/utils/joinParts";
import { splitRecoveries } from "@/shared/utils/splitRecoveries";

import { GroupStudentsCard, NextSessionCard } from "./components";
import { useGroupDetail } from "./hooks/useGroupDetail";
import { groupColors } from "./utils/groupColors";
import { GroupDetailParamsSchema, type GroupDetailParams } from "./utils/groupRoute";
import type { TeacherGroup } from "./utils/groupsFromAgenda";
import { groupWhen } from "./utils/groupWhen";

import { BACK_SIZE, useStyles } from "./GroupDetailScreen.styles";

/**
 * El detalle de un grupo, como el prototipo, encima de las pestañas como el de
 * una clase: ‹, su nombre con el punto de su color y su nivel, la sede y la
 * pista, cuándo es y cuántos alumnos tiene; «Alumnos del grupo» y su próxima
 * clase, que abre su detalle. Todo de su próxima clase (`useGroupDetail`).
 *
 * Los parámetros de la ruta llegan como texto: si no son válidos, «Grupo no
 * encontrado», igual que si el grupo ya no tiene clases por delante.
 */
export function GroupDetailScreen() {
  const params = GroupDetailParamsSchema.safeParse(useLocalSearchParams());
  return params.success ? <GroupDetail {...params.data} /> : <GroupNotFound />;
}

function GroupDetail({ dbId, groupId }: GroupDetailParams) {
  const styles = useStyles();
  const goBack = useGoBack();
  const { t } = useTranslation();
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
          <NotFoundState title={t("groups.detail.notFound")} />
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
  const members = splitRecoveries(next.students).members.length;

  return (
    <View>
      <IconButton Icon={IconLoChevronLeft} size={BACK_SIZE} accessibilityLabel={t("common.back")} onPress={onBack} />
      <View style={styles.titleRow}>
        <View style={[styles.dot, { backgroundColor: groupColors(next, theme.clubColors).color }]} />
        <Text variant="title" accessibilityRole="header" style={styles.title}>
          {next.title}
        </Text>
        <View accessible accessibilityLabel={t("schedule.next.level", { range: next.level_range })}>
          <IconText Icon={LEVEL_ICON} label={next.level_range} size="heading" color="text" iconColor="primary" />
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
      <GroupStudentsCard students={splitRecoveries(next.students).members} />
      <NextSessionCard next={next} onPress={() => openClass(next)} />
    </View>
  );
}

function GroupNotFound() {
  const { t } = useTranslation();
  return (
    <DetailFrame testID="group-detail-screen">
      <NotFoundState title={t("groups.detail.notFound")} />
    </DetailFrame>
  );
}
