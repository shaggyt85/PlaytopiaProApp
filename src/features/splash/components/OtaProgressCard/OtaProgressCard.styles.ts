import { StyleSheet } from "react-native";

import { darkTheme } from "@/shared/config/theme";
import { withAlpha } from "@/shared/utils/color";

// Medidas propias de la tarjeta (no hay token equivalente).
export const OTA_ICON_SIZE = 18;
const ICON_CIRCLE = 36;
const BAR_HEIGHT = 6;

// Con los tokens del tema, directos: va dentro del splash, que no usa hooks de estilo.
const { colors, spacing, radius, typography, shadows } = darkTheme;

export const styles = StyleSheet.create({
  card: {
    gap: spacing.sm + spacing.xs,
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.glassPanel,
    borderWidth: 1,
    borderColor: colors.hairline,
    ...shadows.glow,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm + spacing.xs,
  },
  iconCircle: {
    width: ICON_CIRCLE,
    height: ICON_CIRCLE,
    borderRadius: ICON_CIRCLE / 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: withAlpha(colors.primary, 0.2),
  },
  texts: { flex: 1, gap: 2 },
  title: { ...typography.strong, color: colors.text },
  subtitle: { ...typography.caption, color: colors.textSecondary },
  percent: { ...typography.statValue, color: colors.text },
  track: {
    height: BAR_HEIGHT,
    borderRadius: radius.pill,
    backgroundColor: colors.hairline,
    overflow: "hidden",
  },
  fill: { height: "100%", borderRadius: radius.pill },
});
