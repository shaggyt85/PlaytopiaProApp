import { Text } from "@/shared/components/Text";

interface SectionLabelProps {
  /** Ya traducido: «Mi agenda», «Club», «Alumnos»… Se pinta en mayúsculas. */
  label: string;
}

/**
 * El título de una sección (`text-[10px] font-bold uppercase tracking-wider
 * text-muted-foreground`): «MI AGENDA» encima de la navegación y cada sección
 * del detalle. Con el rol de cabecera, el lector de pantalla salta de una a otra.
 */
export function SectionLabel({ label }: SectionLabelProps) {
  return (
    <Text variant="chip" color="textSecondary" accessibilityRole="header">
      {label}
    </Text>
  );
}
