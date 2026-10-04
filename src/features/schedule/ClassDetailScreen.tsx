import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback } from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BrandBackground } from "@/shared/components/BrandBackground";
import { EmptyState } from "@/shared/components/EmptyState";
import { useTranslation } from "@/shared/hooks/useTranslation";

import { useStyles } from "./ClassDetailScreen.styles";
import { ClassHero, ClubCard, DetailSection, ScheduleDataState, StudentList } from "./components";
import { useClassDetail } from "./hooks/useClassDetail";
import { useScheduleClubs } from "./hooks/useScheduleClubs";
import { ClassDetailParamsSchema, type ClassDetailParams } from "./utils/classRoute";

/** Volver: a donde se vino o, si no hay (se abrió desde un aviso), a la Agenda. */
function useGoBack() {
  const router = useRouter();
  return useCallback(() => (router.canGoBack() ? router.back() : router.replace("/")), [router]);
}

/**
 * El detalle de una clase, encima de las pestañas y sin barra: su cabecera, su
 * club y sus alumnos. Lo que aún no tiene datos en Core (asistencia, objetivos, notas…)
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
  const { clubOf, cardOf } = useScheduleClubs();
  // Si la sede ya no está en «Mis clubes» (le acaban de dar de baja), su tarjeta no sale.
  const card = item ? cardOf(item) : undefined;

  return (
    <DetailFrame>
      <ScheduleDataState hasData={hasData} error={error} onRetry={refetch}>
        {item && colors ? (
          <ScrollView contentContainerStyle={styles.content}>
            <ClassHero item={item} clubLabel={clubOf(item).label} colors={colors} onBack={goBack} />
            {card ? (
              <DetailSection title={t("schedule.detail.club")} testID="club-section">
                <ClubCard club={clubOf(item)} card={card} />
              </DetailSection>
            ) : null}
            <DetailSection title={t("schedule.detail.students")} testID="students-section">
              <StudentList students={item.students} />
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
