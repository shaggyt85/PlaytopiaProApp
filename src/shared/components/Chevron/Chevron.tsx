import { IconLoChevronRight } from "@playtopia/icons/react-native";

import { useTheme } from "@/shared/hooks/useTheme";
import { withAlpha } from "@/shared/utils/color";

/** `sm` (`h-4 w-4`), la de filas y paneles; `md` (`h-5 w-5`), la de las tarjetas grandes. */
const CHEVRON_SIZES = { sm: 16, md: 20 } as const;

interface ChevronProps {
  size?: keyof typeof CHEVRON_SIZES;
  /** Más apagada sobre un fondo de color (`text-muted-foreground/70`): de 0 a 1. */
  alpha?: number;
}

/**
 * La › de lo que se toca para abrir algo, en el gris del texto secundario.
 * Único sitio que la dibuja: las filas y tarjetas de la agenda, de «Mis grupos»,
 * del detalle de un grupo y de la ficha de un alumno.
 */
export function Chevron({ size = "sm", alpha }: ChevronProps) {
  const theme = useTheme();
  const color = theme.colors.textSecondary;
  return <IconLoChevronRight size={CHEVRON_SIZES[size]} color={alpha === undefined ? color : withAlpha(color, alpha)} />;
}
