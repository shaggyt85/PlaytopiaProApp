import { makeStyles } from "@/shared/hooks/makeStyles";

export const useStyles = makeStyles((theme) => ({
  // Su punto y su nombre (`text-[13px] font-semibold`).
  club: { flexDirection: "row", alignItems: "center", gap: theme.spacing.sm },
  name: { flexShrink: 1 },
}));
