import { makeStyles } from "@/shared/hooks/makeStyles";

// Medidas de la hoja de Lovable (`max-w-md`, barrita `h-1.5 w-10`).
const PANEL_MAX_WIDTH = 448;
const HANDLE_WIDTH = 40;
const HANDLE_HEIGHT = 6;

export const useStyles = makeStyles((theme) => ({
  root: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  overlay: {
    flex: 1,
    backgroundColor: theme.colors.sheetOverlay,
  },
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
  close: {
    position: "absolute",
    top: theme.spacing.md,
    right: theme.spacing.md,
  },
}));
