import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback } from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BrandBackground } from "@/shared/components/BrandBackground";
import { EmptyState } from "@/shared/components/EmptyState";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { selectionFeedback } from "@/shared/utils/haptics";

import { useStyles } from "./ClassDetailScreen.styles";
import { AttendanceCount, ClassHero, DetailSection, ScheduleDataState, StudentList } from "./components";
import { useClassDetail } from "./hooks/useClassDetail";
import { useForegroundNow } from "./hooks/useForegroundNow";
import { useMarkAttendance } from "./hooks/useMarkAttendance";
import { useScheduleClubs } from "./hooks/useScheduleClubs";
import type { AttendanceStatus, ClassStudent } from "./schemas/schedule.schema";
import { attendanceSummary } from "./utils/attendanceSummary";
import { classStatus } from "./utils/classTiming";
import { ClassDetailParamsSchema, type ClassDetailParams } from "./utils/classRoute";
import { wallNow } from "./utils/scheduleDates";

/**
 * Marcar a un alumno de la clase, con la vibración de elegir. La marca va a la
 * clase en la que está inscrito (su plaza, si recupera). Volver a tocar la que
 * ya tiene no pide nada. Estable: las filas no se repintan por ella.
 */
function useMarkStudent(dbId: number) {
  const { mutate } = useMarkAttendance();
  return useCallback(
    (student: ClassStudent, status: AttendanceStatus) => {
      if (student.attendance === status) return;
      selectionFeedback();
      mutate({ target: { dbId, classId: student.class_id, studentId: student.student_id }, status });
    },
    [dbId, mutate],
  );
}

/** Volver: a donde se vino o, si no hay (se abrió desde un aviso), a la Agenda. */
function useGoBack() {
  const router = useRouter();
  return useCallback(() => (router.canGoBack() ? router.back() : router.replace("/")), [router]);
}

/**
 * El detalle de una clase, encima de las pestañas y sin barra: su cabecera y
 * sus alumnos con su asistencia. Lo que aún no tiene datos en Core (objetivos,
 * notas, el feedback…) no se enseña; cada cosa llega con su fase.
 *
 * Los parámetros de la ruta llegan como texto: si no son válidos, «Clase no
 * encontrada», igual que si la respuesta del mes ya no trae la clase.
 */
export function ClassDetailScreen() {
  const params = ClassDetailParamsSchema.safeParse(useLocalSearchParams());
  return params.success ? <ClassDetail {...params.data} /> : <ClassNotFound />;
}

function ClassDetail({ dbId, classId, date }: ClassDetailParams) {
  const styles = useStyles();
  const goBack = useGoBack();
  const { t } = useTranslation();
  const { item, colors, hasData, error, refetch } = useClassDetail(dbId, classId, date);
  const { clubOf } = useScheduleClubs();
  const onMark = useMarkStudent(dbId);
  // Cada minuto: los botones aparecen solos cuando empieza la clase.
  const now = useForegroundNow({ everyMinute: true });
  // Se pasa lista desde que empieza; hasta cuándo lo decide Core (`attendance-closed`).
  const started = item ? classStatus(item, wallNow(now), undefined) !== "upcoming" : false;

  return (
    <DetailFrame>
      <ScheduleDataState hasData={hasData} error={error} onRetry={refetch}>
        {item && colors ? (
          <ScrollView contentContainerStyle={styles.content}>
            <ClassHero item={item} clubLabel={clubOf(item).label} colors={colors} onBack={goBack} />
            <DetailSection
              title={t("schedule.detail.students")}
              aside={item.students.length > 0 ? <AttendanceCount summary={attendanceSummary(item.students)} /> : null}
              testID="students-section"
            >
              <StudentList students={item.students} onMark={started ? onMark : undefined} />
            </DetailSection>
          </ScrollView>
        ) : (
          <ClassNotFoundState onBack={goBack} />
        )}
      </ScheduleDataState>
    </DetailFrame>
  );
}

function ClassNotFound() {
  return (
    <DetailFrame>
      <ClassNotFoundState onBack={useGoBack()} />
    </DetailFrame>
  );
}

function ClassNotFoundState({ onBack }: { onBack: () => void }) {
  const { t } = useTranslation();
  return <EmptyState title={t("schedule.detail.notFound")} actionLabel={t("common.back")} onAction={onBack} />;
}

/** El fondo de marca y las zonas seguras: el detalle va fuera de las pestañas, que ponen el suyo. */
function DetailFrame({ children }: { children: React.ReactNode }) {
  const styles = useStyles();
  return (
    <BrandBackground testID="class-detail-screen">
      <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
        {children}
      </SafeAreaView>
    </BrandBackground>
  );
}
