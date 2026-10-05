import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BlurTarget, BlurTargetProvider } from "@/shared/components/BlurTarget";
import { BrandBackground } from "@/shared/components/BrandBackground";
import { DataState } from "@/shared/components/DataState";
import { EmptyState } from "@/shared/components/EmptyState";
import { useForegroundNow } from "@/shared/hooks/useForegroundNow";
import { useScheduleClubs } from "@/shared/hooks/useScheduleClubs";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { ClassDetailParamsSchema, type ClassDetailParams } from "@/shared/utils/classRoute";

import {
  AttendanceCount,
  ClassHero,
  DetailSection,
  PreviousClassCard,
  PreviousClassSheet,
  StudentList,
} from "./components";
import { useClassDetail } from "./hooks/useClassDetail";
import { useMarkStudent } from "./hooks/useMarkStudent";
import { usePreviousClass } from "./hooks/usePreviousClass";
import { attendanceSummary } from "./utils/attendanceSummary";
import { attendanceState } from "./utils/attendanceWindow";

import { useStyles } from "./ClassDetailScreen.styles";

/** Volver: a donde se vino o, si no hay (se abrió desde un aviso), a la Agenda. */
function useGoBack() {
  const router = useRouter();
  return useCallback(() => (router.canGoBack() ? router.back() : router.replace("/")), [router]);
}

/**
 * El detalle de una clase, encima de las pestañas y sin barra: su cabecera, sus
 * alumnos con su asistencia y la última clase de su grupo, que abre su lista en
 * un panel. Lo que aún no tiene datos en Core (objetivos, notas, el feedback…)
 * no se enseña; cada cosa llega con su fase.
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
  // «Ahora» del servidor, cada minuto: los botones salen y se quitan solos
  // cuando Core abre y cierra la asistencia (su ventana viene en cada clase).
  const now = useForegroundNow({ everyMinute: true });
  const attendance = item ? attendanceState(item, now) : "notYet";
  const onMark = useMarkStudent(dbId, attendance);
  const previous = usePreviousClass(dbId, classId);
  const previousAttendance = previous ? attendanceState(previous, now) : "notYet";
  const onMarkPrevious = useMarkStudent(previous?.db_id ?? dbId, previousAttendance);
  const [previousOpen, setPreviousOpen] = useState(false);
  const closePrevious = useCallback(() => setPreviousOpen(false), []);

  return (
    <DetailFrame
      sheet={
        <PreviousClassSheet
          item={previous}
          attendance={previousAttendance}
          onMark={onMarkPrevious}
          visible={previousOpen}
          onClose={closePrevious}
        />
      }
    >
      <DataState hasData={hasData} error={error} onRetry={refetch}>
        {item && colors ? (
          <ScrollView contentContainerStyle={styles.content}>
            <ClassHero item={item} clubLabel={clubOf(item).label} colors={colors} onBack={goBack} />
            <DetailSection
              title={t("schedule.detail.students")}
              aside={item.students.length > 0 ? <AttendanceCount summary={attendanceSummary(item.students)} /> : null}
              testID="students-section"
            >
              <StudentList students={item.students} attendance={attendance} onMark={onMark} />
            </DetailSection>
            {previous ? (
              <DetailSection title={t("schedule.detail.lastClass")} testID="previous-section">
                <PreviousClassCard item={previous} onPress={() => setPreviousOpen(true)} />
              </DetailSection>
            ) : null}
          </ScrollView>
        ) : (
          <ClassNotFoundState onBack={goBack} />
        )}
      </DataState>
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

/**
 * El fondo de marca y las zonas seguras: el detalle va fuera de las pestañas,
 * que ponen el suyo. Su panel (`sheet`) va fuera del `BlurTarget` de la
 * pantalla, que es lo que desenfoca al abrirse.
 */
function DetailFrame({ children, sheet }: { children: React.ReactNode; sheet?: React.ReactNode }) {
  const styles = useStyles();
  return (
    <BrandBackground testID="class-detail-screen">
      <BlurTargetProvider>
        <BlurTarget>
          <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
            {children}
          </SafeAreaView>
        </BlurTarget>
        {sheet}
      </BlurTargetProvider>
    </BrandBackground>
  );
}
