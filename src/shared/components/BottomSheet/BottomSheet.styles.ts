import { StyleSheet } from "react-native";

import { makeStyles } from "@/shared/hooks/makeStyles";

// Medidas de la hoja de Lovable (`max-w-md`, `max-h-[88vh]`, barrita `h-1.5 w-10`).
/** La parte del alto de la pantalla que puede ocupar: lo que no cabe se desplaza dentro. */
export const PANEL_MAX_HEIGHT_RATIO = 0.88;
const PANEL_MAX_WIDTH = 448;
const HANDLE_WIDTH = 40;
const HANDLE_HEIGHT = 6;

export const useStyles = makeStyles((theme) => ({
  root: {
    ...StyleSheet.absoluteFill,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  overlay: {
    flex: 1,
    backgroundColor: theme.colors.sheetOverlay,
  },
  // Lo que sube con el teclado: el panel, pegado abajo.
  keyboard: { width: "100%", alignItems: "center" },
  panel: {
    width: "100%",
    maxWidth: PANEL_MAX_WIDTH,
    backgroundColor: theme.colors.card,
    borderTopLeftRadius: theme.radius.xxxl,
    borderTopRightRadius: theme.radius.xxxl,
    ...theme.ringSoft,
    borderBottomWidth: 0,
    paddingHorizontal: theme.gutter,
    paddingTop: theme.spacing.md + theme.spacing.xs,
    paddingBottom: theme.spacing.lg + theme.spacing.xs,
  },
  handle: {
    alignSelf: "center",
    width: HANDLE_WIDTH,
    height: HANDLE_HEIGHT,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.border,
    marginBottom: theme.spacing.md,
  },
  // El contenido no estira el panel más de lo que necesita.
  content: { flexGrow: 0 },
}));
