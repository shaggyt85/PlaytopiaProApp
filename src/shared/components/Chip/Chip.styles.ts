import type { TextVariant, Theme } from "@/shared/config/theme";
import { makeStyles } from "@/shared/hooks/makeStyles";
import { withAlpha } from "@/shared/utils/color";

/** Tamaño del punto del chip (el `●` de Lovable). */
const DOT = 6;

/** El color de un chip: el de marca, el oro de las recuperaciones o el neutro de una etiqueta. */
export type ChipTone = "primary" | "gold" | "neutral";

/**
 * Cada tono en un solo sitio: su color (texto y punto) y su letra. Los de color
 * van en mayúsculas sobre su color al 20 %; el neutro (`bg-surface-2
 * text-[11px] font-semibold`, las especialidades de Perfil) es una etiqueta
 * normal sobre la superficie.
 */
const TONES = {
  primary: { color: (theme: Theme) => theme.colors.primary, variant: "chip" },
  gold: { color: (theme: Theme) => theme.accents.gold.color, variant: "chip" },
  neutral: { color: (theme: Theme) => theme.colors.text, variant: "metaStrong" },
} as const satisfies Record<ChipTone, { color: (theme: Theme) => string; variant: TextVariant }>;

/** El color del texto y del punto de cada tono. */
export const chipColor = (theme: Theme, tone: ChipTone): string => TONES[tone].color(theme);

/** La letra de cada tono. */
export const chipVariant = (tone: ChipTone): TextVariant => TONES[tone].variant;

export const useStyles = makeStyles((theme) => ({
  // `rounded-full px-2 py-0.5` de Lovable.
  container: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs / 2,
    borderRadius: theme.radius.pill,
  },
  primary: { backgroundColor: withAlpha(chipColor(theme, "primary"), 0.2) },
  gold: { backgroundColor: withAlpha(chipColor(theme, "gold"), 0.2) },
  // `rounded-full bg-surface-2 px-2.5 py-1`.
  neutral: {
    backgroundColor: theme.colors.surfaceStrong,
    paddingHorizontal: theme.spacing.sm + theme.spacing.xs / 2,
    paddingVertical: theme.spacing.xs,
  },
  dot: {
    width: DOT,
    height: DOT,
    borderRadius: DOT / 2,
  },
}));
