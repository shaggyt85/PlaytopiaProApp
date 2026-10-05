import { useLocalSearchParams } from "expo-router";
import type { ReactNode } from "react";
import type { z } from "zod";

import { DetailFrame } from "@/shared/components/DetailFrame";
import { NotFoundState } from "@/shared/components/NotFoundState";

interface DetailRouteProps<S extends z.ZodType> {
  /** Los parámetros de la ruta, que llegan como texto: el esquema los valida y los convierte. */
  schema: S;
  /** El de la pantalla: también lo lleva su «no encontrado». */
  testID: string;
  /** Ya traducido: «Clase no encontrada», «Grupo no encontrado»… */
  notFound: string;
  /** La pantalla, con sus parámetros ya válidos. */
  children: (params: z.infer<S>) => ReactNode;
}

/**
 * Abrir una pantalla de detalle desde su ruta: si los parámetros valen, la
 * pantalla con ellos; si no (un enlace roto, un id que no es un número), su «no
 * encontrado» con «Volver», en su marco. Único sitio que lo hace: el detalle de
 * una clase, el de un grupo y la ficha de un alumno.
 */
export function DetailRoute<S extends z.ZodType>({ schema, testID, notFound, children }: DetailRouteProps<S>) {
  const params = schema.safeParse(useLocalSearchParams());
  if (params.success) return <>{children(params.data)}</>;
  return (
    <DetailFrame testID={testID}>
      <NotFoundState title={notFound} />
    </DetailFrame>
  );
}
