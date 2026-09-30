import { Text } from "@/shared/components/Text";

interface SectionLabelProps {
  /** Ya traducido: «Clubes», «Club», «Alumnos»… Se pinta en mayúsculas. */
  label: string;
}

/**
 * El título de una sección (`text-[10px] font-bold uppercase tracking-wider
 * text-muted-foreground`): «CLUBES» en la leyenda de la agenda y cada sección
 * del detalle. Con el rol de cabecera, el lector de pantalla salta de una a otra.
 */
export function SectionLabel({ label }: SectionLabelProps) {
  return (
    <Text variant="chip" color="textSecondary" accessibilityRole="header">
      {label}
    </Text>
  );
}
