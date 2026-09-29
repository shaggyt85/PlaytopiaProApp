import { StyleSheet } from "react-native";

import { makeStyles } from "@/shared/hooks/makeStyles";

/** Icono de cada pestaña (el `h-3.5 w-3.5` de Lovable). */
export const TAB_ICON_SIZE = 14;
/** Hueco entre el icono y el texto (el `gap-1.5` de Lovable). */
const ICON_GAP = 6;

export const useStyles = makeStyles((theme) => ({
  // `flex gap-1 rounded-2xl bg-surface p-1 ring-soft` de Lovable; el `ring-soft`
  // se aproxima con un borde fino, como en la tarjeta de sede.
  container: {
    flexDirection: "row",
    gap: theme.spacing.xs,
    padding: theme.spacing.xs,
    borderRadius: theme.radius.xxl,
    borderWidth: 1,
    borderColor: theme.colors.hairline,
    backgroundColor: theme.colors.surface,
  },
  // Lovable deja la pestaña en unos 36 de alto: aquí, el área táctil mínima.
  tab: { flex: 1, minHeight: theme.touchTarget, borderRadius: theme.radius.xl },
  active: theme.shadows.glow,
  fill: { ...StyleSheet.absoluteFill, borderRadius: theme.radius.xl },
  content: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: ICON_GAP,
    paddingHorizontal: theme.spacing.md,
  },
  label: { flexShrink: 1 },
}));
