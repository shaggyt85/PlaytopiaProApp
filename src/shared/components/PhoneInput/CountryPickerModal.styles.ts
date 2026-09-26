import { makeStyles } from "@/shared/hooks/makeStyles";

// Medidas del selector de país de la app de alumnos.
const TOP_INSET = 48;
const SEARCH_HEIGHT = 44;
const ROW_PADDING = 14;
const FLAG_SIZE = 22;

export const useStyles = makeStyles((theme) => ({
  container: { flex: 1, backgroundColor: theme.colors.background, paddingTop: TOP_INSET },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.lg - theme.spacing.xs,
    marginBottom: theme.spacing.md - theme.spacing.xs,
  },
  close: { fontSize: FLAG_SIZE, paddingHorizontal: theme.spacing.xs },
  search: {
    ...theme.typography.body,
    height: SEARCH_HEIGHT,
    marginHorizontal: theme.spacing.lg - theme.spacing.xs,
    marginBottom: theme.spacing.md - theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.field,
    color: theme.colors.text,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: ROW_PADDING,
    paddingHorizontal: theme.spacing.lg - theme.spacing.xs,
  },
  rowSelected: { backgroundColor: theme.colors.field },
  flag: { fontSize: FLAG_SIZE, marginRight: theme.spacing.md - theme.spacing.xs },
  name: { flex: 1 },
  code: { ...theme.typography.strong, marginLeft: theme.spacing.md - theme.spacing.xs },
  empty: { marginTop: theme.spacing.xl },
}));
