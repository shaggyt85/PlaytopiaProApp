import { makeStyles } from "@/shared/hooks/makeStyles";

export const LOGO_SIZE = 28;

export const useStyles = makeStyles((theme) => ({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm,
  },
}));
