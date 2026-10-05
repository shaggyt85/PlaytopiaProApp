import { EmptyState } from "@/shared/components/EmptyState";
import { useGoBack } from "@/shared/hooks/useGoBack";
import { useTranslation } from "@/shared/hooks/useTranslation";

/**
 * Lo que enseña una pantalla de detalle cuando lo que se abre no está (los
 * parámetros de la ruta no valen, o los datos ya no lo traen): su título («Clase
 * no encontrada») y «Volver». Único sitio que lo dibuja: el detalle de una clase,
 * el de un grupo y la ficha de un alumno.
 */
export function NotFoundState({ title }: { title: string }) {
  const { t } = useTranslation();
  return <EmptyState title={title} actionLabel={t("common.back")} onAction={useGoBack()} />;
}
