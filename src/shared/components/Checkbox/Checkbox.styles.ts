import { makeStyles } from "@/shared/hooks/makeStyles";

const BOX = 20;

export const useStyles = makeStyles((theme) => ({
  row: { flexDirection: "row", alignItems: "flex-start" },
  box: {
    width: BOX,
    height: BOX,
    marginTop: 2,
    marginRight: theme.spacing.md - theme.spacing.xs,
    borderWidth: 2,
    borderRadius: theme.spacing.xs,
    alignItems: "center",
    justifyContent: "center",
  },
  check: { ...theme.typography.small, fontWeight: "700", color: theme.colors.onPrimary },
  text: { flex: 1 },
}));
