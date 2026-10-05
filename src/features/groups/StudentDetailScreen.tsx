import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, View } from "react-native";

import { DataState } from "@/shared/components/DataState";
import { DetailFrame } from "@/shared/components/DetailFrame";
import { EmptyNote } from "@/shared/components/EmptyNote";
import { NotFoundState } from "@/shared/components/NotFoundState";
import { useGoBack } from "@/shared/hooks/useGoBack";
import { useOpenClass } from "@/shared/hooks/useOpenClass";
import { useScheduleClubs } from "@/shared/hooks/useScheduleClubs";
import { useTranslation } from "@/shared/hooks/useTranslation";
import type { ClassStudent } from "@/shared/schemas/schedule.schema";
import { getErrorMessage } from "@/shared/utils/getErrorMessage";
import { splitRecoveries } from "@/shared/utils/splitRecoveries";

import { AttendanceHistoryCard, GroupSummaryCard, NextSessionCard, StudentHeader } from "./components";
import { useGroupDetail } from "./hooks/useGroupDetail";
import { useStudentAttendance } from "./hooks/useStudentAttendance";
import { groupDetailHref } from "./utils/groupRoute";
import type { TeacherGroup } from "./utils/groupsFromAgenda";
import { StudentDetailParamsSchema, type StudentDetailParams } from "./utils/studentRoute";

import { useStyles } from "./StudentDetailScreen.styles";

/**
 * La ficha de un alumno en su grupo, como el prototipo, encima de las pestañas
 * como el detalle del grupo: su cabecera con su nivel, «Su grupo», su
 * asistencia en las últimas clases del grupo con el aviso de sus faltas y la
 * próxima clase. El alumno y el grupo salen de la misma agenda que el detalle
 * del grupo (`useGroupDetail`); la asistencia, de la consulta del grupo entero
 * (`useStudentAttendance`).
 *
 * «Alumno no encontrado» si los parámetros no valen, si el grupo ya no tiene
 * clases por delante o si el alumno ya no está en él.
 */
export function StudentDetailScreen() {
  const params = StudentDetailParamsSchema.safeParse(useLocalSearchParams());
  return params.success ? <StudentDetail {...params.data} /> : <StudentNotFound />;
}

function StudentDetail({ dbId, groupId, studentId }: StudentDetailParams) {
  const { t } = useTranslation();
  const { group, hasData, error, refetch } = useGroupDetail(dbId, groupId);
  // Su posición entre los del grupo da su color, el mismo que en «Alumnos del grupo».
  const members = group ? splitRecoveries(group.next.students).members : [];
  const index = members.findIndex((s) => s.student_id === studentId);

  return (
    <DetailFrame testID="student-detail-screen">
      <DataState hasData={hasData} error={error} onRetry={refetch}>
        {group && index >= 0 ? (
          <StudentFile group={group} groupId={groupId} student={members[index]} index={index} />
        ) : (
          <NotFoundState title={t("groups.student.notFound")} />
        )}
      </DataState>
    </DetailFrame>
  );
}

interface StudentFileProps {
  group: TeacherGroup;
  groupId: number;
  student: ClassStudent;
  index: number;
}

/** Lo que se ve cuando el alumno está en el grupo. */
function StudentFile({ group, groupId, student, index }: StudentFileProps) {
  const styles = useStyles();
  const router = useRouter();
  const goBack = useGoBack();
  const openClass = useOpenClass();
  const { clubOf } = useScheduleClubs();
  const { next } = group;
  const { attendance, error } = useStudentAttendance(
    { dbId: next.db_id, groupId, classId: next.id },
    student.student_id,
  );

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <StudentHeader student={student} index={index} onBack={goBack} />
      <View style={styles.sections}>
        <GroupSummaryCard
          group={group}
          clubLabel={clubOf(next).label}
          // Al detalle del grupo: hacia atrás si se vino de él; si no, en lugar de la ficha.
          onPress={() => router.dismissTo(groupDetailHref(next.db_id, groupId))}
        />
        {attendance && attendance.recent.length > 0 ? (
          <AttendanceHistoryCard attendance={attendance} />
        ) : error ? (
          <EmptyNote message={getErrorMessage(error)} testID="attendance-error" />
        ) : null}
        <NextSessionCard next={next} onPress={() => openClass(next)} />
      </View>
    </ScrollView>
  );
}

function StudentNotFound() {
  const { t } = useTranslation();
  return (
    <DetailFrame testID="student-detail-screen">
      <NotFoundState title={t("groups.student.notFound")} />
    </DetailFrame>
  );
}
